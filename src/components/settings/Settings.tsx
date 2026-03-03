import { Home, TrendingUp } from 'lucide-react';
import { DateEditor } from './DateEditor';
import { PasswordChange } from './PasswordChange';
import { DataReset } from './DataReset';
import { ReminderSettings } from '@/components/medication/ReminderSettings';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { ReminderSettings as ReminderSettingsType } from '@/types';

interface SettingsProps {
  onNavigate: (view: 'dashboard' | 'progress' | 'settings') => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const { data, updateData } = useLocalStorage();

  const handleReminderChange = (settings: Partial<ReminderSettingsType>) => {
    if (data?.reminders) {
      updateData({
        reminders: { ...data.reminders, ...settings }
      });
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Settings</h1>
      </header>

      <div className="flex gap-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex-1 py-2 bg-surface border border-border rounded-lg text-text flex items-center justify-center gap-2 hover:bg-border transition-colors"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('progress')}
          className="flex-1 py-2 bg-surface border border-border rounded-lg text-text flex items-center justify-center gap-2 hover:bg-border transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Progress
        </button>
      </div>

      <ReminderSettings
        settings={data?.reminders || {
          patchTime: '08:00',
          patchEnabled: true,
          nrtTime: null,
          nrtEnabled: false,
        }}
        onChange={handleReminderChange}
      />

      <DateEditor />
      <PasswordChange />
      <DataReset />

      <div className="text-center text-text-muted text-xs">
        <p>Quit Vaping v1.0.0</p>
        <p className="mt-1">Your personal quit-vaping companion</p>
      </div>
    </div>
  );
}
