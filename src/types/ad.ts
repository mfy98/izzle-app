export enum AdType {
  SPONSOR = 'sponsor',
  ADMOB = 'admob',
  BANNER = 'banner',
  COVER = 'cover',
  NETWORK = 'network',
}

export interface Ad {
  id: string;
  advertiserId: string;
  type: AdType;
  title: string;
  videoUrl?: string;
  imageUrl?: string;
  bannerUrl?: string;
  coverUrl?: string;
  logoUrl?: string;
  duration: number; // in seconds
  isActive: boolean;
  startDate: string;
  endDate: string;
  impressionCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Advertiser {
  id: string;
  companyName: string;
  taxNumber?: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  address?: string;
  isVerified: boolean;
  ads: Ad[];
  createdAt: string;
  updatedAt: string;
}

export interface AdvertiserRegistrationForm {
  companyName: string;
  taxNumber?: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  logo?: File;
}

export interface AdViewResponse {
  success: boolean;
  raffleTicketEarned: boolean;
  multiplier: number;
  message?: string;
}

