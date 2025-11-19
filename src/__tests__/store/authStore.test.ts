import { useAuthStore } from '@/store/authStore';
import * as storage from '@/services/storage';

// Mock storage
jest.mock('@/services/storage', () => ({
  setAuthToken: jest.fn(),
  setRefreshToken: jest.fn(),
  setUser: jest.fn(),
  removeAuthToken: jest.fn(),
  removeRefreshToken: jest.fn(),
  removeUser: jest.fn(),
  clearAuth: jest.fn(),
  getUser: jest.fn(),
  getAuthToken: jest.fn(),
  getRefreshToken: jest.fn(),
}));

describe('AuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('should set user correctly', () => {
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

    useAuthStore.getState().setUser(mockUser);

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(storage.setUser).toHaveBeenCalledWith(mockUser);
  });

  it('should login and set tokens', async () => {
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
      refreshToken: 'mock-refresh-token',
    };

    await useAuthStore.getState().login(mockAuth);

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).toEqual(mockAuth.user);
    expect(storage.setAuthToken).toHaveBeenCalledWith('mock-token');
    expect(storage.setRefreshToken).toHaveBeenCalledWith('mock-refresh-token');
  });

  it('should logout and clear data', async () => {
    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(storage.clearAuth).toHaveBeenCalled();
  });
});

