import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, CardHeader } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';

export enum BadgeType {
  FIRST_AD = 'first_ad',
  TEN_ADS = 'ten_ads',
  HUNDRED_ADS = 'hundred_ads',
  DAILY_STREAK_7 = 'daily_streak_7',
  DAILY_STREAK_30 = 'daily_streak_30',
  WEEKLY_CHAMPION = 'weekly_champion',
  MONTHLY_CHAMPION = 'monthly_champion',
  PERFECT_WEEK = 'perfect_week',
}

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeSystemProps {
  badges: Badge[];
  totalAdsWatched: number;
  currentStreak: number;
}

const badgeIcons: Record<BadgeType, string> = {
  [BadgeType.FIRST_AD]: '🎬',
  [BadgeType.TEN_ADS]: '🎯',
  [BadgeType.HUNDRED_ADS]: '🏆',
  [BadgeType.DAILY_STREAK_7]: '🔥',
  [BadgeType.DAILY_STREAK_30]: '💎',
  [BadgeType.WEEKLY_CHAMPION]: '👑',
  [BadgeType.MONTHLY_CHAMPION]: '⭐',
  [BadgeType.PERFECT_WEEK]: '✨',
};

const rarityColors: Record<Badge['rarity'], string> = {
  common: '#9E9E9E',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
};

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  badges,
  totalAdsWatched,
  currentStreak,
}) => {
  const earnedBadges = badges.filter(b => b.earned);
  const unearnedBadges = badges.filter(b => !b.earned);
  const earnedCount = earnedBadges.length;
  const totalCount = badges.length;
  const progress = (earnedCount / totalCount) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Progress Summary */}
      <Card style={styles.summaryCard}>
        <CardHeader title="Rozet İlerlemesi" />
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {earnedCount} / {totalCount} rozet kazanıldı
          </Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalAdsWatched}</Text>
            <Text style={styles.statLabel}>Toplam Reklam</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Günlük Seri</Text>
          </View>
        </View>
      </Card>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card style={styles.card}>
          <CardHeader title="Kazanılan Rozetler" />
          <View style={styles.badgesGrid}>
            {earnedBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} />
            ))}
          </View>
        </Card>
      )}

      {/* Unearned Badges */}
      {unearnedBadges.length > 0 && (
        <Card style={styles.card}>
          <CardHeader title="Kazanılacak Rozetler" />
          <View style={styles.badgesGrid}>
            {unearnedBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} />
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

interface BadgeItemProps {
  badge: Badge;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge }) => {
  const icon = badgeIcons[badge.type] || '🏅';
  const borderColor = rarityColors[badge.rarity];
  const opacity = badge.earned ? 1 : 0.5;

  return (
    <View style={[styles.badgeItem, { borderColor, opacity }]}>
      <View style={[styles.badgeIconContainer, { borderColor }]}>
        <Text style={styles.badgeIcon}>{icon}</Text>
      </View>
      <Text style={styles.badgeName} numberOfLines={1}>
        {badge.name}
      </Text>
      <Text style={styles.badgeDescription} numberOfLines={2}>
        {badge.description}
      </Text>
      {badge.earned && badge.earnedAt && (
        <Text style={styles.badgeEarnedDate}>
          {new Date(badge.earnedAt).toLocaleDateString('tr-TR')}
        </Text>
      )}
      {!badge.earned && (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockedText}>🔒</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    margin: sizes.md,
    marginBottom: sizes.sm,
  },
  progressContainer: {
    paddingVertical: sizes.sm,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: sizes.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: sizes.md,
    paddingTop: sizes.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: sizes.xs,
  },
  statLabel: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
  },
  card: {
    margin: sizes.md,
    marginTop: sizes.sm,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: sizes.md,
    paddingVertical: sizes.sm,
  },
  badgeItem: {
    width: '47%',
    padding: sizes.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    position: 'relative',
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.sm,
    borderWidth: 2,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeName: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: sizes.xs,
  },
  badgeEarnedDate: {
    fontSize: sizes.fontSize.xs,
    color: colors.primary,
    marginTop: sizes.xs,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: sizes.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 24,
  },
});


