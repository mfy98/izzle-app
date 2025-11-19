export const WEEKDAYS = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
] as const;

export const SPRINT_DEFAULT_DURATION = 60; // minutes
export const RAFFLE_ANNOUNCEMENT_DELAY = 15; // minutes

export const RAFFLE_MULTIPLIERS = {
  DEFAULT: 1.0,
  WINNER: 0.25,
  LOSER_INCREASE: 0.1,
} as const;

