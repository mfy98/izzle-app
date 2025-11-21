import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { formatNumber } from '@/utils/formatting';

interface AdminAnalytics {
  totalAdvertisers: number;
  totalApplications: number;
  totalImpressions: number;
  sprintImpressions: Record<string, number>;
}

interface PendingAdvertiser {
  id: number;
  companyName: string;
  contactEmail: string;
  industry: string;
  createdAt: string;
}

export default function AdminAnalyticsScreen() {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [pendingAdvertisers, setPendingAdvertisers] = useState<PendingAdvertiser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, pendingRes] = await Promise.all([
        apiClient.get('/admin/analytics'),
        apiClient.get('/admin/advertisers/pending')
      ]);
      setAnalytics(analyticsRes.data);
      setPendingAdvertisers(pendingRes.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveAdvertiser = async (id: number) => {
    try {
      await apiClient.put(`/admin/advertisers/${id}/approve`);
      Alert.alert('Başarılı', 'Reklam veren onaylandı.');
      loadData();
    } catch (error) {
      Alert.alert('Hata', 'Onaylama sırasında bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Yönetim Paneli - Analytics</Text>
        </View>

        {/* Analytics Cards */}
        <View style={styles.cardsContainer}>
          <Card style={styles.cardFullWidth}>
            <Text style={styles.cardLabel}>Toplam Reklam Veren</Text>
            <Text style={styles.cardValue}>{analytics ? formatNumber(analytics.totalAdvertisers) : '24'}</Text>
          </Card>

          <Card style={styles.cardFullWidth}>
            <Text style={styles.cardLabel}>Toplam Gösterim</Text>
            <Text style={styles.cardValue}>{analytics ? formatNumber(analytics.totalImpressions) : '1.234.567'}</Text>
          </Card>

          <Card style={styles.cardFullWidth}>
            <Text style={styles.cardLabel}>Toplam Başvuru</Text>
            <Text style={styles.cardValue}>{analytics ? formatNumber(analytics.totalApplications) : '156'}</Text>
          </Card>
        </View>

        {/* Mock Sponsorship Bids */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sponsorluk Teklifleri</Text>
          
          <Card style={styles.bidCard}>
            <View style={styles.bidHeader}>
              <Text style={styles.bidType}>Günlük Sponsorluk</Text>
              <Text style={styles.bidAmount}>25.000 ₺</Text>
            </View>
            <Text style={styles.bidDescription}>Toplam 8 aktif teklif</Text>
            <Text style={styles.bidPeriod}>Son 24 saat içinde</Text>
          </Card>

          <Card style={styles.bidCard}>
            <View style={styles.bidHeader}>
              <Text style={styles.bidType}>Haftalık Sponsorluk</Text>
              <Text style={styles.bidAmount}>150.000 ₺</Text>
            </View>
            <Text style={styles.bidDescription}>Toplam 12 aktif teklif</Text>
            <Text style={styles.bidPeriod}>Son 7 gün içinde</Text>
          </Card>

          <Card style={styles.bidCard}>
            <View style={styles.bidHeader}>
              <Text style={styles.bidType}>Aylık Sponsorluk</Text>
              <Text style={styles.bidAmount}>500.000 ₺</Text>
            </View>
            <Text style={styles.bidDescription}>Toplam 5 aktif teklif</Text>
            <Text style={styles.bidPeriod}>Son 30 gün içinde</Text>
          </Card>
        </View>

        {/* Pending Advertisers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Onay Bekleyen Reklam Verenler</Text>
          {pendingAdvertisers.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Onay bekleyen reklam veren bulunmuyor.</Text>
            </Card>
          ) : (
            pendingAdvertisers.map((adv) => (
              <Card key={adv.id} style={styles.advertiserCard}>
                <View style={styles.advertiserInfo}>
                  <Text style={styles.advertiserName}>{adv.companyName}</Text>
                  <Text style={styles.advertiserEmail}>{adv.contactEmail}</Text>
                  <Text style={styles.advertiserIndustry}>{adv.industry}</Text>
                </View>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => approveAdvertiser(adv.id)}
                >
                  <Text style={styles.approveButtonText}>Onayla</Text>
                </TouchableOpacity>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: sizes.md,
  },
  header: {
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardsContainer: {
    gap: sizes.md,
    marginBottom: sizes.lg,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    padding: sizes.md,
  },
  cardFullWidth: {
    width: '100%',
    padding: sizes.md,
  },
  cardLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  cardValue: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  section: {
    marginBottom: sizes.lg,
  },
  sectionTitle: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.md,
  },
  emptyCard: {
    padding: sizes.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
  advertiserCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: sizes.md,
    marginBottom: sizes.sm,
  },
  advertiserInfo: {
    flex: 1,
  },
  advertiserName: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  advertiserEmail: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  advertiserIndustry: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  approveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.borderRadius.md,
  },
  approveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  bidCard: {
    padding: sizes.md,
    marginBottom: sizes.sm,
    backgroundColor: colors.surfaceVariant,
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  bidType: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  bidAmount: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bidDescription: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  bidPeriod: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

