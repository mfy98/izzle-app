export enum SprintStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  ENDED = 'ended',
  DRAWING = 'drawing',
  COMPLETED = 'completed',
}

export interface Sprint {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // in minutes (default 60)
  category?: string; // 'cosmetic', 'technology', etc.
  status: SprintStatus;
  startDate: string;
  endDate: string;
  activeAds: string[]; // Ad IDs
  totalViews: number;
  totalParticipants: number;
  raffleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SprintSchedule {
  sprint: Sprint;
  nextSprint?: Sprint;
  timeUntilStart?: number; // in milliseconds
  timeUntilEnd?: number; // in milliseconds
  isActive: boolean;
}

