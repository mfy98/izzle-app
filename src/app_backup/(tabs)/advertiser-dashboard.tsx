import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ActivityIndicator } from 'react-native-paper';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { formatNumber, formatDate } from '@/utils/formatting';
import { FadeInView } from '@/components/ui';

interface AdvertiserMetrics {
  totalViews: number;
  uniqueUsers: number;
  totalAds: number;
  activeAds: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  viewsByAd: Array<{
    adId: string;
    adTitle: string;
    viewCount: number;
    uniqueUserCount: number;
    averageDuration: number;
  }>;
  averageViewDuration: number;
  completionRate: number;
  viewsByDate: Record<string, number>;
}

export default function AdvertiserDashboard() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<AdvertiserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/advertiser/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMetrics();
  };

  if (loading && !metrics) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reklam Metrikleri</Text>
          <Text style={styles.subtitle}>Şirketinizin reklam performansı</Text>
        </View>

        {metrics && (
          <>
            {/* Overview Cards */}
            <View style={styles.cardsRow}>
              <FadeInView delay={100}>
                <Card style={styles.card}>
                  <Card.Content>
                    <Text style={styles.cardLabel}>Toplam İzlenme</Text>
                    <Text style={styles.cardValue}>{formatNumber(metrics.totalViews)}</Text>
                  </Card.Content>
                </Card>
              </FadeInView>

              <FadeInView delay={200}>
                <Card style={styles.card}>
                  <Card.Content>
                    <Text style={styles.cardLabel}>Benzersiz Kullanıcı</Text>
                    <Text style={styles.cardValue}>{formatNumber(metrics.uniqueUsers)}</Text>
                  </Card.Content>
                </Card>
              </FadeInView>
            </View>

            <View style={styles.cardsRow}>
              <FadeInView delay={300}>
                <Card style={styles.card}>
                  <Card.Content>
                    <Text style={styles.cardLabel}>Aktif Reklamlar</Text>
                    <Text style={styles.cardValue}>{formatNumber(metrics.activeAds)}</Text>
                    <Text style={styles.cardSubtext}>/ {formatNumber(metrics.totalAds)} toplam</Text>
                  </Card.Content>
                </Card>
              </FadeInView>

              <FadeInView delay={400}>
                <Card style={styles.card}>
                  <Card.Content>
                    <Text style={styles.cardLabel}>Tamamlanma Oranı</Text>
                    <Text style={styles.cardValue}>{metrics.completionRate.toFixed(1)}%</Text>
                  </Card.Content>
                </Card>
              </FadeInView>
            </View>

            {/* Time-based Stats */}
            <FadeInView delay={500}>
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Zaman Bazlı İstatistikler</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{formatNumber(metrics.viewsToday)}</Text>
                      <Text style={styles.statLabel}>Bugün</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{formatNumber(metrics.viewsThisWeek)}</Text>
                      <Text style={styles.statLabel}>Bu Hafta</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{formatNumber(metrics.viewsThisMonth)}</Text>
                      <Text style={styles.statLabel}>Bu Ay</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </FadeInView>

            {/* Views by Ad */}
            {metrics.viewsByAd && metrics.viewsByAd.length > 0 && (
              <FadeInView delay={600}>
                <Card style={styles.sectionCard}>
                  <Card.Content>
                    <Text style={styles.sectionTitle}>Reklam Bazlı İstatistikler</Text>
                    {metrics.viewsByAd.map((adStat, index) => (
                      <View key={adStat.adId} style={styles.adStatItem}>
                        <View style={styles.adStatHeader}>
                          <Text style={styles.adStatTitle}>{adStat.adTitle}</Text>
                          <Text style={styles.adStatCount}>{formatNumber(adStat.viewCount)} izlenme</Text>
                        </View>
                        <View style={styles.adStatDetails}>
                          <Text style={styles.adStatDetail}>
                            {formatNumber(adStat.uniqueUserCount)} benzersiz kullanıcı
                          </Text>
                          <Text style={styles.adStatDetail}>
                            Ort. {adStat.averageDuration.toFixed(1)}s
                          </Text>
                        </View>
                      </View>
                    ))}
                  </Card.Content>
                </Card>
              </FadeInView>
            )}

            {/* Average View Duration */}
            <FadeInView delay={700}>
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Ortalama İzlenme Süresi</Text>
                  <Text style={styles.durationValue}>
                    {metrics.averageViewDuration.toFixed(1)} saniye
                  </Text>
                </Card.Content>
              </Card>
            </FadeInView>
          </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardsRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  card: {
    flex: 1,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  sectionCard: {
    margin: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  adStatItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  adStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  adStatTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  adStatCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  adStatDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  adStatDetail: {
    fontSize: 12,
    color: '#666',
  },
  durationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 8,
  },
});

