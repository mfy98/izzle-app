import * as storage from '@/services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Token', () => {
    it('should save auth token', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      await storage.setAuthToken('test-token');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@cursor_raffle:auth_token',
        'test-token'
      );
    });

    it('should get auth token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('test-token');
      
      const token = await storage.getAuthToken();
      
      expect(token).toBe('test-token');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@cursor_raffle:auth_token');
    });

    it('should remove auth token', async () => {
      await storage.removeAuthToken();
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@cursor_raffle:auth_token');
    });
  });

  describe('User Data', () => {
    const mockUser = {
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
    };

    it('should save user', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      await storage.setUser(mockUser);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@cursor_raffle:user',
        JSON.stringify(mockUser)
      );
    });

    it('should get user', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
      
      const user = await storage.getUser();
      
      expect(user).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const user = await storage.getUser();
      
      expect(user).toBeNull();
    });
  });

  describe('Clear Auth', () => {
    it('should clear all auth data', async () => {
      await storage.clearAuth();
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@cursor_raffle:auth_token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@cursor_raffle:refresh_token');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@cursor_raffle:user');
    });
  });
});

