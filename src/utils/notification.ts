// Notification utilities

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (window as any).navigator.standalone === true;
}

export function canShowNotifications(): boolean {
  return 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!canShowNotifications()) {
    return 'denied';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!canShowNotifications()) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title: string, options?: NotificationOptions): void {
  if (getNotificationPermission() === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    });
  }
}

let reminderTimeouts: Map<string, number> = new Map();

export function scheduleReminder(type: 'patch', time: string, callback: () => void): void {
  // Clear existing timeout for this type
  const existing = reminderTimeouts.get(type);
  if (existing) {
    clearTimeout(existing);
  }

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  const timeoutId = window.setTimeout(() => {
    callback();
    // Reschedule for next day
    scheduleReminder(type, time, callback);
  }, delay);

  reminderTimeouts.set(type, timeoutId);
}

export function clearReminder(type: string): void {
  const existing = reminderTimeouts.get(type);
  if (existing) {
    clearTimeout(existing);
    reminderTimeouts.delete(type);
  }
}

export function clearAllReminders(): void {
  reminderTimeouts.forEach((timeout) => clearTimeout(timeout));
  reminderTimeouts.clear();
}

// Service Worker based push notification utilities
export interface ScheduledNotification {
  id: string;
  time: string; // HH:MM format
  title: string;
  body: string;
  tag?: string;
}

const STORAGE_KEY = 'scheduledNotifications';

// Save scheduled notifications to localStorage for persistence
function getScheduledNotifications(): ScheduledNotification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveScheduledNotifications(notifications: ScheduledNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving scheduled notifications:', error);
  }
}

// Schedule a persistent notification (works with Service Worker)
export function schedulePersistentNotification(notification: Omit<ScheduledNotification, 'id'>): void {
  const notifications = getScheduledNotifications();
  const newNotification: ScheduledNotification = {
    ...notification,
    id: crypto.randomUUID(),
  };
  notifications.push(newNotification);
  saveScheduledNotifications(notifications);

  // Also schedule with setTimeout for immediate session
  scheduleReminder('patch', notification.time, () => {
    showNotification(notification.title, {
      body: notification.body,
      tag: notification.tag,
    });
  });

  // Notify Service Worker if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      notification: newNotification,
    });
  }
}

// Clear a specific persistent notification
export function clearPersistentNotification(tag: string): void {
  const notifications = getScheduledNotifications().filter(n => n.tag !== tag);
  saveScheduledNotifications(notifications);

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_NOTIFICATION',
      tag,
    });
  }
}

// Get all scheduled notifications
export function getScheduledNotificationsList(): ScheduledNotification[] {
  return getScheduledNotifications();
}

// Initialize notifications from localStorage on page load
export function initializeStoredNotifications(callback: (notification: ScheduledNotification) => void): void {
  const notifications = getScheduledNotifications();

  notifications.forEach(notification => {
    scheduleReminder('patch', notification.time, () => {
      callback(notification);
    });
  });
}

// Craving timer notification utilities
const CRAVING_TIMER_TAG = 'craving-timer';
let cravingTimerTimeout: number | null = null;

/**
 * Schedule a notification to fire when the craving timer completes
 */
export function scheduleCravingTimerNotification(durationMs: number): void {
  // Clear any existing craving timer notification
  clearCravingTimerNotification();

  // Schedule notification via service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_CRAVING_TIMER',
      durationMs,
    });
  }

  // Also schedule with setTimeout for immediate session
  cravingTimerTimeout = window.setTimeout(() => {
    showNotification("Time's up!", {
      body: 'Your craving timer is complete. How did it go?',
      tag: CRAVING_TIMER_TAG,
      requireInteraction: true,
    });
  }, durationMs);
}

/**
 * Clear the scheduled craving timer notification
 */
export function clearCravingTimerNotification(): void {
  // Clear local timeout
  if (cravingTimerTimeout) {
    clearTimeout(cravingTimerTimeout);
    cravingTimerTimeout = null;
  }

  // Clear via service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CRAVING_TIMER',
    });
  }
}
