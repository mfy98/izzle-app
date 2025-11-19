import { create } from 'zustand';
import { Sprint, SprintSchedule } from '@/types/sprint';

interface SprintState {
  currentSprint: Sprint | null;
  nextSprint: Sprint | null;
  schedule: SprintSchedule | null;
  isLoading: boolean;
  setCurrentSprint: (sprint: Sprint | null) => void;
  setNextSprint: (sprint: Sprint | null) => void;
  setSchedule: (schedule: SprintSchedule) => void;
  updateSprintStatus: (status: Sprint['status']) => void;
}

export const useSprintStore = create<SprintState>((set) => ({
  currentSprint: null,
  nextSprint: null,
  schedule: null,
  isLoading: false,

  setCurrentSprint: (sprint) => set({ currentSprint: sprint }),

  setNextSprint: (sprint) => set({ nextSprint: sprint }),

  setSchedule: (schedule) => set({ schedule }),

  updateSprintStatus: (status) =>
    set((state) => ({
      currentSprint: state.currentSprint
        ? { ...state.currentSprint, status }
        : null,
    })),
}));

