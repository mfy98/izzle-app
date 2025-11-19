import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { UserRegistrationFormData } from '@/types/user';
import { apiClient } from '@/services/api/client';
import * as storage from '@/services/storage';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, setUser } = useAuthStore();

  const register = useCallback(async (data: UserRegistrationFormData) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.post('/auth/register', data);
      // return { success: true, data: response.data };

      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          message: 'Kayıt başarılı! Lütfen giriş yapın.',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Kayıt işlemi başarısız oldu',
      };
    }
  }, []);

  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.post('/auth/login', { email, password });
      // await login(response.data);

      // Mock login
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockAuth = {
        user: {
          id: '1',
          email,
          name: 'Test',
          surname: 'User',
          phone: '5551234567',
          address: {
            street: 'Test Street 123',
            district: 'Test District',
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
        token: 'mock-token-' + Date.now(),
      };

      await login(mockAuth);

      return {
        success: true,
        data: mockAuth,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Giriş işlemi başarısız oldu',
      };
    }
  }, [login]);

  const logoutUser = useCallback(async () => {
    try {
      // TODO: Call logout endpoint when backend is ready
      // await apiClient.post('/auth/logout');
      
      await logout();
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local storage
      await logout();
      return { success: true };
    }
  }, [logout]);

  const updateUser = useCallback(async (userData: Partial<typeof user>) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.patch('/user/profile', userData);
      // setUser(response.data.user);

      // Mock update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
      }

      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Güncelleme başarısız oldu',
      };
    }
  }, [user, setUser]);

  const refreshAuth = useCallback(async () => {
    try {
      const token = await storage.getAuthToken();
      const storedUser = await storage.getUser();
      
      if (token && storedUser) {
        // TODO: Validate token with backend when ready
        // const response = await apiClient.get('/auth/verify');
        // setUser(response.data.user);
        
        setUser(storedUser);
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    register,
    loginUser,
    logoutUser,
    updateUser,
    refreshAuth,
  };
};

