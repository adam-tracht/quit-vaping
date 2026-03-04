// Date types
export interface AppDates {
  startDate: string;          // ISO date: "2026-03-02"
  quitDate: string;           // ISO date: "2026-03-10"
  phase21End: string;         // ISO date: "2026-04-21"
  phase14End: string;         // ISO date: "2026-05-05"
  phase7End: string;          // ISO date: "2026-05-19"
  nicotineFreeDate: string;   // ISO date: "2026-05-19"
}

// Reminder types
export interface ReminderSettings {
  patchTime: string;          // "08:00"
  patchEnabled: boolean;
}

// Vape log type
export interface CravingLog {
  id: string;                 // UUID
  timestamp: string;          // ISO datetime when vape occurred
}

// Main app data (stored in localStorage)
export interface AppData {
  password: string;           // Hashed password
  dates: AppDates;
  reminders: ReminderSettings;
  cravings: CravingLog[];
  lastPuffTime: string | null; // ISO timestamp of last "gave in" craving
  pwaInstalled: boolean;
}

// Computed phase (not stored)
export interface CurrentPhase {
  name: string;               // "Pre-quit", "21mg Patch", "14mg Patch", "7mg Patch", "Nicotine Free"
  dose: number;               // 21, 14, 7, or 0
  dayInPhase: number;
  totalDaysInPhase: number;
  startDate: string;
  endDate: string | null;
  isPreQuit: boolean;
}

// LocalStorage keys
export const STORAGE_KEY = "quitVapingData";
