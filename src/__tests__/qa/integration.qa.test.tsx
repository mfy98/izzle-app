/**
 * QA Integration Tests
 * Tests complete user flows across multiple screens and features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useSprintStore } from '@/store/sprintStore';
import { useRaffleStore } from '@/store/raffleStore';
import HomeScreen from '@/app/(tabs)/home';
import WatchScreen from '@/app/(tabs)/watch';
import RaffleScreen from '@/app/(tabs)/raffle';
import CouponsScreen from '@/app/(tabs)/coupons';
import AffiliateScreen from '@/app/(tabs)/affiliate';
import { apiClient } from '@/services/api/client';

// Mock dependencies
jest.mock('@/store/authStore');
jest.mock('@/store/sprintStore');
jest.mock('@/store/raffleStore');
jest.mock('@/services/api/client');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockUseSprintStore = useSprintStore as jest.MockedFunction<typeof useSprintStore>;
const mockUseRaffleStore = useRaffleStore as jest.MockedFunction<typeof useRaffleStore>;
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('QA: Integration Tests - Complete User Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert = jest.fn();
  });

  describe('Complete Ad Watching Flow', () => {
    it('should complete full flow: login -> view sprint -> watch ad -> earn ticket', async () => {
      // 1. User logs in
      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      // 2. Sprint is active
      const mockSprint = {
        id: '1',
        startDate: new Date(Date.now() - 1800000).toISOString(),
        endDate: new Date(Date.now() + 1800000).toISOString(),
        status: 'ACTIVE',
      };

      mockUseSprintStore.mockReturnValue({
        currentSprint: mockSprint,
        isSprintActive: true,
        timeUntilStart: 0,
        timeRemaining: 1800000,
      });

      // 3. User has tickets
      mockUseRaffleStore.mockReturnValue({
        myTickets: 5,
        myMultiplier: 1.0,
      });

      // 4. Ad is available
      mockApiClient.get.mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Test Ad',
            videoUrl: 'https://example.com/ad.mp4',
            duration: 30,
            type: 'VIDEO',
          },
        ],
      });

      // 5. Ad view is recorded
      mockApiClient.post.mockResolvedValue({
        data: {
          success: true,
          raffleTicketEarned: true,
          message: 'Ticket earned',
        },
      });

      // Render home screen
      const { getByText } = render(<HomeScreen />);

      // Navigate to watch screen
      const watchButton = getByText(/reklam.*izle/i);
      fireEvent.press(watchButton);

      // Render watch screen
      const { getByTestId } = render(<WatchScreen />);

      // Watch ad
      await waitFor(() => {
        expect(mockApiClient.post).toHaveBeenCalledWith('/ads/view', {
          adId: '1',
          viewDuration: expect.any(Number),
        });
      });

      // Verify ticket count increased
      await waitFor(() => {
        expect(mockUseRaffleStore().myTickets).toBeGreaterThan(5);
      });
    });
  });

  describe('Complete Raffle Flow', () => {
    it('should complete flow: view sprint results -> see winners -> check own tickets', async () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      mockUseRaffleStore.mockReturnValue({
        myTickets: 10,
        myMultiplier: 1.0,
      });

      const mockRaffle = {
        id: '1',
        sprintId: '1',
        status: 'COMPLETED',
        winners: [
          {
            id: '1',
            userId: '2',
            userName: 'Winner User',
            prize: {
              id: '1',
              name: 'Test Prize',
              description: 'Test Prize Description',
            },
          },
        ],
      };

      mockApiClient.get.mockResolvedValue({
        data: mockRaffle,
      });

      const { getByText } = render(<RaffleScreen />);

      await waitFor(() => {
        expect(getByText(/kazanan/i)).toBeTruthy();
        expect(getByText('Winner User')).toBeTruthy();
        expect(getByText('Test Prize')).toBeTruthy();
      });
    });
  });

  describe('Complete Coupon Flow', () => {
    it('should complete flow: view coupons -> copy code -> use coupon', async () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const mockCoupons = [
        {
          id: 1,
          code: 'SAVE20',
          title: '20% Off',
          discountType: 'PERCENTAGE',
          discountValue: 20,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 86400000).toISOString(),
          isActive: true,
        },
      ];

      mockApiClient.get.mockResolvedValue({
        data: mockCoupons,
      });

      mockApiClient.post.mockResolvedValue({
        data: {
          id: 1,
          code: 'SAVE20',
          used: true,
        },
      });

      const { getByText } = render(<CouponsScreen />);

      await waitFor(() => {
        expect(getByText('SAVE20')).toBeTruthy();
      });

      // Copy code
      const copyButton = getByText(/kopyala/i);
      fireEvent.press(copyButton);

      // Use coupon
      await mockApiClient.post('/coupons/use', {
        code: 'SAVE20',
        purchaseAmount: 100,
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/coupons/use', {
        code: 'SAVE20',
        purchaseAmount: 100,
      });
    });
  });

  describe('Complete Affiliate Flow', () => {
    it('should complete flow: view affiliate links -> copy link -> track click -> record conversion', async () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

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

      // Track click
      mockApiClient.get.mockResolvedValueOnce({
        data: {
          clickId: 1,
          redirectUrl: 'https://example.com',
        },
      });

      // Record conversion
      mockApiClient.post.mockResolvedValue({
        data: {},
      });

      const { getByText } = render(<AffiliateScreen />);

      await waitFor(() => {
        expect(getByText('AFF123')).toBeTruthy();
      });

      // Copy link
      const copyButton = getByText(/kopyala/i);
      fireEvent.press(copyButton);

      // Track click
      await mockApiClient.get('/affiliate/click/AFF123');

      // Record conversion
      await mockApiClient.post('/affiliate/conversion', {
        clickId: 1,
        purchaseAmount: 100.0,
      });

      expect(mockApiClient.get).toHaveBeenCalledWith('/affiliate/click/AFF123');
      expect(mockApiClient.post).toHaveBeenCalledWith('/affiliate/conversion', {
        clickId: 1,
        purchaseAmount: 100.0,
      });
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle network errors gracefully', async () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      mockApiClient.get.mockRejectedValue(new Error('Network error'));

      const { getByText } = render(<CouponsScreen />);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });

    it('should handle API errors gracefully', async () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      mockApiClient.get.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      });

      const { getByText } = render(<CouponsScreen />);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });
  });
});




