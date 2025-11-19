import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { colors, sizes } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { Button, Input } from '@/components/ui';
import { TimeSlot, Bid, AUCTION_CONSTANTS } from '@/types/auction';
import { formatCurrency, formatDate } from '@/utils/formatting';

// Mock Data Generator
const generateMockTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  // Generate slots for the next 3 days
  for (let i = 1; i <= 3; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate a few slots per day
    const hours = [14, 16, 20, 22]; // 20 and 22 are prime time
    hours.forEach(hour => {
      const isPrime = hour >= 19 && hour <= 23;
      slots.push({
        id: `${dateStr}-${hour}`,
        startTime: `${hour}:00`,
        endTime: `${hour + 1}:00`,
        date: dateStr,
        isPrimeTime: isPrime,
        basePrice: isPrime ? AUCTION_CONSTANTS.PRIME_TIME_BASE_PRICE : AUCTION_CONSTANTS.REGULAR_TIME_BASE_PRICE,
        minImpressionPrice: isPrime ? AUCTION_CONSTANTS.PRIME_TIME_MIN_IMPRESSION : AUCTION_CONSTANTS.REGULAR_TIME_MIN_IMPRESSION,
        status: 'OPEN',
        currentHighestBid: Math.random() > 0.5 ? {
          id: 'bid-1',
          advertiserId: 'other-adv',
          advertiserName: 'Rakip Firma A.Ş.',
          timeSlotId: `${dateStr}-${hour}`,
          basePriceOffer: isPrime ? 1050000 : 110000,
          impressionPriceOffer: isPrime ? 0.0035 : 0.0012,
          totalEstimatedValue: 0,
          timestamp: new Date().toISOString()
        } : undefined
      });
    });
  }
  return slots;
};

