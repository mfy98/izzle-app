export enum RaffleStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DRAWING = 'drawing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Raffle {
  id: string;
  sprintId: string;
  prize: Prize;
  status: RaffleStatus;
  totalParticipants: number;
  totalTickets: number;
  winners?: Winner[];
  drawDate: string;
  drawTime: string;
  notaryHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  category: string; // 'cosmetic', 'technology', etc.
  value: number;
  imageUrl?: string;
  sponsor?: string;
}

export interface Winner {
  userId: string;
  userName: string;
  ticketCount: number;
  prize: Prize;
  announcedAt: string;
}

export interface RaffleThreshold {
  id: string;
  viewCount: number;
  prize: Prize;
  isActive: boolean;
}

