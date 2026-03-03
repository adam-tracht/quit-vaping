import { usePhases } from '@/hooks/usePhases';

export function PatchDoseIndicator() {
  const { currentPhase, phaseColor, phaseEmoji } = usePhases();

  if (!currentPhase) return null;

  if (currentPhase.isPreQuit || currentPhase.dose === 0) {
    return (
      <div className="bg-surface rounded-xl p-4 border border-border text-center">
        <p className="text-text-muted">{phaseEmoji} {currentPhase.name}</p>
      </div>
    );
  }

  const patches: Array<{ dose: number; active: boolean }> = [
    { dose: 21, active: currentPhase.dose === 21 },
    { dose: 14, active: currentPhase.dose === 14 },
    { dose: 7, active: currentPhase.dose === 7 },
  ];

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <p className="text-sm text-text-muted mb-3">Current Dose</p>
      <div className="flex justify-between items-center gap-2">
        {patches.map((patch) => (
          <div
            key={patch.dose}
            className={`flex-1 py-3 rounded-lg text-center transition-all ${
              patch.active
                ? 'text-white'
                : 'bg-background text-text-muted'
            }`}
            style={
              patch.active
                ? { backgroundColor: phaseColor }
                : undefined
            }
          >
            <p className="text-2xl font-bold">{patch.dose}mg</p>
          </div>
        ))}
      </div>
    </div>
  );
}
