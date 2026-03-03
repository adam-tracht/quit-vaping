import { X, CheckCircle, XCircle } from 'lucide-react';
import type { CravingResult } from '@/types';

interface QuickLogProps {
  onLog: (result: CravingResult) => void;
  onClose: () => void;
}

export function QuickLog({ onLog, onClose }: QuickLogProps) {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-text">Quick Log</h1>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-center text-text-muted mb-6">
          How did you handle the craving?
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onLog('passed')}
            className="w-full p-4 bg-secondary/20 border border-secondary/30 rounded-xl flex items-center gap-3 hover:bg-secondary/30 transition-colors"
          >
            <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0" />
            <div className="text-left">
              <p className="text-text font-medium">I resisted!</p>
              <p className="text-sm text-text-muted">The craving passed without vaping</p>
            </div>
          </button>

          <button
            onClick={() => onLog('gave_in')}
            className="w-full p-4 bg-danger/20 border border-danger/30 rounded-xl flex items-center gap-3 hover:bg-danger/30 transition-colors"
          >
            <XCircle className="w-6 h-6 text-danger flex-shrink-0" />
            <div className="text-left">
              <p className="text-text font-medium">I vaped</p>
              <p className="text-sm text-text-muted">That's okay, keep trying!</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
