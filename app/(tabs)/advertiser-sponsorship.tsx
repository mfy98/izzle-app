import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Input, Button, Select } from '@/components/ui';
import { colors, sizes } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { formatNumberInput, parseFormattedNumber, formatDateTurkish } from '@/utils/formatting';

const CURRENCY_OPTIONS = [
  { label: '₺', value: 'TRY' },
  { label: '$', value: 'USD' },
  { label: '€', value: 'EUR' },
];

export default function SponsorshipApplicationScreen() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'DAILY' as 'DAILY' | 'WEEKLY' | 'MONTHLY',
    bidAmount: '',
    currency: 'TRY',
    startDate: '',
    endDate: '',
  });
  const [displayDates, setDisplayDates] = useState({
    startDate: '',
    endDate: '',
  });

  const handleBidAmountChange = (text: string) => {
    // Format with thousand separators
    const formatted = formatNumberInput(text);
    setFormData(prev => ({ ...prev, bidAmount: formatted }));
  };

  const formatDateInput = (text: string): string => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '');
    
    // Limit to 8 digits (DDMMYYYY)
    const limited = digits.slice(0, 8);
    
    // Format with dots: DD.MM.YYYY
    if (limited.length === 0) return '';
    if (limited.length <= 2) return limited;
    if (limited.length <= 4) return `${limited.slice(0, 2)}.${limited.slice(2)}`;
    return `${limited.slice(0, 2)}.${limited.slice(2, 4)}.${limited.slice(4)}`;
  };

  const handleDateChange = (dateStr: string, field: 'startDate' | 'endDate') => {
    // Format the input with automatic dots
    const formatted = formatDateInput(dateStr);
    
    // Keep Turkish format in display
    setDisplayDates(prev => ({ ...prev, [field]: formatted }));
    
    // Convert Turkish format (dd.MM.yyyy) to ISO format (yyyy-MM-dd) for backend
    const parts = formatted.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        setFormData(prev => ({ ...prev, [field]: isoDate }));
      }
    } else {
      // Clear ISO date if format is incomplete
      setFormData(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.bidAmount || !formData.startDate || !formData.endDate) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      // Parse formatted amount
      const amount = parseFloat(parseFormattedNumber(formData.bidAmount));
      
      await apiClient.post('/sponsorship/apply', {
        advertiserId: user?.id,
        advertiserName: user?.name || 'Firma',
        type: formData.type,
        bidAmount: amount,
        currency: formData.currency,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      Alert.alert('Başarılı', 'Sponsorluk başvurunuz alındı. En yüksek teklifi veren firma seçilecektir.');
      // Reset form
      setFormData({ type: 'DAILY', bidAmount: '', currency: 'TRY', startDate: '', endDate: '' });
      setDisplayDates({ startDate: '', endDate: '' });
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.message || 'Başvuru sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Sponsorluk Başvurusu</Text>
          <Text style={styles.subtitle}>
            Ana sayfada gösterilecek sponsorluk için teklif verin
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.label}>Sponsorluk Türü</Text>
          <View style={styles.typeButtons}>
            {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  formData.type === type && styles.typeButtonActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, type }))}
              >
                <Text style={[
                  styles.typeButtonText,
                  formData.type === type && styles.typeButtonTextActive
                ]}>
                  {type === 'DAILY' ? 'Günlük' : type === 'WEEKLY' ? 'Haftalık' : 'Aylık'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.amountContainer}>
            <View style={styles.amountInput}>
              <Input
                label="Teklif Tutarı"
                value={formData.bidAmount}
                onChangeText={handleBidAmountChange}
                keyboardType="numeric"
                placeholder="Örn: 50.000"
              />
            </View>
            <View style={styles.currencySelect}>
              <Select
                value={formData.currency}
                options={CURRENCY_OPTIONS}
                onSelect={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                placeholder="₺"
              />
            </View>
          </View>

          <Input
            label="Başlangıç Tarihi"
            value={displayDates.startDate}
            onChangeText={(text) => handleDateChange(text, 'startDate')}
            placeholder="GG.AA.YYYY (örn: 15.01.2024)"
          />

          <Input
            label="Bitiş Tarihi"
            value={displayDates.endDate}
            onChangeText={(text) => handleDateChange(text, 'endDate')}
            placeholder="GG.AA.YYYY (örn: 15.02.2024)"
          />

          <Button
            variant="primary"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          >
            Başvur
          </Button>
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
  content: {
    padding: sizes.md,
  },
  header: {
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  card: {
    padding: sizes.md,
  },
  label: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: sizes.sm,
    marginBottom: sizes.md,
  },
  typeButton: {
    flex: 1,
    padding: sizes.sm,
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    color: colors.text,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  submitButton: {
    marginTop: sizes.md,
  },
  amountContainer: {
    flexDirection: 'row',
    gap: sizes.sm,
  },
  amountInput: {
    flex: 2,
  },
  currencySelect: {
    flex: 1,
  },
});

