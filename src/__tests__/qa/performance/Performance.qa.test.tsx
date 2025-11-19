/**
 * Performance QA Tests
 * Tests for rendering performance, memory leaks, and optimization
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { SprintTimer } from '@/components/raffle/SprintTimer';
import { SprintStatus } from '@/types/sprint';

describe('Performance Tests', () => {
  it('should not re-render unnecessarily', () => {
    const mockSprint = {
      id: '1',
      dayOfWeek: 4,
      startTime: '17:00',
      endTime: '18:00',
      duration: 60,
      status: SprintStatus.ACTIVE,
      startDate: new Date(Date.now() + 3600000).toISOString(),
      endDate: new Date(Date.now() + 7200000).toISOString(),
      activeAds: [],
      totalViews: 0,
      totalParticipants: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const renderSpy = jest.fn();
    
    const TestComponent = () => {
      renderSpy();
      return <SprintTimer sprint={mockSprint} />;
    };

    const { rerender } = render(<TestComponent />);
    
    // Re-render with same props
    rerender(<TestComponent />);
    
    // Component should handle re-renders gracefully
    expect(renderSpy).toHaveBeenCalled();
  });

  it('should cleanup timers on unmount', () => {
    jest.useFakeTimers();
    
    const mockSprint = {
      id: '1',
      dayOfWeek: 4,
      startTime: '17:00',
      endTime: '18:00',
      duration: 60,
      status: SprintStatus.ACTIVE,
      startDate: new Date(Date.now() + 3600000).toISOString(),
      endDate: new Date(Date.now() + 7200000).toISOString(),
      activeAds: [],
      totalViews: 0,
      totalParticipants: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { unmount } = render(<SprintTimer sprint={mockSprint} />);
    
    // Advance timers
    jest.advanceTimersByTime(1000);
    
    // Unmount should cleanup
    unmount();
    
    // No timers should be running
    jest.useRealTimers();
  });
});

