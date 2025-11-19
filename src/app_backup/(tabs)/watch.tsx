import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SprintTimer } from '@/components/raffle/SprintTimer';
import { AnimatedTicketCounter } from '@/components/raffle/AnimatedTicketCounter';
import { AdPlayer } from '@/components/ads/AdPlayer';
import { FadeInView, SlideInView } from '@/components/ui';
import { colors, sizes } from '@/constants';
import { useRaffleStore } from '@/store/raffleStore';
import { useSprintStore } from '@/store/sprintStore';
import { SprintStatus } from '@/types/sprint';
import { Ad, AdType } from '@/types/ad';

// Mock data - will be replaced with API calls
const mockAd: Ad = {
  id: '1',
  advertiserId: '1',
  type: AdType.SPONSOR,
  title: 'Örnek Sponsor Reklamı',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  duration: 30,
  isActive: true,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
  impressionCount: 0,
  clickCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function WatchScreen() {
  const { myTickets, myMultiplier, incrementTickets } = useRaffleStore();
  const { currentSprint } = useSprintStore();
  const [adViews, setAdViews] = useState(0);
  const [canWatchAds, setCanWatchAds] = useState(false);

  React.useEffect(() => {
    // Check if sprint is active
    if (currentSprint && currentSprint.status === SprintStatus.ACTIVE) {
      const now = new Date();
      const endDate = new Date(currentSprint.endDate);
      setCanWatchAds(now < endDate);
    } else {
      setCanWatchAds(false);
    }
  }, [currentSprint]);

  const handleAdFinished = () => {
    if (!canWatchAds) {
      Alert.alert('Uyarı', 'Sprint aktif değil. Reklam izleme şu anda kapalı.');
      return;
    }

    // Calculate tickets earned with multiplier
    const ticketsEarned = Math.floor(1 * myMultiplier);
    incrementTickets(ticketsEarned);
    setAdViews(prev => prev + 1);
    
    Alert.alert('Başarılı!', `${ticketsEarned} çekiliş hakkı kazandınız!`);
  };

  const handleAdSkipped = () => {
    Alert.alert('Bilgi', 'Reklam geçildi. Çekiliş hakkı kazanılmadı.');
  };

  if (!currentSprint) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aktif sprint bulunamadı</Text>
          <Text style={styles.emptySubtext}>
            Lütfen daha sonra tekrar deneyin
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reklam İzle</Text>
          <Text style={styles.subtitle}>
            Reklam izleyerek çekiliş hakkı kazan
          </Text>
        </View>

        <SlideInView direction="up" duration={400}>
          <SprintTimer sprint={currentSprint} />
        </SlideInView>

        <FadeInView duration={500} delay={200}>
          <AnimatedTicketCounter
            tickets={myTickets}
            multiplier={myMultiplier}
            adViews={adViews}
          />
        </FadeInView>

        {!canWatchAds ? (
          <View style={styles.inactiveContainer}>
            <Text style={styles.inactiveText}>
              Sprint aktif değil. Reklam izleme şu anda kapalı.
            </Text>
            <Text style={styles.inactiveSubtext}>
              Lütfen aktif bir sprint bekleyin.
            </Text>
          </View>
        ) : (
          <AdPlayer
            ad={mockAd}
            onAdFinished={handleAdFinished}
            onAdSkipped={handleAdSkipped}
            minViewDuration={15}
          />
        )}
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
    paddingBottom: sizes.xxl,
  },
  header: {
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  subtitle: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.xl,
  },
  emptyText: {
    fontSize: sizes.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  emptySubtext: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inactiveContainer: {
    padding: sizes.xl,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.lg,
    alignItems: 'center',
  },
  inactiveText: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
    textAlign: 'center',
  },
  inactiveSubtext: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
