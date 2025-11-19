import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';

export interface RewardThreshold {
  id: string;
  viewCount: number;
  rewards: RewardItem[];
  isReached: boolean;
}

export interface RewardItem {
  name: string;
  quantity: number;
  icon?: string;
}

interface RewardThresholdsProps {
  currentViews: number;
  thresholds: RewardThreshold[];
}

export const RewardThresholds: React.FC<RewardThresholdsProps> = ({
  currentViews,
  thresholds,
}) => {
  const sortedThresholds = [...thresholds].sort((a, b) => a.viewCount - b.viewCount);
  const nextThreshold = sortedThresholds.find(t => !t.isReached && t.viewCount > currentViews);
  const reachedThresholds = sortedThresholds.filter(t => t.isReached || t.viewCount <= currentViews);

  const getProgress = (threshold: RewardThreshold) => {
    const previous = sortedThresholds
      .filter(t => t.viewCount < threshold.viewCount)
      .sort((a, b) => b.viewCount - a.viewCount)[0];
    
    const previousCount = previous ? previous.viewCount : 0;
    const range = threshold.viewCount - previousCount;
    const currentProgress = currentViews - previousCount;
    
    return Math.min(100, Math.max(0, (currentProgress / range) * 100));
  };

  const getTierColor = (index: number) => {
    const colors = [
      ['#4CAF50', '#81C784'], // Green
      ['#2196F3', '#64B5F6'], // Blue
      ['#FF9800', '#FFB74D'], // Orange
      ['#E91E63', '#F06292'], // Pink
      ['#9C27B0', '#BA68C8'], // Purple
    ];
    return colors[Math.min(index, colors.length - 1)];
  };

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="gift" size={24} color={colors.primary} />
          <Text style={styles.title}>Ödül Eşikleri</Text>
        </View>
        <Text style={styles.subtitle}>
          Toplam izlenme sayısına göre ödüller dağıtılacak
        </Text>

        <View style={styles.thresholdsList}>
          {sortedThresholds.map((threshold, index) => {
            const isReached = threshold.isReached || threshold.viewCount <= currentViews;
            const isNext = threshold.id === nextThreshold?.id;
            const progress = getProgress(threshold);
            const tierColors = getTierColor(index);
            const remaining = Math.max(0, threshold.viewCount - currentViews);

            return (
              <View
                key={threshold.id}
                style={[
                  styles.thresholdItem,
                  isReached && styles.thresholdItemReached,
                  isNext && styles.thresholdItemNext,
                ]}
              >
                <View style={styles.thresholdHeader}>
                  <View style={styles.thresholdInfo}>
                    <View style={styles.viewCountContainer}>
                      <Text style={styles.viewCountLabel}>İzlenme Hedefi</Text>
                      <Text style={styles.viewCountValue}>
                        {threshold.viewCount.toLocaleString()}
                      </Text>
                    </View>
                    {isReached ? (
                      <View style={styles.reachedBadge}>
                        <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                        <Text style={styles.reachedText}>Aşıldı</Text>
                      </View>
                    ) : (
                      <View style={styles.remainingContainer}>
                        <Text style={styles.remainingText}>
                          {remaining.toLocaleString()} kaldı
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Progress Bar */}
                {!isReached && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarContainer}>
                      <LinearGradient
                        colors={tierColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBar, { width: `${progress}%` }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                  </View>
                )}

                {/* Rewards List */}
                <View style={styles.rewardsContainer}>
                  <Text style={styles.rewardsLabel}>Dağıtılacak Ödüller:</Text>
                  <View style={styles.rewardsList}>
                    {threshold.rewards.map((reward, rewardIndex) => (
                      <View key={rewardIndex} style={styles.rewardItem}>
                        {reward.icon ? (
                          <MaterialCommunityIcons
                            name={reward.icon as any}
                            size={20}
                            color={isReached ? colors.success : colors.primary}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="gift"
                            size={20}
                            color={isReached ? colors.success : colors.primary}
                          />
                        )}
                        <Text
                          style={[
                            styles.rewardText,
                            isReached && styles.rewardTextReached,
                          ]}
                        >
                          {reward.quantity}x {reward.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {reachedThresholds.length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>
              ✅ {reachedThresholds.length} eşik aşıldı!
            </Text>
            <Text style={styles.summaryText}>
              Toplam {currentViews.toLocaleString()} izlenme ile ödüller dağıtılacak.
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: sizes.md,
  },
  container: {
    padding: sizes.md,
    gap: sizes.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.sm,
    marginBottom: sizes.xs,
  },
  title: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.sm,
  },
  thresholdsList: {
    gap: sizes.md,
  },
  thresholdItem: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
    padding: sizes.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  thresholdItemReached: {
    backgroundColor: colors.success + '15',
    borderColor: colors.success,
  },
  thresholdItemNext: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primary + '10',
  },
  thresholdHeader: {
    marginBottom: sizes.sm,
  },
  thresholdInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewCountContainer: {
    flex: 1,
  },
  viewCountLabel: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: sizes.xs / 2,
  },
  viewCountValue: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  reachedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
    backgroundColor: colors.success + '20',
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.sm,
  },
  reachedText: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.success,
  },
  remainingContainer: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.sm,
  },
  remainingText: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.sm,
    marginBottom: sizes.sm,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: sizes.fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  rewardsContainer: {
    marginTop: sizes.sm,
    paddingTop: sizes.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rewardsLabel: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  rewardsList: {
    gap: sizes.xs,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
  },
  rewardText: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  rewardTextReached: {
    color: colors.success,
    fontWeight: '600',
  },
  summaryContainer: {
    marginTop: sizes.sm,
    padding: sizes.md,
    backgroundColor: colors.success + '15',
    borderRadius: sizes.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  summaryTitle: {
    fontSize: sizes.fontSize.md,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: sizes.xs,
  },
  summaryText: {
    fontSize: sizes.fontSize.sm,
    color: colors.text,
  },
});


