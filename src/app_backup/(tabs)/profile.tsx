import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, sizes } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useRaffleStore } from '@/store/raffleStore';
import { formatDate, formatMultiplier } from '@/utils';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { myTickets, myMultiplier } = useRaffleStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Kullanıcı bilgisi bulunamadı</Text>
          <Button
            variant="primary"
            onPress={() => router.replace('/login')}
            style={styles.loginButton}
          >
            Giriş Yap
          </Button>
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
          <Text style={styles.title}>Profil</Text>
        </View>

        <Card style={styles.card}>
          <CardHeader title="Kişisel Bilgiler" />
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ad Soyad</Text>
              <Text style={styles.infoValue}>
                {user.name} {user.surname}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-posta</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Telefon</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rol</Text>
              <Text style={styles.infoValue}>
                {user.role === 'user' && 'Kullanıcı'}
                {user.role === 'admin' && 'Yönetici'}
                {user.role === 'advertiser' && 'Reklam Veren'}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <CardHeader title="Adres Bilgileri" />
          <View style={styles.infoContainer}>
            <View style={styles.addressContainer}>
              <Text style={styles.addressText}>
                {user.address.street}
              </Text>
              <Text style={styles.addressText}>
                {user.address.district}, {user.address.city}
              </Text>
              <Text style={styles.addressText}>
                {user.address.postalCode} {user.address.city}
              </Text>
              <Text style={styles.addressText}>
                {user.address.country}
              </Text>
            </View>
            {!user.address.isVerified && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  ⚠️ Adres doğrulanmamış. Lütfen doğru bilgi giriniz.
                </Text>
              </View>
            )}
          </View>
        </Card>

        <Card style={styles.card}>
          <CardHeader title="Çekiliş İstatistikleri" />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Çekiliş Hakları</Text>
              <Text style={styles.statValue}>{myTickets}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Çarpan</Text>
              <Text style={styles.statValue}>x{formatMultiplier(myMultiplier)}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <CardHeader title="Hesap Bilgileri" />
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kayıt Tarihi</Text>
              <Text style={styles.infoValue}>
                {formatDate(user.createdAt)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Son Güncelleme</Text>
              <Text style={styles.infoValue}>
                {formatDate(user.updatedAt)}
              </Text>
            </View>
          </View>
        </Card>

        {user.role === 'advertiser' && (
          <Card style={styles.card}>
            <CardHeader title="Reklam Veren İşlemleri" />
            <Button
              variant="outlined"
              onPress={() => router.push('/advertiser-register')}
              style={styles.actionButton}
            >
              Reklam Yönetimi
            </Button>
          </Card>
        )}

        {user.role === 'admin' && (
          <Card style={styles.card}>
            <CardHeader title="Yönetici İşlemleri" />
            <Button
              variant="outlined"
              onPress={() => {
                // TODO: Navigate to admin panel
                console.log('Admin panel');
              }}
              style={styles.actionButton}
            >
              Yönetim Paneli
            </Button>
          </Card>
        )}

        <Button
          variant="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Çıkış Yap
        </Button>
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
  },
  card: {
    marginBottom: sizes.md,
  },
  infoContainer: {
    paddingVertical: sizes.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  addressContainer: {
    paddingVertical: sizes.sm,
  },
  addressText: {
    fontSize: sizes.fontSize.md,
    color: colors.text,
    marginBottom: sizes.xs,
    lineHeight: 22,
  },
  warningContainer: {
    marginTop: sizes.md,
    padding: sizes.sm,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.sm,
  },
  warningText: {
    fontSize: sizes.fontSize.sm,
    color: colors.warning,
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
  actionButton: {
    marginTop: sizes.sm,
  },
  logoutButton: {
    marginTop: sizes.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.xl,
  },
  emptyText: {
    fontSize: sizes.fontSize.lg,
    color: colors.textSecondary,
    marginBottom: sizes.lg,
  },
  loginButton: {
    marginTop: sizes.md,
  },
});
