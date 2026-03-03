import { Home, Settings } from 'lucide-react';
import { DaysClean } from './DaysClean';
import { ProgressChart } from './ProgressChart';
import { Milestones } from './Milestones';

interface ProgressViewProps {
  onNavigate: (view: 'dashboard' | 'progress' | 'settings') => void;
}

export function ProgressView({ onNavigate }: ProgressViewProps) {
  return (
    <div className="space-y-4 pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Progress</h1>
      </header>

      <div className="flex gap-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex-1 py-2 bg-surface border border-border rounded-lg text-text flex items-center justify-center gap-2 hover:bg-border transition-colors"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className="flex-1 py-2 bg-surface border border-border rounded-lg text-text flex items-center justify-center gap-2 hover:bg-border transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      <DaysClean />
      <ProgressChart />
      <Milestones />
    </div>
  );
}
