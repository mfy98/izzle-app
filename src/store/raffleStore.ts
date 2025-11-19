import { create } from 'zustand';
import { Raffle, Winner } from '@/types/raffle';

interface RaffleState {
  activeRaffles: Raffle[];
  myTickets: number;
  myMultiplier: number;
  winners: Winner[];
  isLoading: boolean;
  setActiveRaffles: (raffles: Raffle[]) => void;
  setMyTickets: (tickets: number) => void;
  setMyMultiplier: (multiplier: number) => void;
  setWinners: (winners: Winner[]) => void;
  incrementTickets: (count: number) => void;
}

export const useRaffleStore = create<RaffleState>((set) => ({
  activeRaffles: [],
  myTickets: 0,
  myMultiplier: 1.0,
  winners: [],
  isLoading: false,

  setActiveRaffles: (raffles) => set({ activeRaffles: raffles }),

  setMyTickets: (tickets) => set({ myTickets: tickets }),

  setMyMultiplier: (multiplier) => set({ myMultiplier: multiplier }),

  setWinners: (winners) => set({ winners }),

  incrementTickets: (count) =>
    set((state) => ({ myTickets: state.myTickets + count })),
}));

