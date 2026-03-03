import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { CravingTimerState, CravingResult } from '@/types';
import { CRAVING_STATE_KEY } from '@/types';
import { addCravingLog, getTodaysCravings } from '@/utils/storage';
import { CRAVING_TIMER_DURATION, CRAVING_TIPS } from '@/utils/constants';

export function useCravings() {
  const [timerState, setTimerState] = useState<CravingTimerState>({
    active: false,
    startTime: null,
    duration: CRAVING_TIMER_DURATION,
  });

  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  // Load timer state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CRAVING_STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CravingTimerState;
        if (parsed.active && parsed.startTime) {
          const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
          const remaining = parsed.duration - elapsed;
          if (remaining > 0) {
            setTimerState({
              active: true,
              startTime: parsed.startTime,
              duration: remaining,
            });
            startTimeRef.current = parsed.startTime;
          } else {
            // Timer expired while app was closed
            localStorage.removeItem(CRAVING_STATE_KEY);
          }
        }
      }
    } catch (error) {
      console.error('Error loading craving state:', error);
    }
  }, []);

  // Save timer state whenever it changes
  useEffect(() => {
    if (timerState.active) {
      localStorage.setItem(CRAVING_STATE_KEY, JSON.stringify(timerState));
    } else {
      localStorage.removeItem(CRAVING_STATE_KEY);
    }
  }, [timerState]);

  // Timer countdown effect
  useEffect(() => {
    if (!timerState.active || timerState.duration <= 0) {
      return;
    }

    const tick = () => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = CRAVING_TIMER_DURATION - elapsed;

        if (remaining <= 0) {
          setTimerState(prev => ({ ...prev, duration: 0 }));
        } else {
          setTimerState(prev => ({ ...prev, duration: remaining }));
          animationFrameRef.current = requestAnimationFrame(tick);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timerState.active]);

  const startTimer = useCallback(() => {
    const startTime = Date.now();
    startTimeRef.current = startTime;
    setTimerState({
      active: true,
      startTime,
      duration: CRAVING_TIMER_DURATION,
    });
  }, []);

  const stopTimer = useCallback(() => {
    setTimerState({
      active: false,
      startTime: null,
      duration: CRAVING_TIMER_DURATION,
    });
  }, []);

  const logCraving = useCallback((result: CravingResult) => {
    const duration = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : undefined;

    addCravingLog({
      timestamp: new Date().toISOString(),
      result,
      duration,
    });

    stopTimer();
  }, [stopTimer]);

  const quickLog = useCallback((result: CravingResult) => {
    addCravingLog({
      timestamp: new Date().toISOString(),
      result,
    });
  }, []);

  const todaysCravings = getTodaysCravings();

  const passedCount = todaysCravings.filter(c => c.result === 'passed').length;
  const gaveInCount = todaysCravings.filter(c => c.result === 'gave_in').length;

  // Only generate a new tip when the timer becomes active
  const randomTip = useMemo(() => {
    return CRAVING_TIPS[Math.floor(Math.random() * CRAVING_TIPS.length)];
  }, [timerState.active]);

  return {
    timerState,
    startTimer,
    stopTimer,
    logCraving,
    quickLog,
    todaysCravings,
    passedCount,
    gaveInCount,
    randomTip,
  };
}
