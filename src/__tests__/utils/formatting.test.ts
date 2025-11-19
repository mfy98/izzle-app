import { formatDate, formatTime, formatRelativeTime, formatCountdown, formatNumber, formatCurrency, formatMultiplier } from '@/utils/formatting';

describe('Formatting Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date.toISOString(), 'dd MMMM yyyy');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('Ocak');
    });
  });

  describe('formatTime', () => {
    it('should format time to HH:mm', () => {
      const date = new Date('2024-01-15T14:30:00');
      const formatted = formatTime(date.toISOString());
      expect(formatted).toBe('14:30');
    });
  });

  describe('formatCountdown', () => {
    it('should format countdown without hours', () => {
      const milliseconds = 5 * 60 * 1000 + 30 * 1000; // 5:30
      const formatted = formatCountdown(milliseconds);
      expect(formatted).toBe('5:30');
    });

    it('should format countdown with hours', () => {
      const milliseconds = 2 * 3600 * 1000 + 30 * 60 * 1000 + 15 * 1000; // 2:30:15
      const formatted = formatCountdown(milliseconds);
      expect(formatted).toBe('2:30:15');
    });

    it('should handle zero milliseconds', () => {
      const formatted = formatCountdown(0);
      expect(formatted).toBe('0:00');
    });
  });

  describe('formatNumber', () => {
    it('should format number with Turkish locale', () => {
      const formatted = formatNumber(1234567);
      expect(formatted).toBe('1.234.567');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const formatted = formatCurrency(1234.56, 'TRY');
      expect(formatted).toContain('1.234');
      expect(formatted).toContain('₺');
    });
  });

  describe('formatMultiplier', () => {
    it('should format multiplier with comma', () => {
      const formatted = formatMultiplier(1.25);
      expect(formatted).toBe('1,25');
    });

    it('should format multiplier with 2 decimals', () => {
      const formatted = formatMultiplier(1.5);
      expect(formatted).toBe('1,50');
    });
  });
});

