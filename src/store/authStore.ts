import { create } from 'zustand';
import { User, AuthResponse } from '@/types/user';
import * as storage from '@/services/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (authData: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      storage.setUser(user);
    } else {
      storage.removeUser();
    }
  },

  login: async (authData) => {
    await storage.setAuthToken(authData.token);
    if (authData.refreshToken) {
      await storage.setRefreshToken(authData.refreshToken);
    }
    await storage.setUser(authData.user);
    set({ user: authData.user, isAuthenticated: true });
  },

  logout: async () => {
    await storage.clearAuth();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const user = await storage.getUser();
      const token = await storage.getAuthToken();
      
      if (user && token) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

