import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader } from '@/components/ui/Card';
import { TicketCounter } from '@/components/raffle/TicketCounter';
import { CategoryWinnerCard } from '@/components/raffle/CategoryWinnerCard';
import { CategorySprintCard } from '@/components/raffle/CategorySprintCard';
import { colors, sizes } from '@/constants';
import { useRaffleStore } from '@/store/raffleStore';
import { RaffleStatus, Winner } from '@/types/raffle';
import { Sprint, SprintStatus } from '@/types/sprint';
import { formatDate, formatCurrency } from '@/utils';

// Mock data - will be replaced with API calls
const getMockWinnersByCategory = () => {
  const now = new Date();
  return {
    Kozmetik: [
      {
        userName: 'Ayşe Yılmaz',
        prizeName: 'Premium Kozmetik Seti',
        prizeValue: 2500,
        announcedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userName: 'Zeynep Demir',
        prizeName: 'Parfüm Koleksiyonu',
        prizeValue: 1800,
        announcedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userName: 'Elif Kaya',
        prizeName: 'Makyaj Seti',
        prizeValue: 1200,
        announcedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    Teknoloji: [
      {
        userName: 'Mehmet Öz',
        prizeName: 'iPhone 15 Pro',
        prizeValue: 45000,
        announcedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userName: 'Ali Çelik',
        prizeName: 'MacBook Air',
        prizeValue: 35000,
        announcedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userName: 'Can Arslan',
        prizeName: 'AirPods Pro',
        prizeValue: 8000,
        announcedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    Moda: [
      {
        userName: 'Selin Aydın',
        prizeName: 'Tasarımcı Çanta',
        prizeValue: 5000,
        announcedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userName: 'Deniz Şahin',
        prizeName: 'Lüks Saat',
        prizeValue: 12000,
        announcedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    Spor: [
      {
        userName: 'Burak Yıldız',
        prizeName: 'Fitness Ekipman Seti',
        prizeValue: 6000,
        announcedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userName: 'Emre Doğan',
        prizeName: 'Spor Ayakkabı',
        prizeValue: 2500,
        announcedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };
};

const getMockUpcomingSprints = (): Sprint[] => {
  const now = new Date();
  return [
    {
      id: '1',
      dayOfWeek: 1,
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      category: 'Kozmetik',
      status: SprintStatus.UPCOMING,
      startDate: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      activeAds: [],
      totalViews: 0,
      totalParticipants: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '2',
      dayOfWeek: 2,
      startTime: '16:00',
      endTime: '17:00',
      duration: 60,
      category: 'Teknoloji',
      status: SprintStatus.UPCOMING,
      startDate: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
      activeAds: [],
      totalViews: 0,
      totalParticipants: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '3',
      dayOfWeek: 3,
      startTime: '18:00',
      endTime: '19:00',
      duration: 60,
      category: 'Moda',
      status: SprintStatus.UPCOMING,
      startDate: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString(),
      activeAds: [],
      totalViews: 0,
      totalParticipants: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '4',
      dayOfWeek: 4,
      startTime: '20:00',
      endTime: '21:00',
      duration: 60,
      category: 'Spor',
      status: SprintStatus.UPCOMING,
      startDate: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString(),
      activeAds: [],
      totalViews: 0,
      totalParticipants: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

import { SprintTimer } from '@/components/raffle/SprintTimer';

// ... existing imports ...

export default function RaffleScreen() {
  const { myTickets, myMultiplier, activeRaffles, winners } = useRaffleStore();
  const [winnersByCategory, setWinnersByCategory] = useState<Record<string, any[]>>({});
  const [upcomingSprints, setUpcomingSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    // Mock data - will be replaced with API calls
    setWinnersByCategory(getMockWinnersByCategory());
    setUpcomingSprints(getMockUpcomingSprints());
  }, []);

  // Find the next upcoming sprint for the countdown
  const nextSprint = upcomingSprints.find(s => s.status === SprintStatus.UPCOMING);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Çekiliş</Text>
          <Text style={styles.subtitle}>
            Çekiliş sonuçları ve ödüller
          </Text>
        </View>

        {/* Live Countdown for Next Sprint */}
        {nextSprint && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sıradaki Sprint</Text>
            <SprintTimer sprint={nextSprint} />
          </View>
        )}

        <TicketCounter
          tickets={myTickets}
          multiplier={myMultiplier}
          adViews={Math.floor(myTickets / myMultiplier)}
        />

        {/* Yaklaşan Sprintler - Kategorilere göre */}
        {upcomingSprints.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yaklaşan Sprintler</Text>
            {upcomingSprints.map((sprint) => (
              <CategorySprintCard key={sprint.id} sprint={sprint} />
            ))}
          </View>
        )}

        {/* Son Kazananlar - Kategorilere göre */}
        {Object.keys(winnersByCategory).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Son Kazananlar</Text>
            {Object.entries(winnersByCategory).map(([category, categoryWinners]) => (
              <CategoryWinnerCard
                key={category}
                category={category}
                winners={categoryWinners}
              />
            ))}
          </View>
        )}

        {activeRaffles.length > 0 && (
          <Card style={styles.card}>
            <CardHeader title="Aktif Çekilişler" />
            {activeRaffles.map((raffle) => (
              <View key={raffle.id} style={styles.raffleItem}>
                <View style={styles.prizeContainer}>
                  <Text style={styles.prizeName}>{raffle.prize.name}</Text>
                  <Text style={styles.prizeValue}>
                    {formatCurrency(raffle.prize.value)}
                  </Text>
                  <Text style={styles.prizeDescription}>
                    {raffle.prize.description}
                  </Text>
                </View>

                <View style={styles.raffleInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Durum:</Text>
                    <Text style={styles.infoValue}>
                      {raffle.status === RaffleStatus.PENDING && 'Beklemede'}
                      {raffle.status === RaffleStatus.ACTIVE && 'Aktif'}
                      {raffle.status === RaffleStatus.COMPLETED && 'Tamamlandı'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Katılımcı:</Text>
                    <Text style={styles.infoValue}>
                      {raffle.totalParticipants} kişi
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Toplam Bilet:</Text>
                    <Text style={styles.infoValue}>
                      {raffle.totalTickets}
                    </Text>
                  </View>
                  {raffle.drawDate && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Çekiliş Tarihi:</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(raffle.drawDate)} {raffle.drawTime}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}

        {winners.length > 0 && (
          <Card style={styles.card}>
            <CardHeader title="Kazananlar" />
            {winners.map((winner, index) => (
              <View key={index} style={styles.winnerItem}>
                <View style={styles.winnerHeader}>
                  <Text style={styles.winnerName}>🎉 {winner.userName}</Text>
                  <Text style={styles.winnerTickets}>
                    {winner.ticketCount} bilet
                  </Text>
                </View>
                <Text style={styles.winnerPrize}>
                  {winner.prize.name}
                </Text>
                <Text style={styles.winnerDate}>
                  {formatDate(winner.announcedAt)}
                </Text>
              </View>
            ))}
          </Card>
        )}

        {activeRaffles.length === 0 && winners.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Henüz aktif çekiliş bulunmuyor
            </Text>
            <Text style={styles.emptySubtext}>
              Sprint sona erdiğinde çekilişler burada görünecek
            </Text>
          </View>
        )}

        <Card style={styles.card}>
          <CardHeader title="Çekiliş Kuralları" />
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesText}>
              • Her reklam izleme 1 çekiliş hakkı verir{'\n'}
              • Çarpanınıza göre haklarınız artar{'\n'}
              • Kazananlar 15 dakika sonra açıklanır{'\n'}
              • Çekilişler noter huzurunda yapılır{'\n'}
              • Kazananlar adres bilgilerine göre ödül alır
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
  },
  card: {
    marginBottom: sizes.md,
  },
  raffleItem: {
    paddingVertical: sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  prizeContainer: {
    marginBottom: sizes.md,
  },
  prizeName: {
    fontSize: sizes.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  prizeValue: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: sizes.xs,
  },
  prizeDescription: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  raffleInfo: {
    gap: sizes.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: sizes.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  winnerItem: {
    paddingVertical: sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  winnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  winnerName: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  winnerTickets: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  winnerPrize: {
    fontSize: sizes.fontSize.md,
    color: colors.primary,
    marginBottom: sizes.xs,
  },
  winnerDate: {
    fontSize: sizes.fontSize.xs,
    color: colors.textLight,
  },
  emptyContainer: {
    padding: sizes.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rulesContainer: {
    paddingVertical: sizes.sm,
  },
  rulesText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: sizes.lg,
  },
  sectionTitle: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.md,
  },
});
