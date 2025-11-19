import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';
import { formatNumber, formatMultiplier } from '@/utils';

interface TicketCounterProps {
  tickets: number;
  multiplier: number;
  adViews: number;
}

export const TicketCounter: React.FC<TicketCounterProps> = ({
  tickets,
  multiplier,
  adViews,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Çekiliş Hakları</Text>
            <Text style={styles.statValue}>{formatNumber(tickets)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Çarpan</Text>
            <Text style={styles.statValue}>x{formatMultiplier(multiplier)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>İzlenen Reklam</Text>
            <Text style={styles.statValue}>{formatNumber(adViews)}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Hesaplanan</Text>
            <Text style={styles.statValue}>
              {formatNumber(Math.floor(adViews * multiplier))}
            </Text>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: sizes.sm,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  statValue: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: sizes.sm,
  },
});

