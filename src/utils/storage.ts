import { AppData, CravingLog, STORAGE_KEY, CRAVING_STATE_KEY } from '@/types';
import { differenceInDays, startOfDay } from 'date-fns';

// Parse ISO date string as local date (not UTC)
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Validate that dates are properly set
function isValidDates(dates: any): boolean {
  if (!dates || typeof dates !== 'object') return false;
  const requiredFields = ['startDate', 'quitDate', 'phase21End', 'phase14End', 'phase7End', 'nicotineFreeDate'];
  for (const field of requiredFields) {
    if (!dates[field] || typeof dates[field] !== 'string') {
      return false;
    }
    const date = new Date(dates[field]);
    if (isNaN(date.getTime())) {
      return false;
    }
  }
  return true;
}

// Default app data
export const getDefaultAppData = (): AppData => {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];

  // Calculate default dates: 8 days pre-quit, then 6 weeks taper
  const quitDate = new Date(today);
  quitDate.setDate(quitDate.getDate() + 8);

  const phase21End = new Date(quitDate);
  phase21End.setDate(phase21End.getDate() + 42); // 6 weeks

  const phase14End = new Date(phase21End);
  phase14End.setDate(phase14End.getDate() + 14); // 2 weeks

  const phase7End = new Date(phase14End);
  phase7End.setDate(phase7End.getDate() + 14); // 2 weeks

  return {
    password: hashPassword('quit'),
    dates: {
      startDate,
      quitDate: quitDate.toISOString().split('T')[0],
      phase21End: phase21End.toISOString().split('T')[0],
      phase14End: phase14End.toISOString().split('T')[0],
      phase7End: phase7End.toISOString().split('T')[0],
      nicotineFreeDate: phase7End.toISOString().split('T')[0],
    },
    reminders: {
      patchTime: '08:00',
      patchEnabled: true,
      nrtTime: null,
      nrtEnabled: false,
    },
    cravings: [],
    lastPuffTime: null,
    pwaInstalled: false,
  };
};

// Simple hash function for password (not for production use)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Load app data from localStorage
export function loadAppData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as AppData;
      // Validate dates - if invalid, reset to defaults
      if (!isValidDates(data.dates)) {
        console.warn('Invalid dates detected, resetting to defaults');
        return getDefaultAppData();
      }
      // Ensure lastPuffTime exists (for backward compatibility)
      if (data.lastPuffTime === undefined) {
        data.lastPuffTime = null;
      }
      return data;
    }
  } catch (error) {
    console.error('Error loading app data:', error);
  }
  return getDefaultAppData();
}

// Save app data to localStorage
export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving app data:', error);
  }
}

/**
 * @deprecated Use addCraving from useLocalStorage hook instead.
 * This function directly modifies localStorage and won't trigger React re-renders or API sync.
 */
export function addCravingLog(craving: Omit<CravingLog, 'id'>): CravingLog {
  const data = loadAppData();
  const newLog: CravingLog = {
    ...craving,
    id: crypto.randomUUID(),
  };
  data.cravings.push(newLog);

  // Update lastPuffTime if user gave in
  if (craving.result === 'gave_in') {
    data.lastPuffTime = craving.timestamp;
  }

  saveAppData(data);
  return newLog;
}

// Get today's cravings
export function getTodaysCravings(): CravingLog[] {
  const data = loadAppData();
  const today = startOfDay(new Date());

  return data.cravings.filter(log => {
    const logDate = startOfDay(new Date(log.timestamp));
    return differenceInDays(today, logDate) === 0;
  });
}

// Get cravings for the last N days
export function getRecentCravings(days: number = 30): Map<string, CravingLog[]> {
  const data = loadAppData();
  const result = new Map<string, CravingLog[]>();

  // Initialize map with last N days
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    result.set(key, []);
  }

  // Fill in cravings
  data.cravings.forEach(log => {
    const key = log.timestamp.split('T')[0];
    if (result.has(key)) {
      result.get(key)!.push(log);
    }
  });

  return result;
}

// Calculate days clean
export function getDaysClean(quitDate: string): number {
  const quit = parseLocalDate(quitDate);
  const now = new Date();
  return Math.max(0, differenceInDays(now, quit));
}

// Calculate milestones
export interface Milestone {
  days: number;
  label: string;
  achieved: boolean;
  date?: string;
}

export function getMilestones(quitDate: string): Milestone[] {
  const milestones = [
    { days: 1, label: 'First day' },
    { days: 3, label: '3 days' },
    { days: 7, label: '1 week' },
    { days: 14, label: '2 weeks' },
    { days: 30, label: '1 month' },
    { days: 60, label: '2 months' },
    { days: 90, label: '3 months' },
    { days: 180, label: '6 months' },
    { days: 365, label: '1 year' },
  ];

  const daysClean = getDaysClean(quitDate);
  const quit = parseLocalDate(quitDate);

  return milestones.map(m => {
    const achieved = daysClean >= m.days;
    let date: string | undefined;
    if (achieved) {
      const d = new Date(quit);
      d.setDate(d.getDate() + m.days);
      date = d.toISOString().split('T')[0];
    }
    return { ...m, achieved, date };
  });
}

// Verify password
export function verifyPassword(input: string, stored: string): boolean {
  return hashPassword(input) === stored;
}

// Reset all data
export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CRAVING_STATE_KEY);
}

// Calculate phase end dates from quit date
export function calculatePhaseDates(quitDateStr: string): {
  phase21End: string;
  phase14End: string;
  phase7End: string;
  nicotineFreeDate: string;
} {
  const quitDate = new Date(quitDateStr);

  const phase21End = new Date(quitDate);
  phase21End.setDate(phase21End.getDate() + 42); // 6 weeks of 21mg

  const phase14End = new Date(phase21End);
  phase14End.setDate(phase14End.getDate() + 14); // 2 weeks of 14mg

  const phase7End = new Date(phase14End);
  phase7End.setDate(phase7End.getDate() + 14); // 2 weeks of 7mg

  return {
    phase21End: phase21End.toISOString().split('T')[0],
    phase14End: phase14End.toISOString().split('T')[0],
    phase7End: phase7End.toISOString().split('T')[0],
    nicotineFreeDate: phase7End.toISOString().split('T')[0],
  };
}

// Format time since timestamp in human-readable format
export function formatTimeSince(timestamp: string | null): string {
  if (!timestamp) return 'Never';

  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();

  // Less than a minute
  if (diffMs < 60 * 1000) {
    return 'Just now';
  }

  // Less than an hour
  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  // Less than a day
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  // Days
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days === 1) {
    return 'Yesterday';
  }
  return `${days} days ago`;
}
