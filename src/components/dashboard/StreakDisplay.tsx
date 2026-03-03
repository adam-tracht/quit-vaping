import { Calendar, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getDaysClean } from '@/utils/storage';
import { useState, useEffect } from 'react';

export function StreakDisplay() {
  const { data } = useLocalStorage();
  const [timeSinceLastPuff, setTimeSinceLastPuff] = useState<string>('');

  // Update time since last puff every minute
  useEffect(() => {
    const updateTime = () => {
      if (!data?.lastPuffTime) {
        setTimeSinceLastPuff('');
        return;
      }

      const now = new Date();
      const then = new Date(data.lastPuffTime);
      const diffMs = now.getTime() - then.getTime();

      // Less than a minute
      if (diffMs < 60 * 1000) {
        setTimeSinceLastPuff('Just now');
        return;
      }

      // Less than an hour
      const minutes = Math.floor(diffMs / (60 * 1000));
      if (minutes < 60) {
        setTimeSinceLastPuff(`${minutes}m ago`);
        return;
      }

      // Less than a day
      const hours = Math.floor(diffMs / (60 * 60 * 1000));
      if (hours < 24) {
        setTimeSinceLastPuff(`${hours}h ago`);
        return;
      }

      // Days
      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      setTimeSinceLastPuff(`${days}d ago`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [data?.lastPuffTime]);

  if (!data) return null;

  const daysClean = getDaysClean(data.dates.quitDate);
  const hasLastPuff = data.lastPuffTime !== null;

  return (
    <div className="bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-xl p-4 border border-primary/30">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-text-muted text-sm">Days Clean</p>
          <p className="text-3xl font-bold text-primary">{daysClean}</p>
        </div>
      </div>
      {hasLastPuff && (
        <div className="mt-3 pt-3 border-t border-primary/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <p className="text-text-muted text-sm">
            Last vape: <span className="text-text-secondary">{timeSinceLastPuff}</span>
          </p>
        </div>
      )}
    </div>
  );
}
