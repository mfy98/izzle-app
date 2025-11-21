import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';

interface SponsorInfoCardProps {
  title: string;
  subtitle: string;
  highlights: string[];
  gradient: [string, string, string];
}

export const SponsorInfoCard: React.FC<SponsorInfoCardProps> = ({
  title,
  subtitle,
  highlights,
  gradient,
}) => {
  return (
    <Card style={styles.card}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.highlightContainer}>
          {highlights.map((item, index) => (
            <View key={`${title}-${index}`} style={styles.highlightItem}>
              <MaterialCommunityIcons name="information" size={18} color="#FFFFFF" />
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: sizes.md,
    overflow: 'hidden',
    borderRadius: 16,
  },
  gradient: {
    padding: 20,
  },
  title: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: sizes.xs,
  },
  subtitle: {
    fontSize: sizes.fontSize.md,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: sizes.md,
  },
  highlightContainer: {
    gap: sizes.sm,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
  },
  highlightText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: sizes.fontSize.md,
    lineHeight: 22,
  },
});


