export const colors = {
  primary: '#6366F1', // Indigo
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  secondary: '#10B981', // Emerald
  secondaryDark: '#059669',
  secondaryLight: '#34D399',
  
  accent: '#F59E0B', // Amber
  accentDark: '#D97706',
  accentLight: '#FBBF24',
  
  background: '#FFFFFF',
  backgroundDark: '#F9FAFB',
  
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  error: '#EF4444',
  errorDark: '#DC2626',
  
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  divider: '#E5E7EB',
  
  // Raffle specific
  raffleActive: '#10B981',
  rafflePending: '#F59E0B',
  raffleCompleted: '#6366F1',
  
  // Sprint specific
  sprintActive: '#3B82F6',
  sprintUpcoming: '#8B5CF6',
  sprintEnded: '#6B7280',
};

export type ColorKey = keyof typeof colors;

