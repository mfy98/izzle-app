import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader } from '@/components/ui/Card';
import { TicketCounter } from '@/components/raffle/TicketCounter';
import { colors, sizes } from '@/constants';
import { useRaffleStore } from '@/store/raffleStore';
import { RaffleStatus } from '@/types/raffle';
import { formatDate, formatCurrency } from '@/utils';

// Mock raffle data - will be replaced with API call
const mockRaffle = {
  id: '1',
  sprintId: '1',
  prize: {
    id: '1',
    name: 'Premium Kozmetik Seti',
    description: 'Lüks marka kozmetik ürünleri',
    category: 'Kozmetik',
    value: 2500,
    imageUrl: undefined,
    sponsor: 'Örnek Sponsor',
  },
  status: RaffleStatus.PENDING,
  totalParticipants: 150,
  totalTickets: 500,
  winners: undefined,
  drawDate: new Date().toISOString(),
  drawTime: '18:15',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function RaffleScreen() {
  const { myTickets, myMultiplier, activeRaffles, winners } = useRaffleStore();

  useEffect(() => {
    // Mock data - will be replaced with API call
    useRaffleStore.getState().setActiveRaffles([mockRaffle as any]);
  }, []);

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

        <TicketCounter
          tickets={myTickets}
          multiplier={myMultiplier}
          adViews={Math.floor(myTickets / myMultiplier)}
        />

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
});
