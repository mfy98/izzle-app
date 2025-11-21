import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';

// Bypass login for development/testing
const BYPASS_LOGIN = true;

export default function Index() {
  const { isAuthenticated, isLoading, checkAuth, setUser } = useAuthStore();

  useEffect(() => {
    if (BYPASS_LOGIN) {
      // Set a mock user to bypass login
      setUser({
        id: 'dev-user-1',
        email: 'dev@test.com',
        name: 'Dev',
        surname: 'User',
        phone: '+905551234567',
        address: {
          street: 'Test Street',
          district: 'Test District',
          city: 'Istanbul',
          postalCode: '34000',
          country: 'Turkey',
          isVerified: false,
        },
        role: UserRole.USER,
        raffleMultiplier: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      checkAuth();
    }
  }, [setUser, checkAuth]);

  if (BYPASS_LOGIN) {
    // Directly redirect to home when bypass is enabled
    return <Redirect href="/(tabs)/home" />;
  }

  if (isLoading) {
    return null; // Loading screen can be added here
  }

  // If authenticated, go to tabs, else go to login
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/login" />;
}

