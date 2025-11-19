import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { formatNumber, formatDate, formatCurrency } from '@/utils/formatting';
import { copyToClipboard } from '@/utils/clipboard';
import { FadeInView } from '@/components/ui';
import { CouponCode, DiscountVoucher } from '@/types/coupon';
import { UserRole } from '@/types/user';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export default function CouponsScreen() {
  const { user } = useAuthStore();
  const { handleError } = useErrorHandler();
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [vouchers, setVouchers] = useState<DiscountVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'coupons' | 'vouchers'>('coupons');

  // Mock data for coupons
  const getMockCoupons = (): CouponCode[] => {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: '1',
        advertiserId: '1',
        advertiserCompanyName: 'TechStore',
        code: 'TECH20',
        title: 'Teknoloji Ürünlerinde %20 İndirim',
        description: 'Tüm teknoloji ürünlerinde geçerli özel indirim kodu',
        discountType: 'PERCENTAGE' as any,
        discountValue: 20,
        maxUses: 1000,
        usedCount: 234,
        validFrom: now.toISOString(),
        validUntil: nextMonth.toISOString(),
        minPurchaseAmount: 100,
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: '2',
        advertiserId: '2',
        advertiserCompanyName: 'FashionHub',
        code: 'FASHION50',
        title: 'Moda Ürünlerinde 50 TL İndirim',
        description: '200 TL ve üzeri alışverişlerde geçerli',
        discountType: 'FIXED_AMOUNT' as any,
        discountValue: 50,
        maxUses: 500,
        usedCount: 89,
        validFrom: now.toISOString(),
        validUntil: nextMonth.toISOString(),
        minPurchaseAmount: 200,
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: '3',
        advertiserId: '3',
        advertiserCompanyName: 'HomeDecor',
        code: 'HOME15',
        title: 'Ev Dekorasyonunda %15 İndirim',
        description: 'Tüm ev dekorasyon ürünlerinde geçerli',
        discountType: 'PERCENTAGE' as any,
        discountValue: 15,
        maxUses: -1, // Unlimited
        usedCount: 456,
        validFrom: now.toISOString(),
        validUntil: nextMonth.toISOString(),
        minPurchaseAmount: 50,
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: '4',
        advertiserId: '4',
        advertiserCompanyName: 'SportZone',
        code: 'SPORT30',
        title: 'Spor Ürünlerinde %30 İndirim',
        description: 'Tüm spor ve fitness ürünlerinde geçerli',
        discountType: 'PERCENTAGE' as any,
        discountValue: 30,
        maxUses: 200,
        usedCount: 12,
        validFrom: now.toISOString(),
        validUntil: nextMonth.toISOString(),
        minPurchaseAmount: 150,
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];
  };

  // Mock data for vouchers
  const getMockVouchers = (): DiscountVoucher[] => {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: '1',
        advertiserId: '1',
        advertiserCompanyName: 'TechStore',
        userId: user?.id || '1',
        voucherCode: 'VOUCHER100',
        title: '100 TL İndirim Çeki',
        description: 'Özel indirim çeki - Tek kullanımlık',
        discountType: 'FIXED_AMOUNT' as any,
        discountValue: 100,
        validFrom: now.toISOString(),
        validUntil: nextMonth.toISOString(),
        minPurchaseAmount: 300,
        isUsed: false,
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: '2',
        advertiserId: '2',
        advertiserCompanyName: 'FashionHub',
        userId: user?.id || '1',
        voucherCode: 'VOUCHER25',
        title: '%25 İndirim Çeki',
        description: 'Moda ürünlerinde geçerli indirim çeki',
        discountType: 'PERCENTAGE' as any,
        discountValue: 25,
        validFrom: now.toISOString(),
        validUntil: nextMonth.toISOString(),
        minPurchaseAmount: 100,
        isUsed: false,
        isActive: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: '3',
        advertiserId: '3',
        advertiserCompanyName: 'HomeDecor',
        userId: user?.id || '1',
        voucherCode: 'VOUCHER50',
        title: '50 TL İndirim Çeki (Kullanıldı)',
        description: 'Ev dekorasyon ürünlerinde geçerli',
        discountType: 'FIXED_AMOUNT' as any,
        discountValue: 50,
        validFrom: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        validUntil: nextMonth.toISOString(),
        minPurchaseAmount: 150,
        isUsed: true,
        isActive: true,
        usedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'coupons') {
        try {
          const response = await apiClient.get<CouponCode[]>('/coupons/active');
          setCoupons(response.data);
        } catch (error) {
          // Fallback to mock data if API fails
          console.warn('Failed to load coupons from API, using mock data:', error);
          setCoupons(getMockCoupons());
        }
      } else {
        if (user) {
          try {
            const response = await apiClient.get<DiscountVoucher[]>('/vouchers/my-vouchers');
            setVouchers(response.data);
          } catch (error) {
            // Fallback to mock data if API fails
            console.warn('Failed to load vouchers from API, using mock data:', error);
            setVouchers(getMockVouchers());
          }
        }
      }
    } catch (error) {
      handleError(error as Error, true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCopyCode = async (code: string) => {
    await copyToClipboard(code, 'Kod panoya kopyalandı!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>İndirim Kodları</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'coupons' && styles.activeTab]}
          onPress={() => setActiveTab('coupons')}
        >
          <Text style={[styles.tabText, activeTab === 'coupons' && styles.activeTabText]}>
            Kupon Kodları
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vouchers' && styles.activeTab]}
          onPress={() => setActiveTab('vouchers')}
        >
          <Text style={[styles.tabText, activeTab === 'vouchers' && styles.activeTabText]}>
            İndirim Çekleri
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'coupons' ? (
          <>
            {coupons.map((coupon, index) => (
              <FadeInView key={coupon.id} delay={index * 100}>
                <Card style={styles.card}>
                  <View style={styles.cardContent}>
                    <View style={styles.couponHeader}>
                      <View style={styles.couponInfo}>
                        <Text style={styles.couponCode}>{coupon.code}</Text>
                        <Text style={styles.couponTitle}>{coupon.title}</Text>
                        {coupon.description && (
                          <Text style={styles.couponDescription}>{coupon.description}</Text>
                        )}
                      </View>
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                          {coupon.discountType === 'PERCENTAGE' 
                            ? `%${coupon.discountValue}` 
                            : formatCurrency(coupon.discountValue)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.couponDetails}>
                      <Text style={styles.detailText}>
                        Geçerlilik: {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}
                      </Text>
                      {coupon.minPurchaseAmount > 0 && (
                        <Text style={styles.detailText}>
                          Min. Alışveriş: {formatCurrency(coupon.minPurchaseAmount)}
                        </Text>
                      )}
                      <Text style={styles.detailText}>
                        Kullanım: {coupon.usedCount} / {coupon.maxUses === -1 ? '∞' : coupon.maxUses}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => handleCopyCode(coupon.code)}
                    >
                      <Text style={styles.copyButtonText}>Kodu Kopyala</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </FadeInView>
            ))}
          </>
        ) : (
          <>
            {vouchers.map((voucher, index) => (
              <FadeInView key={voucher.id} delay={index * 100}>
                <Card style={[styles.card, voucher.isUsed && styles.usedCard]}>
                  <View style={styles.cardContent}>
                    <View style={styles.couponHeader}>
                      <View style={styles.couponInfo}>
                        <Text style={styles.couponCode}>{voucher.voucherCode}</Text>
                        <Text style={styles.couponTitle}>{voucher.title}</Text>
                        {voucher.description && (
                          <Text style={styles.couponDescription}>{voucher.description}</Text>
                        )}
                      </View>
                      <View style={[styles.discountBadge, voucher.isUsed && styles.usedBadge]}>
                        <Text style={styles.discountText}>
                          {voucher.discountType === 'PERCENTAGE' 
                            ? `%${voucher.discountValue}` 
                            : formatCurrency(voucher.discountValue)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.couponDetails}>
                      <Text style={styles.detailText}>
                        Geçerlilik: {formatDate(voucher.validFrom)} - {formatDate(voucher.validUntil)}
                      </Text>
                      {voucher.minPurchaseAmount > 0 && (
                        <Text style={styles.detailText}>
                          Min. Alışveriş: {formatCurrency(voucher.minPurchaseAmount)}
                        </Text>
                      )}
                      {voucher.isUsed && (
                        <Text style={styles.usedText}>
                          Kullanıldı: {voucher.usedAt ? formatDate(voucher.usedAt) : 'Bilinmiyor'}
                        </Text>
                      )}
                    </View>

                    {!voucher.isUsed && (
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => handleCopyCode(voucher.voucherCode)}
                      >
                        <Text style={styles.copyButtonText}>Kodu Kopyala</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              </FadeInView>
            ))}
          </>
        )}

        {((activeTab === 'coupons' && coupons.length === 0) || 
          (activeTab === 'vouchers' && vouchers.length === 0)) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'coupons' 
                ? 'Henüz aktif kupon kodu yok' 
                : 'Henüz indirim çekiniz yok'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 2,
    borderRadius: 8,
  },
  usedCard: {
    opacity: 0.6,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  couponInfo: {
    flex: 1,
  },
  couponCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usedBadge: {
    backgroundColor: '#999',
  },
  discountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  couponDetails: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  usedText: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: '600',
    marginTop: 4,
  },
  copyButton: {
    marginTop: 12,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  cardContent: {
    padding: 16,
  },
});

