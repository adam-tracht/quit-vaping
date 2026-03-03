import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { CravingResult as CravingResultType } from '@/types';

interface CravingResultProps {
  onResult: (result: CravingResultType) => void;
}

export function CravingResult({ onResult }: CravingResultProps) {
  return (
    <div className="space-y-3">
      <p className="text-center text-text mb-4">Did the craving pass?</p>

      <button
        onClick={() => onResult('passed')}
        className="w-full p-4 bg-secondary/20 border border-secondary/30 rounded-xl flex items-center gap-3 hover:bg-secondary/30 transition-colors"
      >
        <CheckCircle className="w-6 h-6 text-secondary" />
        <div className="text-left">
          <p className="text-text font-medium">Yes, it passed!</p>
          <p className="text-sm text-text-muted">I resisted the urge</p>
        </div>
      </button>

      <button
        onClick={() => onResult('gave_in')}
        className="w-full p-4 bg-danger/20 border border-danger/30 rounded-xl flex items-center gap-3 hover:bg-danger/30 transition-colors"
      >
        <XCircle className="w-6 h-6 text-danger" />
        <div className="text-left">
          <p className="text-text font-medium">No, I vaped</p>
          <p className="text-sm text-text-muted">That's okay, try again next time</p>
        </div>
      </button>

      <button
        onClick={() => onResult('ongoing')}
        className="w-full p-4 bg-surface border border-border rounded-xl flex items-center gap-3 hover:bg-border transition-colors"
      >
        <Clock className="w-6 h-6 text-text-muted" />
        <div className="text-left">
          <p className="text-text font-medium">Still going</p>
          <p className="text-sm text-text-muted">The craving hasn't passed yet</p>
        </div>
      </button>
    </div>
  );
}
