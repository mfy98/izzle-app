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
  advertiserName: string;
  uploadStatus: string;
  isActive: boolean;
  impressionCount: number;
  clickCount: number;
  createdAt: string;
}

export default function AdsManagementScreen() {
  const { user } = useAuthStore();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== UserRole.ADMIN) {
      router.replace('/(tabs)/home');
      return;
    }
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const response = await apiClient.get('/admin/ads');
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

  const handleApprove = async (adId: string) => {
    try {
      await apiClient.post(`/admin/ads/${adId}/approve`);
      loadAds();
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  const handleReject = async (adId: string) => {
    try {
      await apiClient.post(`/admin/ads/${adId}/reject`);
      loadAds();
    } catch (error) {
      console.error('Error rejecting ad:', error);
    }
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
          <MaterialCommunityIcons name="video" size={32} color={colors.primary} />
          <Text style={styles.title}>Reklam Yönetimi</Text>
          <Text style={styles.subtitle}>Reklamları onayla ve yönet</Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/admin-panel')}
        >
          <MaterialCommunityIcons name="calendar-clock" size={24} color={colors.primary} />
          <Text style={styles.actionButtonText}>Reklam Takvimi</Text>
        </TouchableOpacity>

        {ads.map((ad) => (
          <Card key={ad.id} style={styles.adCard}>
            <View style={styles.adHeader}>
              <View style={styles.adInfo}>
                <Text style={styles.adTitle}>{ad.title}</Text>
                <Text style={styles.advertiserName}>{ad.advertiserName}</Text>
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

            {ad.uploadStatus === 'PENDING' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.approveButton, styles.actionBtn]}
                  onPress={() => handleApprove(ad.id)}
                >
                  <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                  <Text style={styles.approveButtonText}>Onayla</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rejectButton, styles.actionBtn]}
                  onPress={() => handleReject(ad.id)}
                >
                  <MaterialCommunityIcons name="close" size={20} color="#FFFFFF" />
                  <Text style={styles.rejectButtonText}>Reddet</Text>
                </TouchableOpacity>
              </View>
            )}
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
    alignItems: 'center',
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: sizes.sm,
  },
  subtitle: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: sizes.md,
    borderRadius: sizes.radius,
    marginBottom: sizes.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.primary,
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
  advertiserName: {
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
    marginBottom: sizes.sm,
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
  actionButtons: {
    flexDirection: 'row',
    gap: sizes.sm,
    marginTop: sizes.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizes.sm,
    borderRadius: sizes.radius,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
});


