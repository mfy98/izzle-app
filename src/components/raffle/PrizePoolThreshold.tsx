import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';
import { formatCurrency } from '@/utils/formatting';

export interface PrizeThreshold {
  id: string;
  viewCount: number;
  prizeName: string;
  prizeValue: number;
  prizeCategory: string;
  isReached: boolean;
}

interface PrizePoolThresholdProps {
  currentViews: number;
  thresholds: PrizeThreshold[];
}

export const PrizePoolThreshold: React.FC<PrizePoolThresholdProps> = ({
  currentViews,
  thresholds,
}) => {
  const [nextThreshold, setNextThreshold] = useState<PrizeThreshold | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTier, setCurrentTier] = useState(0);

  useEffect(() => {
    // Find the next unreached threshold
    const sortedThresholds = [...thresholds].sort((a, b) => a.viewCount - b.viewCount);
    const next = sortedThresholds.find(t => !t.isReached && t.viewCount > currentViews);
    
    if (next) {
      setNextThreshold(next);
      
      // Find the previous threshold for progress calculation
      const previous = sortedThresholds
        .filter(t => t.viewCount < next.viewCount)
        .sort((a, b) => b.viewCount - a.viewCount)[0];
      
      const previousCount = previous ? previous.viewCount : 0;
      const range = next.viewCount - previousCount;
      const currentProgress = currentViews - previousCount;
      const progressPercent = Math.min(100, Math.max(0, (currentProgress / range) * 100));
      
      setProgress(progressPercent);
      setCurrentTier(sortedThresholds.findIndex(t => t.id === next.id));
    } else {
      // All thresholds reached
      const lastThreshold = sortedThresholds[sortedThresholds.length - 1];
      setNextThreshold(lastThreshold);
      setProgress(100);
      setCurrentTier(sortedThresholds.length - 1);
    }
  }, [currentViews, thresholds]);

  const getTierColor = (tier: number) => {
    const colors = [
      ['#4CAF50', '#81C784'], // Green - Basic
      ['#2196F3', '#64B5F6'], // Blue - Medium
      ['#FF9800', '#FFB74D'], // Orange - Premium
      ['#E91E63', '#F06292'], // Pink - Mega
      ['#9C27B0', '#BA68C8'], // Purple - Ultimate
    ];
    return colors[Math.min(tier, colors.length - 1)];
  };

  const tierColors = nextThreshold ? getTierColor(currentTier) : ['#4CAF50', '#81C784'];
  const remaining = nextThreshold ? Math.max(0, nextThreshold.viewCount - currentViews) : 0;

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="trophy" size={24} color={colors.primary} />
            <Text style={styles.title}>Ödül Havuzu</Text>
          </View>
          <View style={styles.currentViews}>
            <Text style={styles.currentViewsText}>{currentViews.toLocaleString()}</Text>
            <Text style={styles.currentViewsLabel}>İzlenme</Text>
          </View>
        </View>

        {nextThreshold && (
          <>
            <View style={styles.nextPrizeContainer}>
              <Text style={styles.nextPrizeLabel}>Sonraki Ödül</Text>
              <Text style={styles.nextPrizeName}>{nextThreshold.prizeName}</Text>
              <Text style={styles.nextPrizeValue}>
                {formatCurrency(nextThreshold.prizeValue)}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={tierColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBar, { width: `${progress}%` }]}
                />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  {remaining > 0 ? `${remaining.toLocaleString()} izlenme kaldı` : 'Eşik aşıldı!'}
                </Text>
                <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
              </View>
            </View>

            {/* Timeline markers */}
            <View style={styles.timelineContainer}>
              {thresholds.slice(0, 5).map((threshold, index) => {
                const isReached = threshold.isReached || threshold.viewCount <= currentViews;
                const isNext = threshold.id === nextThreshold.id;
                const isPast = threshold.viewCount < currentViews;
                
                return (
                  <View key={threshold.id} style={styles.timelineItem}>
                    <View
                      style={[
                        styles.timelineDot,
                        isReached && styles.timelineDotReached,
                        isNext && styles.timelineDotNext,
                      ]}
                    />
                    {index < 4 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isPast && styles.timelineLineReached,
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.timelineLabel,
                        isReached && styles.timelineLabelReached,
                      ]}
                      numberOfLines={1}
                    >
                      {threshold.viewCount.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Reached thresholds */}
        <View style={styles.reachedContainer}>
          <Text style={styles.reachedTitle}>Aşılan Eşikler</Text>
          <View style={styles.reachedList}>
            {thresholds
              .filter(t => t.isReached || t.viewCount <= currentViews)
              .slice(-3)
              .map(threshold => (
                <View key={threshold.id} style={styles.reachedItem}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color={colors.success}
                  />
                  <Text style={styles.reachedText}>{threshold.prizeName}</Text>
                </View>
              ))}
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.sm,
  },
  title: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  currentViews: {
    alignItems: 'flex-end',
  },
  currentViewsText: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  currentViewsLabel: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
  },
  nextPrizeContainer: {
    backgroundColor: colors.surfaceVariant,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    alignItems: 'center',
  },
  nextPrizeLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  nextPrizeName: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs,
    textAlign: 'center',
  },
  nextPrizeValue: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressContainer: {
    gap: sizes.sm,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: sizes.fontSize.sm,
    fontWeight: 'bold',
    color: colors.primary,
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: sizes.sm,
    paddingHorizontal: sizes.xs,
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    marginBottom: sizes.xs,
  },
  timelineDotReached: {
    backgroundColor: colors.success,
  },
  timelineDotNext: {
    backgroundColor: colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  timelineLine: {
    position: 'absolute',
    top: 5,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: colors.border,
    zIndex: -1,
  },
  timelineLineReached: {
    backgroundColor: colors.success,
  },
  timelineLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timelineLabelReached: {
    color: colors.success,
    fontWeight: '600',
  },
  reachedContainer: {
    marginTop: sizes.sm,
    paddingTop: sizes.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reachedTitle: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: sizes.sm,
  },
  reachedList: {
    gap: sizes.xs,
  },
  reachedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
  },
  reachedText: {
    fontSize: sizes.fontSize.sm,
    color: colors.text,
  },
});


