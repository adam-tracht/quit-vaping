import { Clock } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getNextMilestone } from '@/utils/dateUtils';

export function MilestoneCountdown() {
  const { data } = useLocalStorage();

  if (!data) return null;

  const nextMilestone = getNextMilestone(data.dates);

  // Don't show if in nicotine-free phase (no next milestone)
  if (!nextMilestone) {
    return null;
  }

  const { label, days, hours } = nextMilestone;

  // Format the countdown
  const formatCountdown = () => {
    if (days === 0 && hours === 0) {
      return 'Starting soon!';
    }
    if (days === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (hours === 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    return `${days}d ${hours}h`;
  };

  return (
    <div className="bg-gradient-to-br from-surface/80 to-surface/60 rounded-xl p-4 border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-text-muted text-xs">Next Milestone</p>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{formatCountdown()}</p>
        </div>
      </div>
    </div>
  );
}
