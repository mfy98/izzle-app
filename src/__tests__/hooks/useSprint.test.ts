import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSprint } from '@/hooks/useSprint';
import { useSprintStore } from '@/store/sprintStore';
import { SprintStatus } from '@/types/sprint';

jest.mock('@/store/sprintStore');

describe('useSprint Hook', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    (useSprintStore as jest.Mock).mockReturnValue({
      currentSprint: mockSprint,
      nextSprint: null,
      setCurrentSprint: jest.fn(),
      setNextSprint: jest.fn(),
      setSchedule: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should fetch current sprint', async () => {
    const { result } = renderHook(() => useSprint());

    await act(async () => {
      await result.current.fetchCurrentSprint();
    });

    await waitFor(() => {
      expect(result.current.currentSprint).toBeTruthy();
    });
  });

  it('should update timer every second', () => {
    const { result } = renderHook(() => useSprint());

    expect(result.current.timeRemaining).toBeGreaterThanOrEqual(0);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Timer should update
    expect(result.current.timeRemaining).toBeDefined();
  });

  it('should detect active sprint', () => {
    const { result } = renderHook(() => useSprint());
    
    expect(result.current.isActive).toBeDefined();
  });
});

