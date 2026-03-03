import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getDaysClean } from '@/utils/storage';

export function DaysClean() {
  const { data } = useLocalStorage();

  if (!data) return null;

  const daysClean = getDaysClean(data.dates.quitDate);

  return (
    <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl p-6 border border-secondary/30 text-center">
      <p className="text-text-muted mb-2">Days Since Quit Date</p>
      <p className="text-6xl font-bold text-secondary">{daysClean}</p>
      <p className="text-text-muted mt-2">
        {new Date(data.dates.quitDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