export default function AdvertiserAuctionScreen() {
  const { user } = useAuthStore();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidForm, setBidForm] = useState({
    basePrice: '',
    impressionPrice: ''
  });

  useEffect(() => {
    // Load mock slots
    setTimeSlots(generateMockTimeSlots());
  }, []);

  const handleBidPress = (slot: TimeSlot) => {
    // Check if auction is closed (24 hours before)
    const slotDate = new Date(`${slot.date}T${slot.startTime}:00`);
    const now = new Date();
    const hoursUntilSlot = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilSlot < AUCTION_CONSTANTS.CLOSING_HOURS_BEFORE) {
      Alert.alert('Süre Doldu', 'Bu zaman aralığı için teklif verme süresi dolmuştur (Son 24 saat).');
      return;
    }

    setSelectedSlot(slot);
    setBidForm({
      basePrice: slot.currentHighestBid ? (slot.currentHighestBid.basePriceOffer * 1.05).toString() : slot.basePrice.toString(),
      impressionPrice: slot.currentHighestBid ? slot.currentHighestBid.impressionPriceOffer.toString() : slot.minImpressionPrice.toString()
    });
    setBidModalVisible(true);
  };

  const submitBid = () => {
    if (!selectedSlot) return;

    const basePrice = parseFloat(bidForm.basePrice);
    const impressionPrice = parseFloat(bidForm.impressionPrice);

    if (isNaN(basePrice) || isNaN(impressionPrice)) {
      Alert.alert('Hata', 'Lütfen geçerli sayılar giriniz.');
      return;
    }

    if (basePrice < selectedSlot.basePrice) {
      Alert.alert('Hata', `Taban fiyat en az ${formatCurrency(selectedSlot.basePrice)} olmalıdır.`);
      return;
    }

    if (selectedSlot.currentHighestBid && basePrice <= selectedSlot.currentHighestBid.basePriceOffer) {
       Alert.alert('Hata', `Mevcut en yüksek teklifi (${formatCurrency(selectedSlot.currentHighestBid.basePriceOffer)}) geçmelisiniz.`);
       return;
    }

    // Mock submission
    Alert.alert('Başarılı', 'Teklifiniz alındı! Açık artırma sonucunu takip edebilirsiniz.');
    setBidModalVisible(false);
    
    // Update local state to reflect new bid (mock)
    setTimeSlots(prev => prev.map(slot => {
      if (slot.id === selectedSlot.id) {
        return {
          ...slot,
          currentHighestBid: {
            id: `my-bid-${Date.now()}`,
            advertiserId: user?.id || 'me',
            advertiserName: user?.name || 'Benim Firmam',
            timeSlotId: slot.id,
            basePriceOffer: basePrice,
            impressionPriceOffer: impressionPrice,
            totalEstimatedValue: 0,
            timestamp: new Date().toISOString()
          }
        };
      }
      return slot;
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Reklam Açık Artırması</Text>
        <Text style={styles.subtitle}>İstediğiniz zaman aralığı için teklif verin</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {timeSlots.map((slot) => (
          <Card key={slot.id} style={[styles.slotCard, slot.isPrimeTime && styles.primeCard]}>
            <View style={styles.cardContent}>
              <View style={styles.slotHeader}>
                <View>
                  <Text style={styles.dateText}>{formatDate(slot.date)}</Text>
                  <Text style={styles.timeText}>{slot.startTime} - {slot.endTime}</Text>
                </View>
                {slot.isPrimeTime && (
                  <View style={styles.primeBadge}>
                    <Text style={styles.primeText}>PRIME TIME</Text>
                  </View>
                )}
              </View>

              <View style={styles.bidInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Açılış Fiyatı:</Text>
                  <Text style={styles.value}>{formatCurrency(slot.basePrice)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Gösterim Başı:</Text>
                  <Text style={styles.value}>{slot.minImpressionPrice} TL</Text>
                </View>
                
                {slot.currentHighestBid ? (
                  <View style={styles.highestBidBox}>
                    <Text style={styles.highestBidLabel}>En Yüksek Teklif:</Text>
                    <Text style={styles.highestBidValue}>
                      {formatCurrency(slot.currentHighestBid.basePriceOffer)} 
                      <Text style={styles.bidderName}> ({slot.currentHighestBid.advertiserName})</Text>
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noBidText}>Henüz teklif yok</Text>
                )}
              </View>

              <Button 
                variant={slot.isPrimeTime ? "primary" : "outline"}
                onPress={() => handleBidPress(slot)}
                style={styles.bidButton}
              >
                Teklif Ver
              </Button>
            </View>
          </Card>
        ))}
      </ScrollView>

      <Modal
        visible={bidModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBidModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Teklif Ver</Text>
            {selectedSlot && (
              <Text style={styles.modalSubtitle}>
                {formatDate(selectedSlot.date)} | {selectedSlot.startTime} - {selectedSlot.endTime}
              </Text>
            )}

            <Input
              label="Taban Fiyat Teklifi (TL)"
              value={bidForm.basePrice}
              onChangeText={(text) => setBidForm(prev => ({ ...prev, basePrice: text }))}
              keyboardType="numeric"
              placeholder="Örn: 1000000"
            />

            <Input
              label="Gösterim Başı Teklif (TL)"
              value={bidForm.impressionPrice}
              onChangeText={(text) => setBidForm(prev => ({ ...prev, impressionPrice: text }))}
              keyboardType="numeric"
              placeholder="Örn: 0.003"
            />

            <View style={styles.modalButtons}>
              <Button 
                variant="ghost" 
                onPress={() => setBidModalVisible(false)}
                style={styles.modalButton}
              >
                İptal
              </Button>
              <Button 
                variant="primary" 
                onPress={submitBid}
                style={styles.modalButton}
              >
                Teklifi Gönder
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: sizes.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  content: {
    padding: sizes.md,
  },
  slotCard: {
    marginBottom: sizes.md,
    backgroundColor: colors.surface,
  },
  primeCard: {
    borderWidth: 2,
    borderColor: '#FFD700', // Gold for prime time
  },
  cardContent: {
    padding: sizes.md,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: sizes.md,
  },
  dateText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  timeText: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  primeBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.borderRadius.sm,
  },
  primeText: {
    fontSize: sizes.fontSize.xs,
    fontWeight: 'bold',
    color: '#000',
  },
  bidInfo: {
    backgroundColor: colors.surfaceVariant,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    marginBottom: sizes.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes.xs,
  },
  label: {
    color: colors.textSecondary,
  },
  value: {
    fontWeight: '600',
    color: colors.text,
  },
  highestBidBox: {
    marginTop: sizes.sm,
    paddingTop: sizes.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  highestBidLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  highestBidValue: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bidderName: {
    fontSize: sizes.fontSize.sm,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
  noBidText: {
    marginTop: sizes.sm,
    fontStyle: 'italic',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bidButton: {
    marginTop: sizes.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: sizes.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: sizes.lg,
    borderRadius: sizes.borderRadius.lg,
  },
  modalTitle: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: sizes.md,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    marginBottom: sizes.lg,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: sizes.md,
    gap: sizes.md,
  },
  modalButton: {
    flex: 1,
  },
});

