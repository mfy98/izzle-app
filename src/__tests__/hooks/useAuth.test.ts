import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import * as apiClient from '@/services/api/client';

jest.mock('@/store/authStore');
jest.mock('@/services/api/client');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register user successfully', async () => {
    const mockResponse = {
      success: true,
      data: { message: 'Registration successful' },
    };

    mockApiClient.post = jest.fn().mockResolvedValue({ data: mockResponse.data });

    const { result } = renderHook(() => useAuth());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        surname: 'User',
        phone: '5551234567',
        address: {
          street: 'Test Street',
          district: 'Test District',
          city: 'Istanbul',
          postalCode: '34000',
          country: 'Turkey',
        },
      });
    });

    await waitFor(() => {
      expect(registerResult?.success).toBe(true);
    });
  });

  it('should handle login error', async () => {
    mockApiClient.post = jest.fn().mockRejectedValue(new Error('Login failed'));

    const { result } = renderHook(() => useAuth());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.loginUser('test@example.com', 'wrongpassword');
    });

    await waitFor(() => {
      expect(loginResult?.success).toBe(false);
      expect(loginResult?.error).toBeTruthy();
    });
  });

  it('should logout user', async () => {
    const mockLogout = jest.fn();
    (useAuthStore as any).mockReturnValue({
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logoutUser();
    });

    // Logout should be called
    expect(mockLogout).toHaveBeenCalled();
  });
});

