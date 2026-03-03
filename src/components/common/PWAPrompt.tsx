import { Download, X } from 'lucide-react';

interface PWAPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function PWAPrompt({ onInstall, onDismiss }: PWAPromptProps) {
  return (
    <div className="fixed bottom-20 left-4 right-4 bg-surface border border-primary/30 rounded-xl p-4 shadow-lg z-40 animate-in slide-in-from-bottom">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-text font-semibold">Install App</h3>
          <p className="text-sm text-text-muted mt-1">
            Add to home screen for the best experience
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={onInstall}
              className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Install
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2 bg-background text-text-muted rounded-lg text-sm hover:bg-border transition-colors"
            >
              Not now
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-text-muted hover:text-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
