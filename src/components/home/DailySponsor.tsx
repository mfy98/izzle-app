import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';

interface DailySponsorProps {
  sponsorName: string;
  sponsorDescription: string;
  imageUrl?: string;
  onPress?: () => void;
}

export const DailySponsor: React.FC<DailySponsorProps> = ({
  sponsorName,
  sponsorDescription,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <LinearGradient
          colors={['#F59E0B', '#F97316', '#EF4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.badge}>
                <MaterialCommunityIcons name="flash" size={20} color="#FFD700" />
                <Text style={styles.badgeText}>Günlük Sponsor</Text>
              </View>
            </View>

            <View style={styles.sponsorInfo}>
              {imageUrl ? (
                <View style={styles.imagePlaceholder}>
                  <MaterialCommunityIcons name="image" size={48} color="#FFFFFF" />
                </View>
              ) : (
                <View style={styles.placeholderImage}>
                  <MaterialCommunityIcons name="store" size={48} color="#FFFFFF" />
                </View>
              )}
              
              <View style={styles.textContainer}>
                <Text style={styles.sponsorName}>{sponsorName}</Text>
                <Text style={styles.sponsorDescription}>{sponsorDescription}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Özel Fırsatlar ve İndirimler</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: sizes.md,
    overflow: 'hidden',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
  },
  content: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sponsorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  sponsorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  sponsorDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

