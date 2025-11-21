import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Format date to Turkish locale
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd MMMM yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: tr });
};

/**
 * Format time to HH:mm
 */
export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'HH:mm');
};

/**
 * Format relative time (e.g., "2 saat önce")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Bugün ${formatTime(dateObj)}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Yarın ${formatTime(dateObj)}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Dün ${formatTime(dateObj)}`;
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: tr });
};

/**
 * Format countdown timer
 */
// src/utils/formatting.ts
/**
 * Get day name in Turkish
 */
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  return days[dayOfWeek] || '';
};

/**
 * Format countdown timer
 */
export const formatCountdown = (milliseconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};


/**
 * Format number with Turkish locale
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('tr-TR').format(num);
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format multiplier display
 */
export const formatMultiplier = (multiplier: number): string => {
  return multiplier.toFixed(2).replace('.', ',');
};

/**
 * Format date to Turkish format (dd.MM.yyyy)
 */
export const formatDateTurkish = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd.MM.yyyy', { locale: tr });
};

/**
 * Format number with thousand separators (for input display)
 */
export const formatNumberInput = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');
  // Add thousand separators
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parse formatted number (remove separators)
 */
export const parseFormattedNumber = (value: string): string => {
  return value.replace(/\./g, '');
};

