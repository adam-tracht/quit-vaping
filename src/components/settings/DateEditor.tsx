import { useState, useMemo } from 'react';
import { Calendar, Info } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDate } from '@/utils/dateUtils';
import { calculatePhaseDates } from '@/utils/storage';

export function DateEditor() {
  const { data, updateData } = useLocalStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(data?.dates.startDate || '');
  const [quitDate, setQuitDate] = useState(data?.dates.quitDate || '');

  // Calculate phase dates from quit date (must be before early return)
  const calculatedDates = useMemo(() => {
    const effectiveQuitDate = quitDate || data?.dates.quitDate || '';
    return effectiveQuitDate ? calculatePhaseDates(effectiveQuitDate) : {
      phase21End: '',
      phase14End: '',
      phase7End: '',
      nicotineFreeDate: '',
    };
  }, [quitDate, data?.dates.quitDate]);

  if (!data) return null;

  const displayDates = isEditing
    ? { ...data.dates, startDate, quitDate, ...calculatedDates }
    : data.dates;

  const handleSave = () => {
    updateData({
      dates: {
        ...data.dates,
        startDate,
        quitDate,
        ...calculatedDates,
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStartDate(data.dates.startDate);
    setQuitDate(data.dates.quitDate);
    setIsEditing(false);
  };

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-text font-semibold">Key Dates</h3>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-background text-text rounded-lg hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Editable dates */}
      <div className="space-y-3">
        <div className="p-3 bg-background/50 rounded-lg border border-primary/30">
          <p className="text-xs text-primary font-medium mb-1">Your Dates</p>

          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm text-text">Start Date</p>
              <p className="text-xs text-text-muted">When you started tracking</p>
              {!isEditing ? (
                <p className="text-text-muted font-mono text-sm">
                  {formatDate(displayDates.startDate)}
                </p>
              ) : (
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary"
                />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm text-text">Quit Date</p>
              <p className="text-xs text-text-muted">When you stop vaping</p>
              {!isEditing ? (
                <p className="text-text-muted font-mono text-sm">
                  {formatDate(displayDates.quitDate)}
                </p>
              ) : (
                <input
                  type="date"
                  value={quitDate}
                  onChange={(e) => setQuitDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text text-sm focus:outline-none focus:border-primary"
                />
              )}
            </div>
          </div>
        </div>

        {/* Calculated phase dates (read-only) */}
        <div className="p-3 bg-background/50 rounded-lg">
          <p className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Automatically calculated from quit date
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-text-muted">21mg phase ends</p>
              <p className="font-mono">{formatDate(displayDates.phase21End)}</p>
            </div>
            <div>
              <p className="text-text-muted">14mg phase ends</p>
              <p className="font-mono">{formatDate(displayDates.phase14End)}</p>
            </div>
            <div>
              <p className="text-text-muted">7mg phase ends</p>
              <p className="font-mono">{formatDate(displayDates.phase7End)}</p>
            </div>
            <div>
              <p className="text-text-muted">Nicotine free</p>
              <p className="font-mono">{formatDate(displayDates.nicotineFreeDate)}</p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-border text-xs text-text-muted">
            <p>• 6 weeks of 21mg patches</p>
            <p>• 2 weeks of 14mg patches</p>
            <p>• 2 weeks of 7mg patches</p>
          </div>
        </div>
      </div>
    </div>
  );
}
