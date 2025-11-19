import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api/client';
import { formatNumber, formatCurrency } from '@/utils/formatting';
import { copyToClipboard } from '@/utils/clipboard';
import { FadeInView } from '@/components/ui';
import { AffiliateLink, AffiliateStats } from '@/types/coupon';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export default function AffiliateScreen() {
  const { user } = useAuthStore();
  const { handleError } = useErrorHandler();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [linksResponse, statsResponse] = await Promise.all([
        apiClient.get<AffiliateLink[]>('/affiliate/links/my-links'),
        apiClient.get<AffiliateStats>('/affiliate/stats'),
      ]);
      
      setLinks(linksResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      handleError(error as Error, true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleShareLink = async (link: AffiliateLink) => {
    try {
      await Share.share({
        message: `${link.title}\n${link.fullAffiliateUrl}`,
        title: link.title,
      });
    } catch (error) {
      console.error('Error sharing link:', error);
    }
  };

  const handleCopyLink = async (link: AffiliateLink) => {
    await copyToClipboard(link.fullAffiliateUrl, 'Link panoya kopyalandı!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Affiliate Marketing</Text>
        <Text style={styles.subtitle}>Linklerinizi paylaşın, komisyon kazanın</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Overview */}
        {stats && (
          <FadeInView delay={100}>
            <Card style={styles.statsCard}>
              <View style={styles.cardContent}>
                <Text style={styles.statsTitle}>İstatistikleriniz</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.totalLinks}</Text>
                    <Text style={styles.statLabel}>Toplam Link</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{formatNumber(stats.totalClicks)}</Text>
                    <Text style={styles.statLabel}>Tıklama</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{formatNumber(stats.totalConversions)}</Text>
                    <Text style={styles.statLabel}>Dönüşüm</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{formatCurrency(stats.totalEarnings)}</Text>
                    <Text style={styles.statLabel}>Toplam Kazanç</Text>
                  </View>
                </View>
                <View style={styles.conversionRateContainer}>
                  <Text style={styles.conversionRateLabel}>Dönüşüm Oranı</Text>
                  <Text style={styles.conversionRateValue}>{stats.conversionRate.toFixed(2)}%</Text>
                </View>
              </View>
            </Card>
          </FadeInView>
        )}

        {/* Affiliate Links */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Affiliate Linkleriniz</Text>
          {links.map((link, index) => (
            <FadeInView key={link.id} delay={index * 100 + 200}>
              <Card style={styles.linkCard}>
                <View style={styles.cardContent}>
                  <View style={styles.linkHeader}>
                    <View style={styles.linkInfo}>
                      <Text style={styles.linkTitle}>{link.title}</Text>
                      {link.description && (
                        <Text style={styles.linkDescription}>{link.description}</Text>
                      )}
                      <Text style={styles.linkCode}>Kod: {link.affiliateCode}</Text>
                    </View>
                  </View>

                  <View style={styles.linkStats}>
                    <View style={styles.linkStatItem}>
                      <Text style={styles.linkStatValue}>{formatNumber(link.clickCount)}</Text>
                      <Text style={styles.linkStatLabel}>Tıklama</Text>
                    </View>
                    <View style={styles.linkStatItem}>
                      <Text style={styles.linkStatValue}>{formatNumber(link.conversionCount)}</Text>
                      <Text style={styles.linkStatLabel}>Dönüşüm</Text>
                    </View>
                    <View style={styles.linkStatItem}>
                      <Text style={styles.linkStatValue}>{formatCurrency(link.totalEarnings)}</Text>
                      <Text style={styles.linkStatLabel}>Kazanç</Text>
                    </View>
                  </View>

                  <View style={styles.commissionInfo}>
                    <Text style={styles.commissionText}>
                      Komisyon: {link.commissionType === 'PERCENTAGE' 
                        ? `%${link.commissionValue}` 
                        : formatCurrency(link.commissionValue)}
                    </Text>
                  </View>

                  <View style={styles.linkActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.shareButton]}
                      onPress={() => handleShareLink(link)}
                    >
                      <Text style={styles.actionButtonText}>Paylaş</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.copyButton]}
                      onPress={() => handleCopyLink(link)}
                    >
                      <Text style={styles.actionButtonText}>Kopyala</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            </FadeInView>
          ))}
        </View>

        {links.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz affiliate linkiniz yok</Text>
            <Text style={styles.emptySubtext}>
              Reklam verenlerle iletişime geçerek affiliate link oluşturabilirsiniz
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    margin: 10,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  conversionRateContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  conversionRateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  conversionRateValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  linksSection: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  linkCard: {
    marginBottom: 12,
    elevation: 2,
  },
  linkHeader: {
    marginBottom: 12,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  linkCode: {
    fontSize: 12,
    color: '#2196F3',
    fontFamily: 'monospace',
  },
  linkStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12,
  },
  linkStatItem: {
    alignItems: 'center',
  },
  linkStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  linkStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  commissionInfo: {
    marginBottom: 12,
  },
  commissionText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  linkActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#2196F3',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cardContent: {
    padding: 16,
  },
});

