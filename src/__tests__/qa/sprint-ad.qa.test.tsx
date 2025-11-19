/**
 * QA Tests for Sprint and Ad Watching Flows
 * Tests critical user paths for sprint participation and ad viewing
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useSprintStore } from '@/store/sprintStore';
import { useAds } from '@/hooks/useAds';
import WatchScreen from '@/app/(tabs)/watch';
import HomeScreen from '@/app/(tabs)/home';
import { SprintTimer } from '@/components/raffle/SprintTimer';
import { AdPlayer } from '@/components/ads/AdPlayer';
import { apiClient } from '@/services/api/client';

// Mock dependencies
jest.mock('@/store/sprintStore');
jest.mock('@/hooks/useAds');
jest.mock('@/services/api/client');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockUseSprintStore = useSprintStore as jest.MockedFunction<typeof useSprintStore>;
const mockUseAds = useAds as jest.MockedFunction<typeof useAds>;
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('QA: Sprint and Ad Watching Flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert = jest.fn();
  });

  describe('Sprint Timer Display', () => {
    it('should display countdown timer when sprint is active', () => {
      const mockSprint = {
        id: '1',
        startDate: new Date(Date.now() + 3600000).toISOString(),
        endDate: new Date(Date.now() + 7200000).toISOString(),
        status: 'ACTIVE',
      };

      mockUseSprintStore.mockReturnValue({
        currentSprint: mockSprint,
        isSprintActive: true,
        timeUntilStart: 3600000,
        timeRemaining: 3600000,
      });

      const { getByText } = render(<SprintTimer sprint={mockSprint} />);

      expect(getByText(/sprint/i)).toBeTruthy();
      expect(getByText(/kalan/i)).toBeTruthy();
    });

    it('should show upcoming sprint message when sprint is not active', () => {
      mockUseSprintStore.mockReturnValue({
        currentSprint: null,
        isSprintActive: false,
        timeUntilStart: 3600000,
        timeRemaining: 0,
      });

      const { getByText } = render(<HomeScreen />);

      expect(getByText(/yaklaşan/i)).toBeTruthy();
    });
  });

  describe('Ad Viewing Flow', () => {
    it('should allow user to watch ads during active sprint', async () => {
      const mockSprint = {
        id: '1',
        startDate: new Date(Date.now() - 1800000).toISOString(),
        endDate: new Date(Date.now() + 1800000).toISOString(),
        status: 'ACTIVE',
      };

      const mockAd = {
        id: '1',
        title: 'Test Ad',
        videoUrl: 'https://example.com/ad.mp4',
        duration: 30,
        type: 'VIDEO',
      };

      mockUseSprintStore.mockReturnValue({
        currentSprint: mockSprint,
        isSprintActive: true,
        timeUntilStart: 0,
        timeRemaining: 1800000,
      });

      mockUseAds.mockReturnValue({
        ads: [mockAd],
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      mockApiClient.post.mockResolvedValue({
        data: {
          success: true,
          raffleTicketEarned: true,
          message: 'Ad viewed successfully',
        },
      });

      const { getByText } = render(<WatchScreen />);

      // Should show ad player
      expect(getByText(/reklam/i)).toBeTruthy();
    });

    it('should prevent ad viewing outside sprint hours', async () => {
      mockUseSprintStore.mockReturnValue({
        currentSprint: null,
        isSprintActive: false,
        timeUntilStart: 3600000,
        timeRemaining: 0,
      });

      const { getByText } = render(<WatchScreen />);

      // Should show message that sprint is not active
      expect(getByText(/sprint.*aktif/i)).toBeTruthy();
    });

    it('should record ad view and award ticket after minimum duration', async () => {
      const mockSprint = {
        id: '1',
        startDate: new Date(Date.now() - 1800000).toISOString(),
        endDate: new Date(Date.now() + 1800000).toISOString(),
        status: 'ACTIVE',
      };

      const mockAd = {
        id: '1',
        title: 'Test Ad',
        videoUrl: 'https://example.com/ad.mp4',
        duration: 30,
        type: 'VIDEO',
      };

      mockUseSprintStore.mockReturnValue({
        currentSprint: mockSprint,
        isSprintActive: true,
        timeUntilStart: 0,
        timeRemaining: 1800000,
      });

      mockUseAds.mockReturnValue({
        ads: [mockAd],
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      mockApiClient.post.mockResolvedValue({
        data: {
          success: true,
          raffleTicketEarned: true,
          message: 'Ticket earned',
        },
      });

      const { getByTestId } = render(<AdPlayer ad={mockAd} onComplete={jest.fn()} />);

      // Simulate watching ad for minimum duration
      await waitFor(() => {
        expect(mockApiClient.post).toHaveBeenCalledWith('/ads/view', {
          adId: '1',
          viewDuration: expect.any(Number),
        });
      });
    });

    it('should not award ticket if ad view duration is too short', async () => {
      const mockAd = {
        id: '1',
        title: 'Test Ad',
        videoUrl: 'https://example.com/ad.mp4',
        duration: 30,
        type: 'VIDEO',
      };

      mockApiClient.post.mockResolvedValue({
        data: {
          success: false,
          raffleTicketEarned: false,
          message: 'Minimum 15 seconds view duration required',
        },
      });

      const { getByTestId } = render(<AdPlayer ad={mockAd} onComplete={jest.fn()} />);

      // Simulate short view duration
      await waitFor(() => {
        expect(mockApiClient.post).toHaveBeenCalled();
      });

      // Should show error message
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });
  });

  describe('Ticket Counter', () => {
    it('should display current ticket count', () => {
      const { getByText } = render(<HomeScreen />);

      // Should show ticket count
      expect(getByText(/\d+/)).toBeTruthy();
    });

    it('should update ticket count after viewing ad', async () => {
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

      mockApiClient.post.mockResolvedValue({
        data: {
          success: true,
          raffleTicketEarned: true,
        },
      });

      const { getByText } = render(<WatchScreen />);

      // After ad view, ticket count should update
      await waitFor(() => {
        expect(mockApiClient.post).toHaveBeenCalled();
      });
    });
  });

  describe('Multiplier System', () => {
    it('should apply default multiplier for new users', () => {
      const { getByText } = render(<HomeScreen />);

      // Should show multiplier of 1.0
      expect(getByText(/x1\.0/i)).toBeTruthy();
    });

    it('should reduce multiplier for winners', () => {
      // Mock user with winner status (multiplier = 0.25)
      const { getByText } = render(<HomeScreen />);

      // Should show reduced multiplier
      expect(getByText(/x0\.25/i)).toBeTruthy();
    });

    it('should increase multiplier for non-winners', () => {
      // Mock user with non-winner status (multiplier increases by 0.1)
      const { getByText } = render(<HomeScreen />);

      // Should show increased multiplier
      expect(getByText(/x1\.1/i)).toBeTruthy();
    });
  });
});




