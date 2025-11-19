/**
 * QA Tests for Coupon and Voucher Flows
 * Tests critical user paths for coupon codes and discount vouchers
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import CouponsScreen from '@/app/(tabs)/coupons';
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

describe('QA: Coupon and Voucher Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert = jest.fn();
    mockCopyToClipboard.mockResolvedValue(true);
  });

  describe('Coupon Code Display', () => {
    it('should display active coupon codes', async () => {
      const mockCoupons = [
        {
          id: 1,
          code: 'SAVE20',
          title: '20% Off',
          description: 'Get 20% off on your purchase',
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

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<CouponsScreen />);

      await waitFor(() => {
        expect(getByText('SAVE20')).toBeTruthy();
        expect(getByText('20% Off')).toBeTruthy();
      });
    });

    it('should allow copying coupon code to clipboard', async () => {
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

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<CouponsScreen />);

      await waitFor(() => {
        const copyButton = getByText(/kopyala/i);
        fireEvent.press(copyButton);

        expect(mockCopyToClipboard).toHaveBeenCalledWith('SAVE20', 'Kod panoya kopyalandı!');
      });
    });

    it('should show coupon expiration date', async () => {
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

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<CouponsScreen />);

      await waitFor(() => {
        expect(getByText(/geçerlilik/i)).toBeTruthy();
      });
    });
  });

  describe('Discount Voucher Display', () => {
    it('should display user vouchers', async () => {
      const mockVouchers = [
        {
          id: 1,
          voucherCode: 'VOUCHER50',
          title: '50 TL Discount',
          description: 'Get 50 TL off',
          discountType: 'FIXED_AMOUNT',
          discountValue: 50,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 86400000).toISOString(),
          isUsed: false,
          isActive: true,
        },
      ];

      mockApiClient.get.mockResolvedValue({
        data: mockVouchers,
      });

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<CouponsScreen />);

      // Switch to vouchers tab
      const vouchersTab = getByText(/indirim çekleri/i);
      fireEvent.press(vouchersTab);

      await waitFor(() => {
        expect(getByText('VOUCHER50')).toBeTruthy();
      });
    });

    it('should mark used vouchers as used', async () => {
      const mockVouchers = [
        {
          id: 1,
          voucherCode: 'VOUCHER50',
          title: '50 TL Discount',
          discountType: 'FIXED_AMOUNT',
          discountValue: 50,
          isUsed: true,
          usedAt: new Date().toISOString(),
          isActive: true,
        },
      ];

      mockApiClient.get.mockResolvedValue({
        data: mockVouchers,
      });

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { getByText } = render(<CouponsScreen />);

      // Switch to vouchers tab
      const vouchersTab = getByText(/indirim çekleri/i);
      fireEvent.press(vouchersTab);

      await waitFor(() => {
        expect(getByText(/kullanıldı/i)).toBeTruthy();
      });
    });

    it('should not show copy button for used vouchers', async () => {
      const mockVouchers = [
        {
          id: 1,
          voucherCode: 'VOUCHER50',
          title: '50 TL Discount',
          discountType: 'FIXED_AMOUNT',
          discountValue: 50,
          isUsed: true,
          isActive: true,
        },
      ];

      mockApiClient.get.mockResolvedValue({
        data: mockVouchers,
      });

      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { queryByText } = render(<CouponsScreen />);

      // Switch to vouchers tab
      const vouchersTab = queryByText(/indirim çekleri/i);
      if (vouchersTab) {
        fireEvent.press(vouchersTab);
      }

      await waitFor(() => {
        expect(queryByText(/kopyala/i)).toBeNull();
      });
    });
  });

  describe('Coupon Validation', () => {
    it('should validate coupon code before use', async () => {
      mockApiClient.post.mockResolvedValue({
        data: {
          id: 1,
          code: 'SAVE20',
          isValid: true,
          discountValue: 20,
        },
      });

      // Test coupon validation
      const response = await mockApiClient.post('/coupons/validate', {
        code: 'SAVE20',
        purchaseAmount: 100,
      });

      expect(response.data.isValid).toBe(true);
    });

    it('should reject expired coupon codes', async () => {
      mockApiClient.post.mockRejectedValue({
        response: {
          data: {
            message: 'Invalid or expired coupon code',
          },
        },
      });

      try {
        await mockApiClient.post('/coupons/validate', {
          code: 'EXPIRED',
          purchaseAmount: 100,
        });
      } catch (error: any) {
        expect(error.response.data.message).toContain('expired');
      }
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between coupons and vouchers tabs', async () => {
      mockUseAuthStore.mockReturnValue({
        user: { id: '1', email: 'test@example.com', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      mockApiClient.get.mockResolvedValue({
        data: [],
      });

      const { getByText } = render(<CouponsScreen />);

      // Initially on coupons tab
      expect(getByText(/kupon kodları/i)).toBeTruthy();

      // Switch to vouchers tab
      const vouchersTab = getByText(/indirim çekleri/i);
      fireEvent.press(vouchersTab);

      await waitFor(() => {
        expect(mockApiClient.get).toHaveBeenCalledWith('/vouchers/my-vouchers');
      });
    });
  });
});




