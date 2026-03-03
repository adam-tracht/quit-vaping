import { TrendingUp, TrendingDown } from 'lucide-react';

interface TodayStatsProps {
  passedCount: number;
  gaveInCount: number;
}

export function TodayStats({ passedCount, gaveInCount }: TodayStatsProps) {
  const total = passedCount + gaveInCount;
  const successRate = total > 0 ? Math.round((passedCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-secondary" />
          <span className="text-text-muted text-sm">Won</span>
        </div>
        <p className="text-2xl font-bold text-secondary">{passedCount}</p>
      </div>

      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown className="w-4 h-4 text-danger" />
          <span className="text-text-muted text-sm">Gave in</span>
        </div>
        <p className="text-2xl font-bold text-danger">{gaveInCount}</p>
      </div>

      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-text-muted text-sm">Rate</span>
        </div>
        <p className="text-2xl font-bold text-primary">{successRate}%</p>
      </div>
    </div>
  );
}
