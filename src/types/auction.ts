export interface TimeSlot {
  id: string;
  startTime: string; // "14:00"
  endTime: string;   // "15:00"
  date: string;      // "2023-11-20"
  isPrimeTime: boolean;
  basePrice: number; // e.g. 1000000 for prime time
  minImpressionPrice: number; // e.g. 0.003
  status: 'OPEN' | 'CLOSED' | 'AWARDED';
  currentHighestBid?: Bid;
}

export interface Bid {
  id: string;
  advertiserId: string;
  advertiserName: string;
  timeSlotId: string;
  basePriceOffer: number;
  impressionPriceOffer: number;
  totalEstimatedValue: number; // Calculated based on estimated impressions
  timestamp: string;
}

export const AUCTION_CONSTANTS = {
  PRIME_TIME_BASE_PRICE: 1000000,
  REGULAR_TIME_BASE_PRICE: 100000,
  PRIME_TIME_MIN_IMPRESSION: 0.003,
  REGULAR_TIME_MIN_IMPRESSION: 0.001,
  CLOSING_HOURS_BEFORE: 24, // Auctions close 24 hours before the slot
};

