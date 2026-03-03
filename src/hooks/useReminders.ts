import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  canShowNotifications,
  getNotificationPermission,
  requestNotificationPermission,
  showNotification,
  scheduleReminder,
  clearAllReminders,
  schedulePersistentNotification,
  clearPersistentNotification,
  isIOS,
  isStandalone,
} from '@/utils/notification';

export function useReminders() {
  const { data, updateData } = useLocalStorage();

  // Schedule reminders when data changes
  useEffect(() => {
    if (!data) return;

    clearAllReminders();

    if (data.reminders.patchEnabled) {
      // Schedule persistent notification (works with Service Worker)
      schedulePersistentNotification({
        time: data.reminders.patchTime,
        title: 'Time to apply your patch',
        body: 'Stay on track with your quit plan',
        tag: 'patch-reminder',
      });

      // Also schedule with setTimeout for immediate session
      scheduleReminder('patch', data.reminders.patchTime, () => {
        showNotification('Time to apply your patch', {
          body: 'Stay on track with your quit plan',
          tag: 'patch-reminder',
        });
      });
    } else {
      clearPersistentNotification('patch-reminder');
    }

    if (data.reminders.nrtEnabled && data.reminders.nrtTime) {
      schedulePersistentNotification({
        time: data.reminders.nrtTime,
        title: 'NRT Reminder',
        body: 'Time for your NRT medication',
        tag: 'nrt-reminder',
      });

      scheduleReminder('nrt', data.reminders.nrtTime, () => {
        showNotification('NRT Reminder', {
          body: 'Time for your NRT medication',
          tag: 'nrt-reminder',
        });
      });
    } else {
      clearPersistentNotification('nrt-reminder');
    }

    return () => clearAllReminders();
  }, [data]);

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    return granted;
  }, []);

  const updatePatchReminder = useCallback((enabled: boolean, time: string) => {
    updateData({
      reminders: {
        ...data!.reminders,
        patchEnabled: enabled,
        patchTime: time,
      },
    });
  }, [data, updateData]);

  const updateNrtReminder = useCallback((enabled: boolean, time: string | null) => {
    updateData({
      reminders: {
        ...data!.reminders,
        nrtEnabled: enabled,
        nrtTime: time,
      },
    });
  }, [data, updateData]);

  const needsPermission = canShowNotifications() && getNotificationPermission() === 'default';
  const permissionGranted = getNotificationPermission() === 'granted';
  const showIOSBanner = isIOS() && !isStandalone();

  return {
    needsPermission,
    permissionGranted,
    showIOSBanner,
    requestPermission,
    updatePatchReminder,
    updateNrtReminder,
    reminders: data?.reminders,
  };
}
