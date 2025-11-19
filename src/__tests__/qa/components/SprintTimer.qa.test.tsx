/**
 * QA Tests for SprintTimer Component
 * These tests verify UI/UX and accessibility
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SprintTimer } from '@/components/raffle/SprintTimer';
import { SprintStatus } from '@/types/sprint';

const mockSprint = {
  id: '1',
  dayOfWeek: 4, // Thursday
  startTime: '17:00',
  endTime: '18:00',
  duration: 60,
  category: 'Kozmetik',
  status: SprintStatus.ACTIVE,
  startDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  endDate: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
  activeAds: [],
  totalViews: 0,
  totalParticipants: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('SprintTimer QA Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display sprint day name correctly', () => {
    render(<SprintTimer sprint={mockSprint} />);
    expect(screen.getByText(/Perşembe/i)).toBeTruthy();
  });

  it('should display sprint time range', () => {
    render(<SprintTimer sprint={mockSprint} />);
    expect(screen.getByText(/17:00.*18:00/i)).toBeTruthy();
  });

  it('should display category badge when available', () => {
    render(<SprintTimer sprint={mockSprint} />);
    expect(screen.getByText('Kozmetik')).toBeTruthy();
  });

  it('should show active status correctly', () => {
    render(<SprintTimer sprint={mockSprint} />);
    expect(screen.getByText(/Aktif Sprint/i)).toBeTruthy();
  });

  it('should update countdown timer', () => {
    const { rerender } = render(<SprintTimer sprint={mockSprint} />);
    
    // Fast-forward time
    jest.advanceTimersByTime(1000);
    
    // Timer should update
    expect(screen.getByText(/\d+:\d+/)).toBeTruthy();
  });

  it('should handle sprint end state', () => {
    const endedSprint = {
      ...mockSprint,
      status: SprintStatus.ENDED,
      endDate: new Date(Date.now() - 1000).toISOString(),
    };

    render(<SprintTimer sprint={endedSprint} />);
    expect(screen.getByText(/Sprint Bitti/i)).toBeTruthy();
  });
});

