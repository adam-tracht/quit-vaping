interface TodayStatsProps {
  vapeCount: number;
}

export function TodayStats({ vapeCount }: TodayStatsProps) {
  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <span className="text-text-muted text-sm">Vapes today</span>
      <p className="text-2xl font-bold text-primary mt-1">{vapeCount}</p>
    </div>
  );
}
