import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdPlayer } from './AdPlayer';
import { colors, sizes } from '@/constants';
import { Ad } from '@/types/ad';
import { useAds } from '@/hooks/useAds';
import { useRaffleStore } from '@/store/raffleStore';
import { useSprintStore } from '@/store/sprintStore';

interface AdQueueProps {
  onQueueComplete?: (totalTicketsEarned: number) => void;
}

export const AdQueue: React.FC<AdQueueProps> = ({ onQueueComplete }) => {
  const { getNextAd, recordAdView } = useAds();
  const { currentSprint } = useSprintStore();
  const { myMultiplier, incrementTickets } = useRaffleStore();
  
  const [queue, setQueue] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalTicketsEarned, setTotalTicketsEarned] = useState(0);
  const [viewedAds, setViewedAds] = useState<Set<string>>(new Set());

  // Load initial queue
  useEffect(() => {
    loadQueue();
  }, [currentSprint]);

  const loadQueue = async () => {
    if (!currentSprint) return;
    
    setIsLoading(true);
    try {
      const ads: Ad[] = [];
      // Load 5 ads for the queue
      for (let i = 0; i < 5; i++) {
        const result = await getNextAd(currentSprint.id);
        if (result.success && result.data) {
          ads.push(result.data);
        }
      }
      setQueue(ads);
      setCurrentAdIndex(0);
    } catch (error) {
      console.error('Error loading queue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdFinished = async (ad: Ad, viewDuration: number) => {
    // Record the view
    const result = await recordAdView(ad.id, viewDuration);
    
    if (result.success && result.raffleTicketEarned) {
      const ticketsEarned = Math.floor(1 * myMultiplier);
      incrementTickets(ticketsEarned);
      setTotalTicketsEarned(prev => prev + ticketsEarned);
      setViewedAds(prev => new Set([...prev, ad.id]));
    }

    // Move to next ad
    if (currentAdIndex < queue.length - 1) {
      setCurrentAdIndex(prev => prev + 1);
    } else {
      // Queue complete
      if (onQueueComplete) {
        onQueueComplete(totalTicketsEarned + (result.success ? Math.floor(1 * myMultiplier) : 0));
      }
      // Reload queue for next batch
      await loadQueue();
    }
  };

  const handleAdSkipped = () => {
    // Move to next ad even if skipped
    if (currentAdIndex < queue.length - 1) {
      setCurrentAdIndex(prev => prev + 1);
    } else {
      loadQueue();
    }
  };

  const skipToNext = () => {
    if (currentAdIndex < queue.length - 1) {
      setCurrentAdIndex(prev => prev + 1);
    }
  };

  if (isLoading && queue.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Reklamlar yükleniyor...</Text>
      </View>
    );
  }

  if (queue.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz reklam bulunmuyor</Text>
        <Button variant="primary" onPress={loadQueue} style={styles.retryButton}>
          Tekrar Dene
        </Button>
      </View>
    );
  }

  const currentAd = queue[currentAdIndex];
  const remainingAds = queue.length - currentAdIndex - 1;
  const progress = ((currentAdIndex + 1) / queue.length) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.header}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.progressText}>
            {currentAdIndex + 1} / {queue.length}
          </Text>
          <Text style={styles.remainingText}>
            {remainingAds} reklam kaldı
          </Text>
        </View>
      </View>

      {/* Total Earnings Preview */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Toplam Kazanç</Text>
            <Text style={styles.summaryValue}>
              {totalTicketsEarned} bilet
            </Text>
          </View>
          <View>
            <Text style={styles.summaryLabel}>Tahmini Toplam</Text>
            <Text style={styles.summaryValue}>
              {totalTicketsEarned + (remainingAds * Math.floor(1 * myMultiplier))} bilet
            </Text>
          </View>
        </View>
      </Card>

      {/* Current Ad */}
      <AdPlayer
        ad={currentAd}
        onAdFinished={() => handleAdFinished(currentAd, currentAd.duration)}
        onAdSkipped={handleAdSkipped}
        minViewDuration={15}
      />

      {/* Queue Preview */}
      {remainingAds > 0 && (
        <Card style={styles.queueCard}>
          <Text style={styles.queueTitle}>Sıradaki Reklamlar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {queue.slice(currentAdIndex + 1).map((ad, index) => (
              <View key={ad.id} style={styles.queueItem}>
                <View style={styles.queueItemPlaceholder}>
                  <Text style={styles.queueItemNumber}>
                    {currentAdIndex + 2 + index}
                  </Text>
                </View>
                <Text style={styles.queueItemTitle} numberOfLines={1}>
                  {ad.title}
                </Text>
                <Text style={styles.queueItemDuration}>
                  {ad.duration}s
                </Text>
              </View>
            ))}
          </ScrollView>
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {remainingAds > 0 && (
          <Button
            variant="outlined"
            onPress={skipToNext}
            style={styles.skipButton}
          >
            Sonrakine Geç
          </Button>
        )}
        <Button
          variant="outlined"
          onPress={loadQueue}
          style={styles.reloadButton}
        >
          Yeni Kuyruk Yükle
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: sizes.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: sizes.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    marginBottom: sizes.md,
  },
  retryButton: {
    marginTop: sizes.sm,
  },
  header: {
    padding: sizes.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: sizes.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  remainingText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  summaryCard: {
    margin: sizes.md,
    marginBottom: sizes.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: sizes.md,
  },
  summaryLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  summaryValue: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  queueCard: {
    margin: sizes.md,
    marginTop: sizes.sm,
  },
  queueTitle: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  queueItem: {
    width: 100,
    marginRight: sizes.sm,
    alignItems: 'center',
  },
  queueItemPlaceholder: {
    width: 100,
    height: 60,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  queueItemNumber: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  queueItemTitle: {
    fontSize: sizes.fontSize.xs,
    color: colors.text,
    textAlign: 'center',
    marginBottom: sizes.xs,
  },
  queueItemDuration: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: sizes.md,
    gap: sizes.sm,
  },
  skipButton: {
    flex: 1,
  },
  reloadButton: {
    flex: 1,
  },
});


