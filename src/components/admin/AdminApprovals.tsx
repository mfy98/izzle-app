import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, sizes } from '@/constants';
import { apiClient } from '@/services/api/client';

interface PendingAdvertiser {
  id: string;
  companyName: string;
  contactEmail: string;
  industry: string;
  createdAt: string;
}

export const AdminApprovals: React.FC = () => {
  const [pendingList, setPendingList] = useState<PendingAdvertiser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      setLoading(true);
      // Mocking backend call
      // const response = await apiClient.get('/admin/approvals/pending');
      // setPendingList(response.data);
      
      await new Promise(r => setTimeout(r, 800));
      setPendingList([
        {
          id: '101',
          companyName: 'Yeni Tech A.Ş.',
          contactEmail: 'info@yenitech.com',
          industry: 'Teknoloji',
          createdAt: new Date().toISOString()
        },
        {
          id: '102',
          companyName: 'Moda Butik',
          contactEmail: 'contact@modabutik.com',
          industry: 'Moda',
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading pending approvals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      // await apiClient.post(`/admin/approvals/${id}/approve`);
      Alert.alert('Başarılı', 'Firma onaylandı.');
      setPendingList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Hata', 'İşlem başarısız.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      // await apiClient.post(`/admin/approvals/${id}/reject`);
      Alert.alert('Bilgi', 'Firma reddedildi.');
      setPendingList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Hata', 'İşlem başarısız.');
    }
  };

  if (loading) return <Text style={styles.centerText}>Yükleniyor...</Text>;

  if (pendingList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bekleyen onay yok.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onay Bekleyen Firmalar</Text>
      {pendingList.map(item => (
        <Card key={item.id} style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.companyName}>{item.companyName}</Text>
              <Text style={styles.details}>{item.contactEmail}</Text>
              <Text style={styles.details}>{item.industry}</Text>
            </View>
            <View style={styles.actions}>
              <Button variant="primary" size="sm" onPress={() => handleApprove(item.id)}>Onayla</Button>
              <Button variant="outline" size="sm" onPress={() => handleReject(item.id)} style={{ marginTop: 8 }}>Reddet</Button>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: sizes.md,
  },
  centerText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: sizes.fontSize.md,
  },
  title: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    marginBottom: sizes.md,
    color: colors.text,
  },
  card: {
    marginBottom: sizes.md,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: sizes.md,
  },
  companyName: {
    fontSize: sizes.fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'column',
  },
});

