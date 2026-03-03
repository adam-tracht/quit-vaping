import { Check, Lock } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getMilestones } from '@/utils/storage';
import { MILESTONES } from '@/utils/constants';
import { useMemo } from 'react';

export function Milestones() {
  const { data } = useLocalStorage();

  const milestones = useMemo(() => {
    if (!data) return [];
    return getMilestones(data.dates.quitDate);
  }, [data]);

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <h3 className="text-text font-semibold mb-4">Milestones</h3>

      <div className="space-y-2">
        {milestones.map((milestone) => {
          const config = MILESTONES.find(m => m.days === milestone.days);
          return (
            <div
              key={milestone.days}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                milestone.achieved
                  ? 'bg-secondary/10 border border-secondary/30'
                  : 'bg-background border border-border'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  milestone.achieved ? 'bg-secondary/20' : 'bg-surface'
                }`}
              >
                {milestone.achieved ? (
                  <Check className="w-5 h-5 text-secondary" />
                ) : (
                  <Lock className="w-5 h-5 text-text-muted" />
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`font-medium ${
                    milestone.achieved ? 'text-secondary' : 'text-text-muted'
                  }`}
                >
                  {config?.emoji} {milestone.label}
                </p>
                {milestone.achieved && milestone.date && (
                  <p className="text-xs text-text-muted">
                    {new Date(milestone.date).toLocaleDateString()}
                  </p>
                )}
              </div>

              {milestone.achieved && (
                <span className="text-2xl">🎉</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
