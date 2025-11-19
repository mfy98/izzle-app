import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';
import { formatCountdown, getDayName } from '@/utils';
import { Sprint, SprintStatus } from '@/types/sprint';
import { useSprintStore } from '@/store/sprintStore';

import { useServerTime } from '@/hooks/useServerTime';

interface SprintTimerProps {
  sprint: Sprint;
}

export const SprintTimer: React.FC<SprintTimerProps> = ({ sprint }) => {
  const serverTime = useServerTime();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = serverTime;
      const startDate = new Date(sprint.startDate);
      const endDate = new Date(sprint.endDate);

      if (sprint.status === SprintStatus.ACTIVE && now < endDate) {
        const remaining = endDate.getTime() - now.getTime();
        setTimeRemaining(remaining);
        setIsActive(true);
      } else if (sprint.status === SprintStatus.UPCOMING && now < startDate) {
        const remaining = startDate.getTime() - now.getTime();
        setTimeRemaining(remaining);
        setIsActive(false);
      } else {
        setTimeRemaining(0);
        setIsActive(false);
      }
    };

    updateTimer();
    // Interval is not needed here because serverTime updates every second
    // triggering this effect
  }, [sprint, serverTime]);

  const getStatusText = () => {
    if (sprint.status === SprintStatus.ACTIVE && isActive) {
      return 'Aktif Sprint';
    } else if (sprint.status === SprintStatus.UPCOMING) {
      return 'Yaklaşan Sprint';
    } else if (sprint.status === SprintStatus.ENDED) {
      return 'Sprint Bitti';
    }
    return 'Beklemede';
  };

  const getStatusColor = () => {
    if (sprint.status === SprintStatus.ACTIVE && isActive) {
      return colors.sprintActive;
    } else if (sprint.status === SprintStatus.UPCOMING) {
      return colors.sprintUpcoming;
    }
    return colors.sprintEnded;
  };

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.dayName}>{getDayName(sprint.dayOfWeek)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>
            {isActive ? 'Kalan Süre' : 'Başlangıç'}
          </Text>
          <Text style={styles.timeValue}>
            {timeRemaining > 0 ? formatCountdown(timeRemaining) : '--:--'}
          </Text>
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleText}>
            {sprint.startTime} - {sprint.endTime}
          </Text>
          {sprint.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{sprint.category}</Text>
            </View>
          )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  dayName: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.sm,
  },
  statusText: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeContainer: {
    alignItems: 'center',
    marginVertical: sizes.md,
  },
  timeLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  timeValue: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'monospace',
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: sizes.md,
    gap: sizes.sm,
  },
  scheduleText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.sm,
  },
  categoryText: {
    fontSize: sizes.fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
});

