import { CurrentPhase, AppDates } from '@/types';

// Parse ISO date string as local date (not UTC)
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getCurrentPhase(dates: AppDates, today: Date = new Date()): CurrentPhase {
  const phases = [
    {
      name: 'Pre-quit',
      dose: 0,
      start: dates.startDate,
      end: dates.quitDate,
    },
    {
      name: '21mg Patch',
      dose: 21,
      start: dates.quitDate,
      end: dates.phase21End,
    },
    {
      name: '14mg Patch',
      dose: 14,
      start: dates.phase21End,
      end: dates.phase14End,
    },
    {
      name: '7mg Patch',
      dose: 7,
      start: dates.phase14End,
      end: dates.phase7End,
    },
    {
      name: 'Nicotine Free',
      dose: 0,
      start: dates.nicotineFreeDate,
      end: null,
    },
  ];

  const todayDate = startOfDay(today);

  for (const phase of phases) {
    const start = startOfDay(parseLocalDate(phase.start));
    const end = phase.end ? startOfDay(parseLocalDate(phase.end)) : null;

    if (todayDate >= start && (!end || todayDate < end)) {
      const dayInPhase = Math.floor((todayDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const totalDays = end
        ? Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      return {
        name: phase.name,
        dose: phase.dose,
        dayInPhase,
        totalDaysInPhase: totalDays,
        startDate: phase.start,
        endDate: phase.end,
        isPreQuit: phase.name === 'Pre-quit',
      };
    }
  }

  // Fallback: if past all dates, return Nicotine Free
  const lastPhase = phases[phases.length - 1];
  return {
    name: lastPhase.name,
    dose: lastPhase.dose,
    dayInPhase: 1,
    totalDaysInPhase: Infinity,
    startDate: lastPhase.start,
    endDate: null,
    isPreQuit: false,
  };
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getPhaseProgress(currentPhase: CurrentPhase): number {
  if (currentPhase.totalDaysInPhase === Infinity) {
    return 100;
  }
  return Math.min(100, (currentPhase.dayInPhase / currentPhase.totalDaysInPhase) * 100);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'Not set';
  const date = parseLocalDate(dateStr);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function getPhaseColor(dose: number): string {
  switch (dose) {
    case 21:
      return '#f43f5e'; // Rose - highest dose
    case 14:
      return '#f59e0b'; // Amber - medium-high
    case 7:
      return '#10b981'; // Emerald - low
    case 0:
      return '#6366f1'; // Indigo - free
    default:
      return '#6366f1';
  }
}

export function getPhaseEmoji(dose: number): string {
  switch (dose) {
    case 21:
      return '🔴';
    case 14:
      return '🟡';
    case 7:
      return '🟢';
    case 0:
      return '🎉';
    default:
      return '💪';
  }
}

export interface NextMilestone {
  label: string;
  date: string;
  days: number;
  hours: number;
}

export function getNextMilestone(dates: AppDates, today: Date = new Date()): NextMilestone | null {
  const phases = [
    { name: '21mg Phase', start: dates.quitDate, end: dates.phase21End },
    { name: '14mg Phase', start: dates.phase21End, end: dates.phase14End },
    { name: '7mg Phase', start: dates.phase14End, end: dates.phase7End },
    { name: 'Nicotine Free', start: dates.nicotineFreeDate, end: null },
  ];

  const todayDate = startOfDay(today);

  for (const phase of phases) {
    const start = startOfDay(parseLocalDate(phase.start));
    const end = phase.end ? startOfDay(parseLocalDate(phase.end)) : null;

    // If we're in this phase or haven't reached it yet
    if (todayDate < start || (end && todayDate < end)) {
      const milestoneDate = start;
      const diffMs = milestoneDate.getTime() - todayDate.getTime();

      // Already past this phase, check next one
      if (diffMs < 0) continue;

      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

      return {
        label: phase.name,
        date: phase.start,
        days,
        hours,
      };
    }
  }

  // Already in nicotine-free phase, no next milestone
  return null;
}
