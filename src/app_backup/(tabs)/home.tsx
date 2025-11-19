import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader } from '@/components/ui/Card';
import { SprintTimer } from '@/components/raffle/SprintTimer';
import { AdCover } from '@/components/ads/AdCover';
import { AdBanner, MultiBannerAds } from '@/components/ads';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { FadeInView, SlideInView } from '@/components/ui';
import { colors, sizes } from '@/constants';
import { useRaffleStore } from '@/store/raffleStore';
import { useSprint } from '@/hooks/useSprint';
import { useAds } from '@/hooks/useAds';
import { Ad } from '@/types/ad';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { myTickets, myMultiplier } = useRaffleStore();
  const { currentSprint, fetchCurrentSprint } = useSprint();
  const { getCoverAd, getBannerAds } = useAds();
  const [coverAd, setCoverAd] = useState<Ad | null>(null);
  const [bannerAds, setBannerAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load sprint data
      await fetchCurrentSprint();
      
      // Load cover ad
      const coverResult = await getCoverAd();
      if (coverResult.success && coverResult.data) {
        setCoverAd(coverResult.data);
      }
      
      // Load banner ads
      const bannerResult = await getBannerAds();
      if (bannerResult.success && bannerResult.data) {
        setBannerAds(bannerResult.data);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [fetchCurrentSprint, getCoverAd, getBannerAds]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Hoş Geldiniz!</Text>
          </View>
          <SkeletonCard lines={2} />
          <SkeletonCard lines={3} />
          <SkeletonCard lines={2} />
        </ScrollView>
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
          <Text style={styles.title}>Hoş Geldiniz!</Text>
          <Text style={styles.subtitle}>
            Reklam izle, çekiliş hakkı kazan, ödülleri kap!
          </Text>
        </View>

        {coverAd && (
          <FadeInView duration={500}>
            <AdCover ad={coverAd} />
          </FadeInView>
        )}

        {currentSprint && (
          <SlideInView direction="up" duration={400} delay={100}>
            <SprintTimer sprint={currentSprint} />
          </SlideInView>
        )}

        {bannerAds.length > 0 && (
          <FadeInView duration={400} delay={300}>
            <MultiBannerAds 
              ads={bannerAds} 
              onAdPress={(ad) => {
                // Handle banner ad press - could navigate to advertiser page or ad details
                console.log('Banner ad pressed:', ad.id);
              }}
            />
          </FadeInView>
        )}

        <SlideInView direction="up" duration={400} delay={200}>
          <Card style={styles.card}>
            <CardHeader title="İstatistikleriniz" />
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Çekiliş Haklarınız</Text>
                <Text style={styles.statValue}>{myTickets}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Çarpanınız</Text>
                <Text style={styles.statValue}>x{myMultiplier.toFixed(2)}</Text>
              </View>
            </View>
          </Card>
        </SlideInView>

        <Card style={styles.card}>
          <CardHeader title="Hızlı İşlemler" />
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/watch')}
          >
            <Text style={styles.quickActionText}>
              🎬 Reklam İzlemeye Başla
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/raffle')}
          >
            <Text style={styles.quickActionText}>
              🎁 Çekiliş Sonuçlarını Gör
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <CardHeader title="Nasıl Çalışır?" />
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              1. Sprint saatinde reklam izle{'\n'}
              2. Her reklam için çekiliş hakkı kazan{'\n'}
              3. Çarpan sistemine göre hakların artar{'\n'}
              4. Sprint bitince çekiliş yapılır{'\n'}
              5. Kazananlar 15 dakika sonra açıklanır!
            </Text>
          </View>
        </Card>
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
    lineHeight: 24,
  },
  bannerContainer: {
    marginBottom: sizes.md,
  },
  card: {
    marginBottom: sizes.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: sizes.md,
  },
  statItem: {
    alignItems: 'center',
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
  quickAction: {
    backgroundColor: colors.surfaceVariant,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    marginBottom: sizes.sm,
  },
  quickActionText: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  infoContainer: {
    paddingVertical: sizes.sm,
  },
  infoText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
