import { Clock, Bell, AlertCircle } from 'lucide-react';
import type { ReminderSettings } from '@/types';
import { useReminders } from '@/hooks/useReminders';

interface ReminderSettingsProps {
  settings: ReminderSettings;
  onChange: (settings: Partial<ReminderSettings>) => void;
}

export function ReminderSettings({ settings, onChange }: ReminderSettingsProps) {
  const { needsPermission, permissionGranted, requestPermission } = useReminders();

  const handlePatchTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ patchTime: e.target.value });
  };

  const handlePatchEnabledChange = async (enabled: boolean) => {
    // Request permission before enabling
    if (enabled && needsPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    onChange({ patchEnabled: enabled });
  };

  const handleNrtTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ nrtTime: e.target.value });
  };

  const handleNrtEnabledChange = async (enabled: boolean) => {
    // Request permission before enabling
    if (enabled && needsPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    onChange({ nrtEnabled: enabled, nrtTime: enabled ? settings.nrtTime || '12:00' : null });
  };

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  return (
    <div className="space-y-4">
      {/* Notification Permission Banner */}
      {needsPermission && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-text font-medium mb-1">Enable Notifications</p>
              <p className="text-sm text-text-muted mb-3">
                Allow notifications to receive patch and medication reminders
              </p>
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Granted Badge */}
      {permissionGranted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-green-500" />
            <p className="text-sm text-green-500">Notifications enabled</p>
          </div>
        </div>
      )}

      {/* Patch Reminder */}
      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-text font-medium">Patch Reminder</span>
          </div>
          <button
            onClick={() => handlePatchEnabledChange(!settings.patchEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.patchEnabled ? 'bg-primary' : 'bg-background'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                settings.patchEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {settings.patchEnabled && (
          <div>
            <label className="text-sm text-text-muted block mb-2">Reminder Time</label>
            <input
              type="time"
              value={settings.patchTime}
              onChange={handlePatchTimeChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary"
            />
          </div>
        )}
      </div>

      {/* NRT Reminder */}
      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span className="text-text font-medium">NRT Reminder</span>
          </div>
          <button
            onClick={() => handleNrtEnabledChange(!settings.nrtEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.nrtEnabled ? 'bg-secondary' : 'bg-background'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                settings.nrtEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {settings.nrtEnabled && (
          <div>
            <label className="text-sm text-text-muted block mb-2">Reminder Time</label>
            <input
              type="time"
              value={settings.nrtTime || '12:00'}
              onChange={handleNrtTimeChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
