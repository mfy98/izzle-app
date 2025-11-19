export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export interface CouponCode {
  id: string;
  advertiserId: string;
  advertiserCompanyName: string;
  code: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses: number; // -1 for unlimited
  usedCount: number;
  validFrom: string;
  validUntil: string;
  minPurchaseAmount: number;
  isActive: boolean;
  affiliateLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountVoucher {
  id: string;
  advertiserId?: string;
  advertiserCompanyName?: string;
  userId?: string;
  voucherCode: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  validFrom: string;
  validUntil: string;
  minPurchaseAmount: number;
  isUsed: boolean;
  isActive: boolean;
  usedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateLink {
  id: string;
  advertiserId: string;
  advertiserCompanyName: string;
  affiliateUserId: string;
  affiliateCode: string;
  fullAffiliateUrl: string;
  targetUrl: string;
  title: string;
  description?: string;
  commissionType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  commissionValue: number;
  clickCount: number;
  conversionCount: number;
  totalEarnings: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateStats {
  totalLinks: number;
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  conversionRate: number; // Percentage
}

