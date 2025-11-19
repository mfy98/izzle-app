/**
 * E2E QA Tests for Ad Watching Flow
 * Tests complete flow from ad viewing to ticket earning
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import WatchScreen from '@/app/(tabs)/watch';
import { useSprintStore } from '@/store/sprintStore';
import { useRaffleStore } from '@/store/raffleStore';
import { useAds } from '@/hooks/useAds';
import { SprintStatus } from '@/types/sprint';

jest.mock('@/store/sprintStore');
jest.mock('@/store/raffleStore');
jest.mock('@/hooks/useAds');
jest.mock('expo-router');

describe('Ad Watching Flow E2E Tests', () => {
  const mockSprint = {
    id: '1',
    dayOfWeek: 4,
    startTime: '17:00',
    endTime: '18:00',
    duration: 60,
    category: 'Kozmetik',
    status: SprintStatus.ACTIVE,
    startDate: new Date(Date.now() - 1000).toISOString(),
    endDate: new Date(Date.now() + 3600000).toISOString(),
    activeAds: [],
    totalViews: 0,
    totalParticipants: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockRecordAdView = jest.fn().mockResolvedValue({
    success: true,
    raffleTicketEarned: true,
    ticketsEarned: 1,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useSprintStore as jest.Mock).mockReturnValue({
      currentSprint: mockSprint,
    });

    (useRaffleStore as jest.Mock).mockReturnValue({
      myTickets: 0,
      myMultiplier: 1.0,
      incrementTickets: jest.fn(),
    });

    (useAds as jest.Mock).mockReturnValue({
      recordAdView: mockRecordAdView,
      getNextAd: jest.fn().mockResolvedValue({
        success: true,
        data: {
          id: '1',
          videoUrl: 'mock-url',
          duration: 30,
        },
      }),
    });
  });

  it('should allow ad viewing during active sprint', async () => {
    render(<WatchScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Reklam İzle/i)).toBeTruthy();
      expect(screen.getByText(/Aktif Sprint/i)).toBeTruthy();
    });
  });

  it('should prevent ad viewing when sprint is inactive', async () => {
    const inactiveSprint = {
      ...mockSprint,
      status: SprintStatus.ENDED,
      endDate: new Date(Date.now() - 1000).toISOString(),
    };

    (useSprintStore as jest.Mock).mockReturnValue({
      currentSprint: inactiveSprint,
    });

    render(<WatchScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Sprint aktif değil/i)).toBeTruthy();
    });
  });

  it('should display ticket counter', async () => {
    render(<WatchScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Çekiliş Hakları/i)).toBeTruthy();
    });
  });
});

