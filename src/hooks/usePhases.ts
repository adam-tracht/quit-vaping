import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getCurrentPhase, getPhaseProgress, getPhaseColor, getPhaseEmoji } from '@/utils/dateUtils';

export function usePhases() {
  const { data } = useLocalStorage();

  const currentPhase = useMemo(() => {
    if (!data) return null;
    return getCurrentPhase(data.dates);
  }, [data]);

  const progress = useMemo(() => {
    if (!currentPhase) return 0;
    return getPhaseProgress(currentPhase);
  }, [currentPhase]);

  const phaseColor = useMemo(() => {
    if (!currentPhase) return '#6366f1';
    return getPhaseColor(currentPhase.dose);
  }, [currentPhase]);

  const phaseEmoji = useMemo(() => {
    if (!currentPhase) return '💪';
    return getPhaseEmoji(currentPhase.dose);
  }, [currentPhase]);

  return {
    currentPhase,
    progress,
    phaseColor,
    phaseEmoji,
  };
}
