/**
 * Integration tests for Zustand stores
 * Tests store interactions and state management
 */

import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '@/store/authStore';
import { useRaffleStore } from '@/store/raffleStore';
import { useSprintStore } from '@/store/sprintStore';
import * as storage from '@/services/storage';

jest.mock('@/services/storage');

describe('Store Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthStore Integration', () => {
    it('should persist user on login', async () => {
      const mockAuth = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test',
          surname: 'User',
          phone: '5551234567',
          address: {
            street: 'Test',
            district: 'Test',
            city: 'Istanbul',
            postalCode: '34000',
            country: 'Turkey',
            isVerified: false,
          },
          role: 'user' as const,
          raffleMultiplier: 1.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-token',
        refreshToken: 'mock-refresh',
      };

      await act(async () => {
        await useAuthStore.getState().login(mockAuth);
      });

      expect(storage.setAuthToken).toHaveBeenCalledWith('mock-token');
      expect(storage.setRefreshToken).toHaveBeenCalledWith('mock-refresh');
      expect(storage.setUser).toHaveBeenCalledWith(mockAuth.user);
    });
  });

  describe('RaffleStore Integration', () => {
    it('should increment tickets correctly', () => {
      const { result } = renderHook(() => useRaffleStore());

      act(() => {
        result.current.setMyTickets(5);
      });

      expect(result.current.myTickets).toBe(5);

      act(() => {
        result.current.incrementTickets(3);
      });

      expect(result.current.myTickets).toBe(8);
    });
  });

  describe('SprintStore Integration', () => {
    it('should update sprint status', () => {
      const mockSprint = {
        id: '1',
        dayOfWeek: 4,
        startTime: '17:00',
        endTime: '18:00',
        duration: 60,
        status: 'ACTIVE' as const,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(),
        activeAds: [],
        totalViews: 0,
        totalParticipants: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { result } = renderHook(() => useSprintStore());

      act(() => {
        result.current.setCurrentSprint(mockSprint);
      });

      expect(result.current.currentSprint?.id).toBe('1');

      act(() => {
        result.current.updateSprintStatus('ENDED');
      });

      expect(result.current.currentSprint?.status).toBe('ENDED');
    });
  });
});

