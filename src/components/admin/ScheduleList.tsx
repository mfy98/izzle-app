import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';

interface AdSchedule {
  id: string;
  advertiserId: string;
  advertiserName: string;
  adId?: string;
  adTitle?: string;
  startDate: string;
  endDate: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  priority: number;
  isActive: boolean;
  useGoogleAds: boolean;
}

interface ScheduleListProps {
  schedules: AdSchedule[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  onDelete,
  onRefresh,
}) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const renderScheduleItem = ({ item }: { item: AdSchedule }) => (
    <Card style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <View style={styles.scheduleInfo}>
          <Text style={styles.advertiserName}>{item.advertiserName}</Text>
          <Text style={styles.scheduleDetails}>
            {DAYS[item.dayOfWeek]} • {item.startTime} - {item.endTime}
          </Text>
          <Text style={styles.dateRange}>
            {new Date(item.startDate).toLocaleDateString('tr-TR')} -{' '}
            {new Date(item.endDate).toLocaleDateString('tr-TR')}
          </Text>
        </View>
        <View style={styles.scheduleActions}>
          <View
            style={[
              styles.statusBadge,
              item.isActive ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.isActive ? styles.activeText : styles.inactiveText,
              ]}
            >
              {item.isActive ? 'Aktif' : 'Pasif'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(item.id)}
          >
            <Text style={styles.deleteText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
      {item.useGoogleAds && (
        <View style={styles.googleAdsBadge}>
          <Text style={styles.googleAdsText}>Google Ads</Text>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Toplam {schedules.length} zamanlama
      </Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        renderItem={renderScheduleItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz zamanlama bulunmuyor</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sizes.md,
  },
  title: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.md,
  },
  scheduleCard: {
    marginBottom: sizes.md,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleInfo: {
    flex: 1,
  },
  advertiserName: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  scheduleDetails: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  dateRange: {
    fontSize: sizes.fontSize.xs,
    color: colors.textLight,
  },
  scheduleActions: {
    alignItems: 'flex-end',
    gap: sizes.xs,
  },
  statusBadge: {
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.sm,
  },
  activeBadge: {
    backgroundColor: colors.success + '20',
  },
  inactiveBadge: {
    backgroundColor: colors.error + '20',
  },
  statusText: {
    fontSize: sizes.fontSize.xs,
    fontWeight: '600',
  },
  activeText: {
    color: colors.success,
  },
  inactiveText: {
    color: colors.error,
  },
  deleteButton: {
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    backgroundColor: colors.error + '20',
    borderRadius: sizes.borderRadius.sm,
  },
  deleteText: {
    fontSize: sizes.fontSize.xs,
    color: colors.error,
    fontWeight: '600',
  },
  googleAdsBadge: {
    marginTop: sizes.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    backgroundColor: colors.primary + '20',
    borderRadius: sizes.borderRadius.sm,
  },
  googleAdsText: {
    fontSize: sizes.fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: sizes.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
});


