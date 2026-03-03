import { X, CheckCircle } from 'lucide-react';
import { BreathingGuide } from './BreathingGuide';
import { CravingTimerState } from '@/types';

interface CravingTimerProps {
  timerState: CravingTimerState;
  onClose: () => void;
  onCancel: () => void;
  randomTip: string;
}

export function CravingTimer({ timerState, onClose, onCancel, randomTip }: CravingTimerProps) {
  const minutes = Math.floor(timerState.duration / 60);
  const seconds = timerState.duration % 60;

  const circumference = 2 * Math.PI * 45;
  const progress = timerState.duration / 300;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-text">Craving Timer</h1>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-text transition-colors"
          aria-label="Cancel"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-surface"
            />
            <circle
              cx="96"
              cy="96"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-primary"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-text">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {timerState.duration > 0 && <BreathingGuide />}

        {timerState.duration === 0 && (
          <div className="text-center mt-8">
            <p className="text-2xl text-text font-semibold mb-2">Time's up!</p>
            <p className="text-text-muted">How did it go?</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-surface rounded-xl max-w-sm w-full">
          <p className="text-sm text-text-muted text-center mb-4">💡 Tip: {randomTip}</p>
          {timerState.duration > 0 && (
            <button
              onClick={onClose}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              I'm Done - Log Result
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
