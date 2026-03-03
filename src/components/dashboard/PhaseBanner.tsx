import { usePhases } from '@/hooks/usePhases';

export function PhaseBanner() {
  const { currentPhase, progress, phaseColor, phaseEmoji } = usePhases();

  if (!currentPhase) return null;

  return (
    <div
      className="bg-surface rounded-2xl p-4 border border-border"
      style={{ borderLeftColor: phaseColor, borderLeftWidth: 4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{phaseEmoji}</span>
          <div>
            <h2 className="text-lg font-semibold text-text">{currentPhase.name}</h2>
            {currentPhase.dose > 0 && (
              <p className="text-sm text-text-muted">{currentPhase.dose}mg nicotine patch</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-text" style={{ color: phaseColor }}>
            {currentPhase.dose > 0 ? `${currentPhase.dose}mg` : '✓'}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm text-text-muted">
          <span>Day {currentPhase.dayInPhase}</span>
          <span>
            {currentPhase.totalDaysInPhase === Infinity
              ? '∞'
              : `Day ${currentPhase.totalDaysInPhase}`}
          </span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: phaseColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}
