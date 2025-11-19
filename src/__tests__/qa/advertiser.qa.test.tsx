/**
 * QA Tests for Advertiser Dashboard and Metrics
 * Tests critical advertiser paths for ad management and metrics viewing
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import AdvertiserDashboard from '@/app/(tabs)/advertiser-dashboard';
import { apiClient } from '@/services/api/client';
import { useAuthStore } from '@/store/authStore';

// Mock dependencies
jest.mock('@/services/api/client');
jest.mock('@/store/authStore');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('QA: Advertiser Dashboard and Metrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Metrics Display', () => {
    it('should display advertiser metrics correctly', async () => {
      const mockMetrics = {
        totalViews: 1000,
        uniqueUsers: 500,
        totalAds: 5,
        activeAds: 3,
        viewsToday: 50,
        viewsThisWeek: 200,
        viewsThisMonth: 800,
        averageViewDuration: 25.5,
        completionRate: 85.0,
        viewsByAd: [
          {
            adId: 1,
            adTitle: 'Test Ad 1',
            viewCount: 500,
            uniqueUserCount: 250,
            averageDuration: 30.0,
          },
        ],
      };

      mockApiClient.get.mockResolvedValue({
        data: mockMetrics,
      });

      mockUseAuthStore.mockReturnValue({
        user: {
          id: '1',
          email: 'advertiser@example.com',
          role: 'advertiser',
        },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<AdvertiserDashboard />);

      await waitFor(() => {
        expect(getByText('1,000')).toBeTruthy(); // totalViews
        expect(getByText('500')).toBeTruthy(); // uniqueUsers
        expect(getByText('3')).toBeTruthy(); // activeAds
        expect(getByText(/85\.0/i)).toBeTruthy(); // completionRate
      });
    });

    it('should display time-based statistics', async () => {
      const mockMetrics = {
        totalViews: 1000,
        uniqueUsers: 500,
        totalAds: 5,
        activeAds: 3,
        viewsToday: 50,
        viewsThisWeek: 200,
        viewsThisMonth: 800,
        averageViewDuration: 25.5,
        completionRate: 85.0,
        viewsByAd: [],
      };

      mockApiClient.get.mockResolvedValue({
        data: mockMetrics,
      });

      mockUseAuthStore.mockReturnValue({
        user: {
          id: '1',
          email: 'advertiser@example.com',
          role: 'advertiser',
        },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<AdvertiserDashboard />);

      await waitFor(() => {
        expect(getByText('50')).toBeTruthy(); // viewsToday
        expect(getByText('200')).toBeTruthy(); // viewsThisWeek
        expect(getByText('800')).toBeTruthy(); // viewsThisMonth
      });
    });

    it('should display ad-specific statistics', async () => {
      const mockMetrics = {
        totalViews: 1000,
        uniqueUsers: 500,
        totalAds: 5,
        activeAds: 3,
        viewsToday: 50,
        viewsThisWeek: 200,
        viewsThisMonth: 800,
        averageViewDuration: 25.5,
        completionRate: 85.0,
        viewsByAd: [
          {
            adId: 1,
            adTitle: 'Test Ad 1',
            viewCount: 500,
            uniqueUserCount: 250,
            averageDuration: 30.0,
          },
          {
            adId: 2,
            adTitle: 'Test Ad 2',
            viewCount: 300,
            uniqueUserCount: 150,
            averageDuration: 20.0,
          },
        ],
      };

      mockApiClient.get.mockResolvedValue({
        data: mockMetrics,
      });

      mockUseAuthStore.mockReturnValue({
        user: {
          id: '1',
          email: 'advertiser@example.com',
          role: 'advertiser',
        },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<AdvertiserDashboard />);

      await waitFor(() => {
        expect(getByText('Test Ad 1')).toBeTruthy();
        expect(getByText('500')).toBeTruthy(); // viewCount
        expect(getByText('250')).toBeTruthy(); // uniqueUserCount
        expect(getByText(/30\.0/i)).toBeTruthy(); // averageDuration
      });
    });
  });

  describe('Metrics Refresh', () => {
    it('should refresh metrics on pull-to-refresh', async () => {
      const mockMetrics = {
        totalViews: 1000,
        uniqueUsers: 500,
        totalAds: 5,
        activeAds: 3,
        viewsToday: 50,
        viewsThisWeek: 200,
        viewsThisMonth: 800,
        averageViewDuration: 25.5,
        completionRate: 85.0,
        viewsByAd: [],
      };

      mockApiClient.get.mockResolvedValue({
        data: mockMetrics,
      });

      mockUseAuthStore.mockReturnValue({
        user: {
          id: '1',
          email: 'advertiser@example.com',
          role: 'advertiser',
        },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByTestId } = render(<AdvertiserDashboard />);

      // Simulate pull-to-refresh
      const scrollView = getByTestId('scroll-view');
      fireEvent.scroll(scrollView, {
        nativeEvent: {
          contentOffset: { y: -100 },
        },
      });

      await waitFor(() => {
        expect(mockApiClient.get).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator while fetching metrics', () => {
      mockApiClient.get.mockImplementation(() => new Promise(() => {})); // Never resolves

      mockUseAuthStore.mockReturnValue({
        user: {
          id: '1',
          email: 'advertiser@example.com',
          role: 'advertiser',
        },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByTestId } = render(<AdvertiserDashboard />);

      // Should show loading indicator
      expect(getByTestId('activity-indicator')).toBeTruthy();
    });
  });
});




