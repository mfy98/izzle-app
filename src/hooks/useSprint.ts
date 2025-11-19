import { useCallback, useEffect, useState } from 'react';
import { useSprintStore } from '@/store/sprintStore';
import { Sprint, SprintStatus } from '@/types/sprint';
import { calculateSprintTimeRemaining, isSprintActive } from '@/utils';

export const useSprint = () => {
  const { currentSprint, nextSprint, setCurrentSprint, setNextSprint, setSchedule } = useSprintStore();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);

  // Fetch current sprint (mock data for now)
  const fetchCurrentSprint = useCallback(async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.get('/sprint/current');
      // setCurrentSprint(response.data);

      // Mock sprint data
      const now = new Date();
      const mockSprint: Sprint = {
        id: '1',
        dayOfWeek: 4, // Thursday
        startTime: '17:00',
        endTime: '18:00',
        duration: 60,
        category: 'Kozmetik',
        status: SprintStatus.UPCOMING,
        startDate: new Date(now.setHours(17, 0, 0, 0)).toISOString(),
        endDate: new Date(now.setHours(18, 0, 0, 0)).toISOString(),
        activeAds: ['1'],
        totalViews: 1250,
        totalParticipants: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentSprint(mockSprint);
      return { success: true, data: mockSprint };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Sprint bilgisi alınamadı',
      };
    }
  }, [setCurrentSprint]);

  // Fetch next sprint
  const fetchNextSprint = useCallback(async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.get('/sprint/next');
      // setNextSprint(response.data);

      // Mock next sprint
      const now = new Date();
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + 1);
      
      const mockNextSprint: Sprint = {
        id: '2',
        dayOfWeek: 5, // Friday
        startTime: '17:00',
        endTime: '18:00',
        duration: 60,
        category: 'Teknoloji',
        status: SprintStatus.UPCOMING,
        startDate: new Date(nextDate.setHours(17, 0, 0, 0)).toISOString(),
        endDate: new Date(nextDate.setHours(18, 0, 0, 0)).toISOString(),
        activeAds: [],
        totalViews: 0,
        totalParticipants: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNextSprint(mockNextSprint);
      return { success: true, data: mockNextSprint };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Sonraki sprint bilgisi alınamadı',
      };
    }
  }, [setNextSprint]);

  // Update timer
  useEffect(() => {
    if (!currentSprint) return;

    const updateTimer = () => {
      const result = calculateSprintTimeRemaining(currentSprint);
      const active = isSprintActive(currentSprint);
      
      setIsActive(active);
      
      if (active && result.untilEnd) {
        setTimeRemaining(result.untilEnd);
      } else if (!active && result.untilStart) {
        setTimeRemaining(result.untilStart);
      } else {
        setTimeRemaining(0);
      }

      // Update schedule
      if (currentSprint) {
        setSchedule({
          sprint: currentSprint,
          nextSprint: nextSprint || undefined,
          timeUntilStart: result.untilStart,
          timeUntilEnd: result.untilEnd,
          isActive: active,
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentSprint, nextSprint, setSchedule]);

  return {
    currentSprint,
    nextSprint,
    timeRemaining,
    isActive,
    fetchCurrentSprint,
    fetchNextSprint,
  };
};

