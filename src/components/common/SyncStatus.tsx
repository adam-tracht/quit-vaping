import { Loader2, Check, AlertCircle } from 'lucide-react';
import type { SyncStatus } from '@/hooks/useLocalStorage';

interface SyncStatusProps {
  status: SyncStatus;
  error?: string | null;
}

export function SyncStatusIndicator({ status, error }: SyncStatusProps) {
  if (status === 'idle' || status === 'loading') {
    return null; // Don't show anything during initial load
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Syncing...',
          className: 'text-text-muted',
          bgClassName: 'bg-surface/80',
        };
      case 'synced':
        return {
          icon: <Check className="w-4 h-4" />,
          text: 'Synced',
          className: 'text-green-500',
          bgClassName: 'bg-green-500/10 border-green-500/20',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: error || 'Sync failed',
          className: 'text-amber-500',
          bgClassName: 'bg-amber-500/10 border-amber-500/20',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`fixed top-4 right-4 z-40 px-3 py-2 rounded-lg border flex items-center gap-2 text-xs ${config.bgClassName} ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
