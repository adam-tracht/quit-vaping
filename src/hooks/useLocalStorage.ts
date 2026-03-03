import { useState, useEffect, useCallback, useRef } from 'react';
import { AppData } from '@/types';
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
        const apiData = typeof result.data === 'object' && result.data !== null ? result.data : {};
        const mergedData = { ...getDefaultAppData(), ...apiData };
        setData(mergedData as AppData);
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

  return { data, updateData, isLoaded, syncStatus, syncError };
}
