import { useState, useEffect, useCallback, useRef } from 'react';
import { AppData, CravingLog } from '@/types';
import { loadAppData, saveAppData, getDefaultAppData } from '@/utils/storage';
import { fetchData, saveData as saveApiData } from '@/utils/api';

export type SyncStatus = 'idle' | 'loading' | 'syncing' | 'synced' | 'error';

export function useLocalStorage() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data on mount - try API first, fall back to localStorage
  useEffect(() => {
    const loadData = async () => {
      setSyncStatus('loading');
      try {
        // Try to fetch from API first
        const result = await fetchData();
        // Merge with defaults to ensure all required fields exist
        const defaults = getDefaultAppData();

        // Safely merge API data with defaults
        const apiData = typeof result.data === 'object' && result.data !== null ? result.data : {};

        // Type guards to validate nested objects
        const hasValidDates = (apiData as any)?.dates &&
          typeof (apiData as any).dates === 'object' &&
          Object.keys(defaults.dates).every(key => key in (apiData as any).dates);

        const hasValidReminders = (apiData as any)?.reminders &&
          typeof (apiData as any).reminders === 'object' &&
          Object.keys(defaults.reminders).every(key => key in (apiData as any).reminders);

        const mergedData: AppData = {
          password: (apiData as any).password ?? defaults.password,
          dates: hasValidDates ? { ...defaults.dates, ...(apiData as any).dates } : defaults.dates,
          reminders: hasValidReminders ? { ...defaults.reminders, ...(apiData as any).reminders } : defaults.reminders,
          cravings: Array.isArray((apiData as any).cravings) ? (apiData as any).cravings : defaults.cravings,
          lastPuffTime: (apiData as any).lastPuffTime ?? defaults.lastPuffTime,
          pwaInstalled: (apiData as any).pwaInstalled ?? defaults.pwaInstalled,
        };
        setData(mergedData);
        setSyncStatus('synced');
        setSyncError(null);
        // Also save to localStorage as backup
        saveAppData(mergedData as AppData);
      } catch (error) {
        // Fall back to localStorage if API fails
        console.log('API fetch failed, using localStorage:', error);
        const localData = loadAppData();
        setData(localData);
        setSyncStatus('idle'); // No sync attempt yet
        setSyncError(error instanceof Error ? error.message : 'Unknown error');
      }
      setIsLoaded(true);
    };

    loadData();
  }, []);

  // Save data whenever it changes - debounce and sync to API
  useEffect(() => {
    if (!isLoaded || !data) return;

    // Always save to localStorage immediately
    saveAppData(data);

    // Debounce API sync to avoid too many requests
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        await saveApiData(data);
        setSyncStatus('synced');
        setSyncError(null);
      } catch (error) {
        console.error('Failed to sync to API:', error);
        setSyncStatus('error');
        setSyncError(error instanceof Error ? error.message : 'Unknown error');
      }
    }, 1000); // 1 second debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, isLoaded]);

  const updateData = useCallback((updates: Partial<AppData>) => {
    setData(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Centralized addCraving function that updates React state
  // This ensures re-renders are triggered and data is synced to API
  const addCraving = useCallback((craving: Omit<CravingLog, 'id'>) => {
    setData(prev => {
      if (!prev) return null;

      const newLog: CravingLog = {
        ...craving,
        id: crypto.randomUUID(),
      };

      const newCravings = [...prev.cravings, newLog];
      const newLastPuffTime = craving.result === 'gave_in'
        ? craving.timestamp
        : prev.lastPuffTime;

      return {
        ...prev,
        cravings: newCravings,
        lastPuffTime: newLastPuffTime,
      };
    });
  }, []);

  return { data, updateData, isLoaded, syncStatus, syncError, addCraving };
}
