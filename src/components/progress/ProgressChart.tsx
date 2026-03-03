import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getRecentCravings } from '@/utils/storage';
import { format, subDays } from 'date-fns';

export function ProgressChart() {
  const { data } = useLocalStorage();

  const chartData = useMemo(() => {
    if (!data) return [];

    const cravingsMap = getRecentCravings(14);

    // Generate data for the last 14 days
    const days = 14;
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const key = date.toISOString().split('T')[0];
      const dayCravings = cravingsMap.get(key) || [];

      result.push({
        date: format(date, 'MMM dd'),
        passed: dayCravings.filter(c => c.result === 'passed').length,
        gaveIn: dayCravings.filter(c => c.result === 'gave_in').length,
      });
    }

    return result;
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-8 border border-border text-center">
        <p className="text-text-muted">No data yet. Start logging your cravings!</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <h3 className="text-text font-semibold mb-4">Last 14 Days</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            stroke="#334155"
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            stroke="#334155"
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
          />
          <Bar dataKey="passed" name="Passed" stackId="stack">
            {chartData.map((_entry, index) => (
              <Cell key={`cell-passed-${index}`} fill="#10b981" />
            ))}
          </Bar>
          <Bar dataKey="gaveIn" name="Gave In" stackId="stack">
            {chartData.map((_entry, index) => (
              <Cell key={`cell-gavein-${index}`} fill="#f43f5e" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
