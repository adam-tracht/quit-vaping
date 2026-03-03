// App constants

export const CRAVING_TIMER_DURATION = 300; // 5 minutes in seconds
export const BREATH_CYCLE_DURATION = 12000; // 12 seconds total (4s in, 4s hold, 4s out)

export const MILESTONES = [
  { days: 1, label: 'First day', emoji: '🎯' },
  { days: 3, label: '3 days', emoji: '💪' },
  { days: 7, label: '1 week', emoji: '🏆' },
  { days: 14, label: '2 weeks', emoji: '⭐' },
  { days: 30, label: '1 month', emoji: '🌟' },
  { days: 60, label: '2 months', emoji: '✨' },
  { days: 90, label: '3 months', emoji: '🎉' },
  { days: 180, label: '6 months', emoji: '🏅' },
  { days: 365, label: '1 year', emoji: '👑' },
] as const;

export const BREATHING_MESSAGES = [
  'Breathe in slowly...',
  'Hold...',
  'Breathe out slowly...',
] as const;

export const CRAVING_TIPS = [
  'The urge will pass in a few minutes.',
  'Drink a glass of water.',
  'Take a short walk.',
  'Call a friend.',
  'Practice deep breathing.',
  'Remember why you\'re quitting.',
  'You\'ve got this!',
  'Every craving you resist makes you stronger.',
] as const;
