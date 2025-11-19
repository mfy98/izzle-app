import {
  getDayName,
  isSprintActive,
  calculateSprintTimeRemaining,
  isValidEmail,
  isValidPhone,
  formatPhone,
  debounce,
  throttle,
} from '@/utils/helpers';
import { SprintStatus } from '@/types/sprint';

describe('Helper Functions', () => {
  describe('getDayName', () => {
    it('should return correct day name in Turkish', () => {
      expect(getDayName(0)).toBe('Pazar');
      expect(getDayName(1)).toBe('Pazartesi');
      expect(getDayName(4)).toBe('Perşembe');
      expect(getDayName(6)).toBe('Cumartesi');
    });

    it('should handle invalid day numbers', () => {
      expect(getDayName(10)).toBe('');
      expect(getDayName(-1)).toBe('');
    });
  });

  describe('isSprintActive', () => {
    it('should return true for active sprint', () => {
      const sprint = {
        id: '1',
        dayOfWeek: 4,
        startTime: '17:00',
        endTime: '18:00',
        duration: 60,
        status: SprintStatus.ACTIVE,
        startDate: new Date(Date.now() - 1000).toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(),
        activeAds: [],
        totalViews: 0,
        totalParticipants: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(isSprintActive(sprint as any)).toBe(true);
    });

    it('should return false for inactive sprint', () => {
      const sprint = {
        id: '1',
        dayOfWeek: 4,
        startTime: '17:00',
        endTime: '18:00',
        duration: 60,
        status: SprintStatus.UPCOMING,
        startDate: new Date(Date.now() + 3600000).toISOString(),
        endDate: new Date(Date.now() + 7200000).toISOString(),
        activeAds: [],
        totalViews: 0,
        totalParticipants: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(isSprintActive(sprint as any)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate Turkish phone numbers', () => {
      expect(isValidPhone('5551234567')).toBe(true);
      expect(isValidPhone('05551234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
    });
  });

  describe('formatPhone', () => {
    it('should format phone number correctly', () => {
      expect(formatPhone('5551234567')).toBe('555 123 4567');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();
    
    it('should delay function execution', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 300);

      debouncedFunc();
      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should limit function execution frequency', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 300);

      throttledFunc();
      throttledFunc();
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(300);
      throttledFunc();
      expect(func).toHaveBeenCalledTimes(2);
    });
  });
});

