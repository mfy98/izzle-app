import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader } from '@/components/ui/Card';
import { SprintTimer } from '@/components/raffle/SprintTimer';
import { AdBanner, MultiBannerAds } from '@/components/ads';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { FadeInView, SlideInView } from '@/components/ui';
import { WeeklySponsor, DailySponsor, MonthlySponsor, SponsorInfoCard } from '@/components/home';
import { GamesSection } from '@/components/games/GamesSection';
import { colors, sizes } from '@/constants';
import { useRaffleStore } from '@/store/raffleStore';
import { useSprint } from '@/hooks/useSprint';
import { useAds } from '@/hooks/useAds';
import { Ad } from '@/types/ad';
import { router } from 'expo-router';

type SponsorSlide =
  | {
      id: string;
      component: 'sponsor';
      sponsorName: string;
      sponsorDescription: string;
    }
  | {
      id: string;
      component: 'info';
      title: string;
      subtitle: string;
      highlights: string[];
      gradient: [string, string, string];
    };

const MONTHLY_SLIDES: SponsorSlide[] = [
  {
    id: 'monthly-main',
    component: 'sponsor',
    sponsorName: 'MegaCorp',
    sponsorDescription: 'Aylık sponsorluk - 500.000 ₺ teklif ile en üst seviye sponsorluk',
  },
  {
    id: 'monthly-info',
    component: 'info',
    title: 'MegaCorp Premium Kampanyası',
    subtitle: 'Aylık sponsorluğun avantajları',
    highlights: [
      'Aylık toplam ödül havuzunu %30 artırır',
      'MegaCorp kullanıcılarına özel sürpriz ödüller',
      'Her hafta ekstra çekiliş hakkı dağıtır',
    ],
    gradient: ['#10B981', '#059669', '#047857'],
  },
];

const WEEKLY_SLIDES: SponsorSlide[] = [
  {
    id: 'weekly-main',
    component: 'sponsor',
    sponsorName: 'GlobalBrand',
    sponsorDescription: 'Haftalık sponsorluk - 150.000 ₺ teklif ile premium deneyim',
  },
  {
    id: 'weekly-info',
    component: 'info',
    title: 'GlobalBrand Haftalık Özet',
    subtitle: 'Haftalık sponsorluğun sundukları',
    highlights: [
      'Her gün 2 özel reklam yayını',
      'Haftalık çekilişte 5 ekstra kazanan',
      'İzleyenlere anında bonus puan',
    ],
    gradient: ['#6366F1', '#8B5CF6', '#A855F7'],
  },
];

const DAILY_SLIDES: SponsorSlide[] = [
  {
    id: 'daily-main',
    component: 'sponsor',
    sponsorName: 'TechCorp',
    sponsorDescription: 'Günlük sponsorluk - 25.000 ₺ teklif ile özel fırsatlar',
  },
  {
    id: 'daily-info',
    component: 'info',
    title: 'TechCorp Günlük Fırsat',
    subtitle: 'Bugüne özel kampanyalar',
    highlights: [
      'Saatlik mini görevlerle bonus kazan',
      'TechCorp ürünlerinde %10 indirim',
      'İlk 100 izleyiciye ekstra hak',
    ],
    gradient: ['#F59E0B', '#F97316', '#EF4444'],
  },
];

export default function HomeScreen() {
  const { myTickets, myMultiplier } = useRaffleStore();
  const { currentSprint, fetchCurrentSprint } = useSprint();
  const { getBannerAds } = useAds();
  const [bannerAds, setBannerAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlySlideIndex, setMonthlySlideIndex] = useState(0);
  const [weeklySlideIndex, setWeeklySlideIndex] = useState(0);
  const [dailySlideIndex, setDailySlideIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load sprint data
      await fetchCurrentSprint();
      
      // Load banner ads
      const bannerResult = await getBannerAds();
      if (bannerResult.success && bannerResult.data) {
        setBannerAds(bannerResult.data);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [fetchCurrentSprint, getBannerAds]);

  // Monthly carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setMonthlySlideIndex((prev) => (prev + 1) % MONTHLY_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Weekly carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setWeeklySlideIndex((prev) => (prev + 1) % WEEKLY_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Daily carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setDailySlideIndex((prev) => (prev + 1) % DAILY_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderMonthlySlide = () => {
    const slide = MONTHLY_SLIDES[monthlySlideIndex];
    if (slide.component === 'sponsor') {
      return (
        <MonthlySponsor
          sponsorName={slide.sponsorName}
          sponsorDescription={slide.sponsorDescription}
          onPress={() => console.log('Monthly sponsor pressed')}
        />
      );
    }
    return (
      <SponsorInfoCard
        title={slide.title}
        subtitle={slide.subtitle}
        highlights={slide.highlights}
        gradient={slide.gradient}
      />
    );
  };

  const renderWeeklySlide = () => {
    const slide = WEEKLY_SLIDES[weeklySlideIndex];
    if (slide.component === 'sponsor') {
      return (
        <WeeklySponsor
          sponsorName={slide.sponsorName}
          sponsorDescription={slide.sponsorDescription}
          onPress={() => console.log('Weekly sponsor pressed')}
        />
      );
    }
    return (
      <SponsorInfoCard
        title={slide.title}
        subtitle={slide.subtitle}
        highlights={slide.highlights}
        gradient={slide.gradient}
      />
    );
  };

  const renderDailySlide = () => {
    const slide = DAILY_SLIDES[dailySlideIndex];
    if (slide.component === 'sponsor') {
      return (
        <DailySponsor
          sponsorName={slide.sponsorName}
          sponsorDescription={slide.sponsorDescription}
          onPress={() => console.log('Daily sponsor pressed')}
        />
      );
    }
    return (
      <SponsorInfoCard
        title={slide.title}
        subtitle={slide.subtitle}
        highlights={slide.highlights}
        gradient={slide.gradient}
      />
    );
  };

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

        {/* Monthly Sponsor Carousel */}
        <FadeInView key={`monthly-${monthlySlideIndex}`} duration={500}>
          {renderMonthlySlide()}
        </FadeInView>

        {/* Weekly Sponsor Carousel */}
        <FadeInView key={`weekly-${weeklySlideIndex}`} duration={500} delay={100}>
          {renderWeeklySlide()}
        </FadeInView>

        {/* Daily Sponsor Carousel */}
        <FadeInView key={`daily-${dailySlideIndex}`} duration={500} delay={200}>
          {renderDailySlide()}
        </FadeInView>

        {currentSprint && (
          <SlideInView direction="up" duration={400} delay={100}>
            <SprintTimer sprint={currentSprint} />
          </SlideInView>
        )}

        {bannerAds.length > 0 && (
          <FadeInView duration={400} delay={300}>
            <MultiBannerAds 
              ads={bannerAds} 
              onAdPress={(ad: Ad) => {
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
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>İzlenen Reklam</Text>
                <Text style={styles.statValue}>42</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Kazanılan Ödül</Text>
                <Text style={styles.statValue}>3</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Toplam Puan</Text>
                <Text style={styles.statValue}>1.250</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Sıralama</Text>
                <Text style={styles.statValue}>#127</Text>
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

        <FadeInView duration={500} delay={400}>
          <GamesSection />
        </FadeInView>

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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: sizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: sizes.sm,
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
