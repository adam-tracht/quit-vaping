import { PhaseBanner } from './PhaseBanner';
import { CravingButton } from './CravingButton';
import { TodayStats } from './TodayStats';
import { StreakDisplay } from './StreakDisplay';
import { MilestoneCountdown } from './MilestoneCountdown';

interface DashboardProps {
  onStartCravingTimer: () => void;
  onQuickLog: () => void;
  timerActive: boolean;
  passedCount: number;
  gaveInCount: number;
}

export function Dashboard({
  onStartCravingTimer,
  onQuickLog,
  timerActive,
  passedCount,
  gaveInCount,
}: DashboardProps) {
  return (
    <div className="space-y-4 pb-24">
      <StreakDisplay />
      <PhaseBanner />
      <MilestoneCountdown />
      <TodayStats passedCount={passedCount} gaveInCount={gaveInCount} />
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onQuickLog}
          disabled={timerActive}
          className="py-4 px-3 bg-surface border border-border rounded-xl font-medium text-text hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Quick Log
        </button>
        <CravingButton onPress={onStartCravingTimer} disabled={timerActive} />
      </div>
    </div>
  );
}
