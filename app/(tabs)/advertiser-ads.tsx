import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { UserRole } from '@/types/user';
import { colors, sizes } from '@/constants';
import { router } from 'expo-router';

interface Ad {
  id: string;
  title: string;
  type: string;
  uploadStatus: string;
  isActive: boolean;
  impressionCount: number;
  clickCount: number;
  createdAt: string;
}

export default function AdvertiserAdsScreen() {
  const { user } = useAuthStore();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== UserRole.ADVERTISER) {
      router.replace('/(tabs)/home');
      return;
    }
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const response = await apiClient.get('/advertiser/ads');
      setAds(response.data);
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAds();
  };

  const handleUploadAd = () => {
    router.push('/advertiser-register');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '#10B981';
      case 'PENDING':
        return '#F59E0B';
      case 'REJECTED':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reklamlarım</Text>
          <Text style={styles.subtitle}>Reklamlarınızı yönetin</Text>
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadAd}>
          <MaterialCommunityIcons name="plus-circle" size={24} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Yeni Reklam Yükle</Text>
        </TouchableOpacity>

        {ads.map((ad) => (
          <Card key={ad.id} style={styles.adCard}>
            <View style={styles.adHeader}>
              <View style={styles.adInfo}>
                <Text style={styles.adTitle}>{ad.title}</Text>
                <Text style={styles.adType}>{ad.type}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(ad.uploadStatus) + '20' },
                ]}
              >
                <Text style={[styles.statusText, { color: getStatusColor(ad.uploadStatus) }]}>
                  {ad.uploadStatus}
                </Text>
              </View>
            </View>

            <View style={styles.adStats}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="eye" size={16} color={colors.textSecondary} />
                <Text style={styles.statText}>{ad.impressionCount} görüntülenme</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="cursor-click" size={16} color={colors.textSecondary} />
                <Text style={styles.statText}>{ad.clickCount} tıklama</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
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
  header: {
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  subtitle: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: sizes.md,
    borderRadius: sizes.radius,
    marginBottom: sizes.md,
  },
  uploadButtonText: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: sizes.sm,
  },
  adCard: {
    marginBottom: sizes.sm,
    padding: sizes.md,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: sizes.sm,
  },
  adInfo: {
    flex: 1,
  },
  adTitle: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  adType: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.radius,
  },
  statusText: {
    fontSize: sizes.fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  adStats: {
    flexDirection: 'row',
    gap: sizes.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
});


