import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Input, Button } from '@/components/ui';
import { colors, sizes } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { formatCurrency } from '@/utils/formatting';

export default function SponsorshipApplicationScreen() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'DAILY' as 'DAILY' | 'WEEKLY' | 'MONTHLY',
    bidAmount: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async () => {
    if (!formData.bidAmount || !formData.startDate || !formData.endDate) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/sponsorship/apply', {
        advertiserId: user?.id,
        advertiserName: user?.name || 'Firma',
        type: formData.type,
        bidAmount: parseFloat(formData.bidAmount),
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      Alert.alert('Başarılı', 'Sponsorluk başvurunuz alındı. En yüksek teklifi veren firma seçilecektir.');
      // Reset form
      setFormData({ type: 'DAILY', bidAmount: '', startDate: '', endDate: '' });
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

          <Input
            label="Teklif Tutarı (TL)"
            value={formData.bidAmount}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bidAmount: text }))}
            keyboardType="numeric"
            placeholder="Örn: 50000"
          />

          <Input
            label="Başlangıç Tarihi"
            value={formData.startDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
            placeholder="YYYY-MM-DD"
          />

          <Input
            label="Bitiş Tarihi"
            value={formData.endDate}
            onChangeText={(text) => setFormData(prev => ({ ...prev, endDate: text }))}
            placeholder="YYYY-MM-DD"
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
});

