import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useRaffleStore } from '@/store/raffleStore';
import { useSprintStore } from '@/store/sprintStore';
import { UserRole } from '@/types/user';
import { router } from 'expo-router';
import { colors, sizes } from '@/constants';
import { SprintTimer } from '@/components/raffle/SprintTimer';
import { RewardThresholds, RewardThreshold } from '@/components/raffle/RewardThresholds';
import { apiClient } from '@/services/api/client';

// Advertiser Analytics Component
const AdvertiserAnalytics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    // Her 5 saniyede bir güncelle
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await apiClient.get('/advertiser/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="chart-line" size={32} color={colors.primary} />
        <Text style={styles.title}>Canlı Metrikler</Text>
        <Text style={styles.subtitle}>Her 5 saniyede bir güncelleniyor</Text>
      </View>

      {metrics && (
        <>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Toplam İzlenme</Text>
              <Text style={styles.metricValue}>{metrics.totalViews?.toLocaleString() || 0}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Benzersiz Kullanıcı</Text>
              <Text style={styles.metricValue}>{metrics.uniqueUsers?.toLocaleString() || 0}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Aktif Reklamlar</Text>
              <Text style={styles.metricValue}>{metrics.activeAds || 0}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Bugün</Text>
              <Text style={styles.metricValue}>{metrics.viewsToday?.toLocaleString() || 0}</Text>
            </View>
          </View>

          {metrics.viewsByAd && metrics.viewsByAd.length > 0 && (
            <View style={styles.adStatsContainer}>
              <Text style={styles.sectionTitle}>Reklam Performansı</Text>
              {metrics.viewsByAd.slice(0, 3).map((ad: any) => (
                <View key={ad.adId} style={styles.adStatItem}>
                  <Text style={styles.adStatTitle}>{ad.adTitle}</Text>
                  <Text style={styles.adStatCount}>{ad.viewCount} izlenme</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

// Mock reward thresholds - will be replaced with API call
const getMockRewardThresholds = (currentViews: number): RewardThreshold[] => {
  return [
    {
      id: '1',
      viewCount: 10000,
      rewards: [
        { name: 'iPhone', quantity: 1, icon: 'cellphone' },
      ],
      isReached: currentViews >= 10000,
    },
    {
      id: '2',
      viewCount: 25000,
      rewards: [
        { name: 'Laptop', quantity: 1, icon: 'laptop' },
        { name: 'iPhone', quantity: 3, icon: 'cellphone' },
      ],
      isReached: currentViews >= 25000,
    },
    {
      id: '3',
      viewCount: 50000,
      rewards: [
        { name: 'MacBook Pro', quantity: 2, icon: 'laptop' },
        { name: 'iPhone', quantity: 5, icon: 'cellphone' },
        { name: 'AirPods Pro', quantity: 10, icon: 'headphones' },
      ],
      isReached: currentViews >= 50000,
    },
    {
      id: '4',
      viewCount: 100000,
      rewards: [
        { name: 'Tesla Model 3', quantity: 1, icon: 'car' },
        { name: 'MacBook Pro', quantity: 5, icon: 'laptop' },
        { name: 'iPhone', quantity: 20, icon: 'cellphone' },
      ],
      isReached: currentViews >= 100000,
    },
  ];
};

// User Watch Action Component
const UserWatchAction = () => {
  const { myTickets, myMultiplier } = useRaffleStore();
  const { currentSprint } = useSprintStore();
  const [adViews, setAdViews] = useState(0);
  const [totalViews, setTotalViews] = useState(8500); // Mock total views - will be from API
  const [rewardThresholds, setRewardThresholds] = useState<RewardThreshold[]>([]);

  React.useEffect(() => {
    // Update thresholds based on current views
    setRewardThresholds(getMockRewardThresholds(totalViews));
  }, [totalViews]);

  const handleStartWatching = () => {
    router.push('/(tabs)/watch');
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="play-circle" size={48} color={colors.primary} />
        <Text style={styles.title}>Reklam İzle</Text>
        <Text style={styles.subtitle}>Çekiliş hakkı kazan</Text>
      </View>

      {currentSprint && (
        <View style={styles.sprintContainer}>
          <SprintTimer sprint={currentSprint} />
        </View>
      )}

      {/* Ödül Eşikleri */}
      {rewardThresholds.length > 0 && (
        <View style={styles.thresholdsContainer}>
          <RewardThresholds
            currentViews={totalViews}
            thresholds={rewardThresholds}
          />
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="ticket" size={24} color={colors.primary} />
          <Text style={styles.statLabel}>Çekiliş Haklarınız</Text>
          <Text style={styles.statValue}>{myTickets}</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="flash" size={24} color={colors.primary} />
          <Text style={styles.statLabel}>Çarpanınız</Text>
          <Text style={styles.statValue}>x{myMultiplier.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartWatching}>
        <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Reklam İzlemeye Başla</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Admin Ads Management Component
const AdminAdsManagement = () => {
  const handleManageAds = () => {
    router.push('/(tabs)/admin-panel');
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="video" size={48} color={colors.primary} />
        <Text style={styles.title}>Reklam Yönetimi</Text>
        <Text style={styles.subtitle}>Reklamları onayla ve yönet</Text>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleManageAds}>
        <MaterialCommunityIcons name="cog" size={24} color={colors.primary} />
        <Text style={styles.actionButtonText}>Reklam Paneline Git</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default function CenterActionScreen() {
  const { user } = useAuthStore();

  if (user?.role === UserRole.ADVERTISER) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AdvertiserAnalytics />
      </SafeAreaView>
    );
  }

  if (user?.role === UserRole.ADMIN) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AdminAdsManagement />
      </SafeAreaView>
    );
  }

  // Default: USER
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <UserWatchAction />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: sizes.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: sizes.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginTop: sizes.xs,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: sizes.md,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    marginBottom: sizes.sm,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  metricValue: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  adStatsContainer: {
    marginTop: sizes.md,
  },
  sectionTitle: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  adStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: sizes.sm,
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.md,
    marginBottom: sizes.xs,
  },
  adStatTitle: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    flex: 1,
  },
  adStatCount: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
  sprintContainer: {
    marginBottom: sizes.md,
  },
  thresholdsContainer: {
    marginBottom: sizes.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: sizes.xs,
  },
  statLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  statValue: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: sizes.xs,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    marginTop: sizes.md,
  },
  startButtonText: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: sizes.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: sizes.sm,
  },
});

