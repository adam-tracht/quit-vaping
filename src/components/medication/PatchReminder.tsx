import { Bell, BellOff } from 'lucide-react';
import { usePhases } from '@/hooks/usePhases';
import { formatTime } from '@/utils/dateUtils';

interface PatchReminderProps {
  enabled: boolean;
  time: string;
  onToggle: () => void;
  onRequestPermission?: () => void;
  needsPermission?: boolean;
}

export function PatchReminder({
  enabled,
  time,
  onToggle,
  onRequestPermission,
  needsPermission,
}: PatchReminderProps) {
  const { currentPhase } = usePhases();

  if (!currentPhase || currentPhase.isPreQuit || currentPhase.dose === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${enabled ? 'bg-primary/20' : 'bg-background'}`}>
            {enabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-text-muted" />
            )}
          </div>
          <div>
            <p className="text-text font-medium">Patch Reminder</p>
            <p className="text-sm text-text-muted">
              {enabled ? `Daily at ${formatTime(time)}` : 'Disabled'}
            </p>
          </div>
        </div>

        <button
          onClick={needsPermission ? onRequestPermission : onToggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            enabled ? 'bg-primary' : 'bg-background'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              enabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
