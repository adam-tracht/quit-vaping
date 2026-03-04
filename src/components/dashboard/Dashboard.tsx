import { PhaseBanner } from './PhaseBanner';
import { TodayStats } from './TodayStats';
import { StreakDisplay } from './StreakDisplay';
import { MilestoneCountdown } from './MilestoneCountdown';

interface DashboardProps {
  onLogVape: () => void;
  todayVapeCount: number;
}

export function Dashboard({
  onLogVape,
  todayVapeCount,
}: DashboardProps) {
  return (
    <div className="space-y-4 pb-24">
      <StreakDisplay />
      <PhaseBanner />
      <MilestoneCountdown />
      <TodayStats vapeCount={todayVapeCount} />
      <button
        onClick={onLogVape}
        className="w-full py-4 px-6 bg-primary text-white rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors active:scale-98"
      >
        Log Vape
      </button>
    </div>
  );
}
