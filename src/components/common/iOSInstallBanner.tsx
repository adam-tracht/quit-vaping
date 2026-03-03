import { Share, X } from 'lucide-react';

interface IOSInstallBannerProps {
  onDismiss: () => void;
}

export function IOSInstallBanner({ onDismiss }: IOSInstallBannerProps) {
  return (
    <div className="fixed bottom-20 left-4 right-4 bg-surface border border-primary/30 rounded-xl p-4 shadow-lg z-40 animate-in slide-in-from-bottom">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-text-muted hover:text-text transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
          <Share className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-text font-semibold">Install on iPhone</h3>
          <p className="text-sm text-text-muted">Add to home screen</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">1</span>
          <span>Tap the <strong className="text-text">Share</strong> button</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">2</span>
          <span>Scroll down and tap <strong className="text-text">Add to Home Screen</strong></span>
        </div>
      </div>
    </div>
  );
}
