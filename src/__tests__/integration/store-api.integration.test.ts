/**
 * Integration test for Store-API interaction
 * Tests how stores interact with API services
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuthStore } from '@/store/authStore';
import { useRaffleStore } from '@/store/raffleStore';
import { useAuth } from '@/hooks/useAuth';
import * as storage from '@/services/storage';

jest.mock('@/services/storage');
jest.mock('@/services/api/client');

describe('Store-API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update store after successful login', async () => {
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

    const { result: authResult } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await authResult.current.loginUser('test@example.com', 'password');
      
      if (loginResult.success && loginResult.data) {
        await useAuthStore.getState().login(loginResult.data);
      }
    });

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(storage.setAuthToken).toHaveBeenCalled();
    });
  });

  it('should update raffle store after ad view', async () => {
    const { result: raffleResult } = renderHook(() => useRaffleStore());

    act(() => {
      raffleResult.current.setMyTickets(5);
      raffleResult.current.incrementTickets(2);
    });

    expect(raffleResult.current.myTickets).toBe(7);
  });
});

