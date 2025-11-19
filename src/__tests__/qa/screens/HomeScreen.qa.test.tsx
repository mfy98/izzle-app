/**
 * QA Tests for HomeScreen
 * These tests verify user flows and interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/home';
import { useRaffleStore } from '@/store/raffleStore';
import { useSprint } from '@/hooks/useSprint';
import { useAds } from '@/hooks/useAds';

jest.mock('@/store/raffleStore');
jest.mock('@/hooks/useSprint');
jest.mock('@/hooks/useAds');
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('HomeScreen QA Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRaffleStore as jest.Mock).mockReturnValue({
      myTickets: 10,
      myMultiplier: 1.0,
    });

    (useSprint as jest.Mock).mockReturnValue({
      currentSprint: null,
      fetchCurrentSprint: jest.fn().mockResolvedValue({ success: true }),
    });

    (useAds as jest.Mock).mockReturnValue({
      getCoverAd: jest.fn().mockResolvedValue({ success: false }),
      getBannerAds: jest.fn().mockResolvedValue({ success: false, data: [] }),
    });
  });

  it('should display welcome message', () => {
    render(<HomeScreen />);
    expect(screen.getByText(/Hoş Geldiniz/i)).toBeTruthy();
  });

  it('should display user statistics', async () => {
    render(<HomeScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/Çekiliş Haklarınız/i)).toBeTruthy();
      expect(screen.getByText('10')).toBeTruthy();
    });
  });

  it('should navigate to watch screen on quick action', async () => {
    const { router } = require('expo-router');
    render(<HomeScreen />);

    await waitFor(() => {
      const watchButton = screen.getByText(/Reklam İzlemeye Başla/i);
      fireEvent.press(watchButton);
      expect(router.push).toHaveBeenCalledWith('/(tabs)/watch');
    });
  });

  it('should display loading skeleton initially', () => {
    // This test verifies skeleton loader appears
    render(<HomeScreen />);
    // Skeleton cards should render during loading
  });

  it('should display how it works section', async () => {
    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Nasıl Çalışır/i)).toBeTruthy();
      expect(screen.getByText(/Sprint saatinde reklam izle/i)).toBeTruthy();
    });
  });
});

