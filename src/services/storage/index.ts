import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/constants/config';
import { User } from '@/types/user';

// Auth token
export const getAuthToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(config.storageKeys.authToken);
};

export const setAuthToken = async (token: string): Promise<void> => {
  return AsyncStorage.setItem(config.storageKeys.authToken, token);
};

export const removeAuthToken = async (): Promise<void> => {
  return AsyncStorage.removeItem(config.storageKeys.authToken);
};

// Refresh token
export const getRefreshToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(config.storageKeys.refreshToken);
};

export const setRefreshToken = async (token: string): Promise<void> => {
  return AsyncStorage.setItem(config.storageKeys.refreshToken, token);
};

export const removeRefreshToken = async (): Promise<void> => {
  return AsyncStorage.removeItem(config.storageKeys.refreshToken);
};

// User data
export const getUser = async (): Promise<User | null> => {
  const userStr = await AsyncStorage.getItem(config.storageKeys.user);
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = async (user: User): Promise<void> => {
  return AsyncStorage.setItem(config.storageKeys.user, JSON.stringify(user));
};

export const removeUser = async (): Promise<void> => {
  return AsyncStorage.removeItem(config.storageKeys.user);
};

// Clear all auth data
export const clearAuth = async (): Promise<void> => {
  await Promise.all([
    removeAuthToken(),
    removeRefreshToken(),
    removeUser(),
  ]);
};

// Onboarding
export const getOnboardingStatus = async (): Promise<boolean> => {
  const status = await AsyncStorage.getItem(config.storageKeys.onboarding);
  return status === 'true';
};

export const setOnboardingComplete = async (): Promise<void> => {
  return AsyncStorage.setItem(config.storageKeys.onboarding, 'true');
};

