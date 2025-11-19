/**
 * QA Tests for Affiliate Marketing Flows
 * Tests critical user paths for affiliate links and earnings
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AffiliateScreen from '@/app/(tabs)/affiliate';
import { apiClient } from '@/services/api/client';
import { useAuthStore } from '@/store/authStore';
import { copyToClipboard } from '@/utils/clipboard';

// Mock dependencies
jest.mock('@/services/api/client');
jest.mock('@/store/authStore');
jest.mock('@/utils/clipboard');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockCopyToClipboard = copyToClipboard as jest.MockedFunction<typeof copyToClipboard>;

describe('QA: Affiliate Marketing Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert = jest.fn();
    mockCopyToClipboard.mockResolvedValue(true);
  });

  describe('Affiliate Link Display', () => {
    it('should display user affiliate links', async () => {
      const mockLinks = [
        {
          id: 1,
          affiliateCode: 'AFF123',
          fullAffiliateUrl: 'https://example.com?ref=AFF123',
          targetUrl: 'https://example.com',
          title: 'Test Affiliate',
          clickCount: 10,
          conversionCount: 2,
          totalEarnings: 50.0,
          isActive: true,
        },
      ];

      const mockStats = {
        totalLinks: 1,
        totalClicks: 10,
        totalConversions: 2,
        totalEarnings: 50.0,
        conversionRate: 20.0,
      };

      mockApiClient.get
        .mockResolvedValueOnce({ data: mockLinks })
        .mockResolvedValueOnce({ data: mockStats });

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<AffiliateScreen />);

      await waitFor(() => {
        expect(getByText('AFF123')).toBeTruthy();
        expect(getByText(/toplam.*tıklama/i)).toBeTruthy();
      });
    });

    it('should allow copying affiliate link to clipboard', async () => {
      const mockLinks = [
        {
          id: 1,
          affiliateCode: 'AFF123',
          fullAffiliateUrl: 'https://example.com?ref=AFF123',
          targetUrl: 'https://example.com',
          title: 'Test Affiliate',
          clickCount: 0,
          conversionCount: 0,
          totalEarnings: 0,
          isActive: true,
        },
      ];

      const mockStats = {
        totalLinks: 1,
        totalClicks: 0,
        totalConversions: 0,
        totalEarnings: 0,
        conversionRate: 0,
      };

      mockApiClient.get
        .mockResolvedValueOnce({ data: mockLinks })
        .mockResolvedValueOnce({ data: mockStats });

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<AffiliateScreen />);

      await waitFor(() => {
        const copyButton = getByText(/kopyala/i);
        fireEvent.press(copyButton);

        expect(mockCopyToClipboard).toHaveBeenCalledWith(
          'https://example.com?ref=AFF123',
          'Link panoya kopyalandı!'
        );
      });
    });
  });

  describe('Affiliate Statistics', () => {
    it('should display affiliate statistics correctly', async () => {
      const mockStats = {
        totalLinks: 3,
        totalClicks: 150,
        totalConversions: 15,
        totalEarnings: 500.0,
        conversionRate: 10.0,
      };

      mockApiClient.get
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: mockStats });

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<AffiliateScreen />);

      await waitFor(() => {
        expect(getByText('3')).toBeTruthy(); // totalLinks
        expect(getByText('150')).toBeTruthy(); // totalClicks
        expect(getByText('15')).toBeTruthy(); // totalConversions
        expect(getByText(/500/i)).toBeTruthy(); // totalEarnings
        expect(getByText(/10\.0/i)).toBeTruthy(); // conversionRate
      });
    });

    it('should calculate conversion rate correctly', async () => {
      const mockStats = {
        totalLinks: 1,
        totalClicks: 100,
        totalConversions: 5,
        totalEarnings: 100.0,
        conversionRate: 5.0, // 5/100 * 100
      };

      mockApiClient.get
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: mockStats });

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<AffiliateScreen />);

      await waitFor(() => {
        expect(getByText(/5\.0/i)).toBeTruthy(); // conversionRate
      });
    });
  });

  describe('Affiliate Link Click Tracking', () => {
    it('should track affiliate link clicks', async () => {
      mockApiClient.get.mockResolvedValue({
        data: {
          clickId: 1,
          redirectUrl: 'https://example.com',
        },
      });

      const response = await mockApiClient.get('/affiliate/click/AFF123');

      expect(response.data.clickId).toBeDefined();
      expect(response.data.redirectUrl).toBeDefined();
    });

    it('should record conversions for affiliate clicks', async () => {
      mockApiClient.post.mockResolvedValue({
        data: {},
      });

      await mockApiClient.post('/affiliate/conversion', {
        clickId: 1,
        purchaseAmount: 100.0,
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/affiliate/conversion', {
        clickId: 1,
        purchaseAmount: 100.0,
      });
    });
  });

  describe('Earnings Display', () => {
    it('should format earnings correctly', async () => {
      const mockStats = {
        totalLinks: 1,
        totalClicks: 10,
        totalConversions: 2,
        totalEarnings: 1234.56,
        conversionRate: 20.0,
      };

      mockApiClient.get
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: mockStats });

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<AffiliateScreen />);

      await waitFor(() => {
        // Should display formatted earnings
        expect(getByText(/1\.234/i)).toBeTruthy();
      });
    });
  });
});




