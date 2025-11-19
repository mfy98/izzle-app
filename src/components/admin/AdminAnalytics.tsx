import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';
import { apiClient } from '@/services/api/client';
import { formatNumber } from '@/utils/formatting';

interface AdminMetrics {
  totalAdvertisers: number;
  totalImpressions: number;
  impressionsBySprint: { sprintId: string; sprintName: string; count: number }[];
  // Add more as needed
}

export const AdminAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      // In a real app: const response = await apiClient.get('/admin/analytics');
      // setMetrics(response.data);
      
      // Mocking data based on user request (empty if no data)
      // For demonstration, let's simulate data after a timeout
      await new Promise(r => setTimeout(r, 1000));
      
      setMetrics({
        totalAdvertisers: 12,
        totalImpressions: 15430,
        impressionsBySprint: [
          { sprintId: '1', sprintName: 'Sprint #1', count: 5000 },
          { sprintId: '2', sprintName: 'Sprint #2', count: 7500 },
          { sprintId: '3', sprintName: 'Sprint #3', count: 2930 },
        ]
      });
    } catch (error) {
      console.error('Failed to load admin analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Yükleniyor...</Text>;
  }

  if (!metrics) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz veri bulunmuyor.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Toplam Reklam Veren</Text>
          <Text style={styles.statValue}>{formatNumber(metrics.totalAdvertisers)}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Toplam Gösterim</Text>
          <Text style={styles.statValue}>{formatNumber(metrics.totalImpressions)}</Text>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Sprint Bazlı Gösterimler</Text>
        {metrics.impressionsBySprint.length === 0 ? (
          <View style={styles.emptyChart}>
            <Text>Grafik verisi yok</Text>
          </View>
        ) : (
          <View style={styles.chartContainer}>
            {/* Simple Bar Chart Visualization */}
            {metrics.impressionsBySprint.map((item, index) => {
              const max = Math.max(...metrics.impressionsBySprint.map(i => i.count));
              const height = (item.count / max) * 150; // Max height 150
              return (
                <View key={item.sprintId} style={styles.barContainer}>
                  <View style={[styles.bar, { height }]} />
                  <Text style={styles.barLabel}>{item.sprintName}</Text>
                  <Text style={styles.barValue}>{formatNumber(item.count)}</Text>
                </View>
              );
            })}
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: sizes.md,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: sizes.fontSize.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: sizes.md,
    marginBottom: sizes.md,
  },
  statCard: {
    flex: 1,
    padding: sizes.md,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  chartCard: {
    padding: sizes.md,
  },
  chartTitle: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    marginBottom: sizes.lg,
    color: colors.text,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingBottom: sizes.sm,
  },
  emptyChart: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
  },
  barContainer: {
    alignItems: 'center',
    width: 60,
  },
  bar: {
    width: 30,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
});

