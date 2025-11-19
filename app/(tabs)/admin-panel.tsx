import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdScheduleCalendar } from '@/components/admin/AdScheduleCalendar';
import { TimeSlotManager } from '@/components/admin/TimeSlotManager';
import { AdvertiserSelector } from '@/components/admin/AdvertiserSelector';
import { ScheduleList } from '@/components/admin/ScheduleList';
import { colors, sizes } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { UserRole } from '@/types/user';
import { router } from 'expo-router';
import AdminAnalyticsScreen from './admin-analytics';

interface AdSchedule {
  id: string;
  advertiserId: string;
  advertiserName: string;
  adId?: string;
  adTitle?: string;
  startDate: string;
  endDate: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  priority: number;
  isActive: boolean;
  useGoogleAds: boolean;
}

interface Advertiser {
  id: string;
  companyName: string;
  isActive: boolean;
}

export default function AdminPanelScreen() {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState<AdSchedule[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'schedules' | 'create' | 'settings' | 'analytics'>('analytics');
  const [hybridSystemEnabled, setHybridSystemEnabled] = useState(true);

  // Check admin access
  useEffect(() => {
    if (user?.role !== UserRole.ADMIN) {
      Alert.alert('Yetki Hatası', 'Bu sayfaya erişim yetkiniz yok.');
      router.replace('/(tabs)/home');
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, []);
  
  const toggleHybridSystem = () => {
    setHybridSystemEnabled(prev => !prev);
    Alert.alert('Başarılı', `Hibrit reklam sistemi ${!hybridSystemEnabled ? 'aktif edildi' : 'devre dışı bırakıldı'}.`);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load schedules
      const schedulesResponse = await apiClient.get('/admin/schedules');
      setSchedules(schedulesResponse.data);

      // Load advertisers
      const advertisersResponse = await apiClient.get('/admin/advertisers');
      setAdvertisers(advertisersResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!selectedAdvertiser) {
      Alert.alert('Uyarı', 'Lütfen bir firma seçin.');
      return;
    }

    if (!selectedTimeSlot) {
      Alert.alert('Uyarı', 'Lütfen saat aralığı seçin.');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir gün seçin.');
      return;
    }

    try {
      // Calculate date range (1 month from selected date)
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      endDate.setMonth(endDate.getMonth() + 1);

      // Create schedules for each selected day
      const schedulePromises = selectedDays.map(dayOfWeek => 
        apiClient.post('/admin/schedules', {
          advertiserId: selectedAdvertiser,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          dayOfWeek,
          startTime: selectedTimeSlot.start,
          endTime: selectedTimeSlot.end,
          priority: 0,
          useGoogleAds: true, // Default to Google Ads if no custom ad
        })
      );

      await Promise.all(schedulePromises);
      Alert.alert('Başarılı', 'Zamanlama oluşturuldu!');
      
      // Reset form
      setSelectedAdvertiser(null);
      setSelectedTimeSlot(null);
      setSelectedDays([]);
      setActiveTab('schedules');
      
      // Reload data
      loadData();
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Zamanlama oluşturulamadı.');
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    Alert.alert(
      'Zamanlamayı Sil',
      'Bu zamanlamayı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/schedules/${scheduleId}`);
              Alert.alert('Başarılı', 'Zamanlama silindi.');
              loadData();
            } catch (error) {
              Alert.alert('Hata', 'Zamanlama silinemedi.');
            }
          },
        },
      ]
    );
  };

  if (user?.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Yönetim Paneli</Text>
        <Text style={styles.subtitle}>Reklam Zamanlama Yönetimi</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => setActiveTab('calendar')}
        >
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
            Takvim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Yeni Zamanlama
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'schedules' && styles.activeTab]}
          onPress={() => setActiveTab('schedules')}
        >
          <Text style={[styles.tabText, activeTab === 'schedules' && styles.activeTabText]}>
            Zamanlamalar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Ayarlar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'settings' && (
           <View style={styles.createContainer}>
             <Card style={styles.card}>
               <CardHeader title="Sistem Ayarları" />
               <View style={styles.settingRow}>
                 <View style={styles.settingInfo}>
                   <Text style={styles.settingTitle}>Hibrit Reklam Sistemi</Text>
                   <Text style={styles.settingDescription}>
                     Reklam verenlerin reklam kotası dolduğunda veya reklam bulunamadığında diğer ağ reklamlarını göster.
                   </Text>
                 </View>
                 <TouchableOpacity 
                   style={[styles.switch, hybridSystemEnabled && styles.switchActive]}
                   onPress={toggleHybridSystem}
                 >
                   <View style={[styles.switchKnob, hybridSystemEnabled && styles.switchKnobActive]} />
                 </TouchableOpacity>
               </View>
             </Card>
           </View>
        )}

        {activeTab === 'calendar' && (
          <AdScheduleCalendar
            schedules={schedules}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}

        {activeTab === 'create' && (
          <View style={styles.createContainer}>
            <Card style={styles.card}>
              <CardHeader title="Yeni Reklam Zamanlaması" />
              
              <AdvertiserSelector
                advertisers={advertisers}
                selectedAdvertiser={selectedAdvertiser}
                onSelect={setSelectedAdvertiser}
              />

              <TimeSlotManager
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotSelect={setSelectedTimeSlot}
                selectedDays={selectedDays}
                onDaysSelect={setSelectedDays}
              />

              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Başlangıç Tarihi:</Text>
                <Text style={styles.dateValue}>
                  {selectedDate.toLocaleDateString('tr-TR')}
                </Text>
                <Text style={styles.dateLabel}>Bitiş Tarihi (1 ay sonra):</Text>
                <Text style={styles.dateValue}>
                  {new Date(selectedDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')}
                </Text>
              </View>

              <Button
                variant="primary"
                onPress={handleCreateSchedule}
                style={styles.createButton}
              >
                Zamanlamayı Oluştur
              </Button>
            </Card>
          </View>
        )}

        {activeTab === 'schedules' && (
          <ScheduleList
            schedules={schedules}
            onDelete={handleDeleteSchedule}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalyticsScreen />
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
    marginBottom: sizes.xs,
  },
  subtitle: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: sizes.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  createContainer: {
    padding: sizes.md,
  },
  card: {
    marginBottom: sizes.md,
  },
  dateInfo: {
    marginVertical: sizes.md,
    padding: sizes.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
  },
  dateLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  dateValue: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    fontWeight: '600',
    marginBottom: sizes.sm,
  },
  createButton: {
    marginTop: sizes.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sizes.md,
  },
  settingInfo: {
    flex: 1,
    paddingRight: sizes.md,
  },
  settingTitle: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: colors.primary,
  },
  switchKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
  },
  switchKnobActive: {
    alignSelf: 'flex-end',
  },
});


