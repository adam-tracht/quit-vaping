import { useState, useEffect } from 'react';
import { Wind } from 'lucide-react';
import { BREATHING_MESSAGES } from '@/utils/constants';

export function BreathingGuide() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [count, setCount] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev > 1) {
          return prev - 1;
        }

        setPhase(current => {
          if (current === 'in') return 'hold';
          if (current === 'hold') return 'out';
          return 'in';
        });

        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMessage = () => {
    if (phase === 'in') return BREATHING_MESSAGES[0];
    if (phase === 'hold') return BREATHING_MESSAGES[1];
    return BREATHING_MESSAGES[2];
  };

  const getAnimation = () => {
    switch (phase) {
      case 'in':
        return 'breathe-in';
      case 'hold':
        return 'breathe-hold';
      case 'out':
        return 'breathe-out';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-${getAnimation()}`}
        style={{ animationDuration: '4s', animationIterationCount: 'infinite' }}
      >
        <Wind className="w-16 h-16 text-primary" />
      </div>

      <div className="mt-6 text-center">
        <p className="text-xl text-text font-medium">{getMessage()}</p>
        <p className="text-4xl font-bold text-primary mt-2">{count}</p>
      </div>
    </div>
  );
}
