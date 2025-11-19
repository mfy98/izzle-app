import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { Image } from 'expo-image';
import { Ad } from '@/types/ad';
import { FadeInView } from '@/components/ui';

interface MultiBannerAdsProps {
  ads: Ad[];
  onAdPress?: (ad: Ad) => void;
}

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 120;
const BANNER_WIDTH = width - 40;

export const MultiBannerAds: React.FC<MultiBannerAdsProps> = ({ ads, onAdPress }) => {
  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        pagingEnabled
      >
        {ads.map((ad, index) => (
          <FadeInView key={ad.id} delay={index * 100}>
            <Card
              style={styles.bannerCard}
              onPress={() => onAdPress?.(ad)}
            >
              {ad.bannerUrl ? (
                <Image
                  source={{ uri: ad.bannerUrl }}
                  style={styles.bannerImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.placeholder}>
                  <Card.Content style={styles.placeholderContent}>
                    <View style={styles.placeholderText}>
                      {/* Placeholder content */}
                    </View>
                  </Card.Content>
                </View>
              )}
            </Card>
          </FadeInView>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    marginRight: 10,
    elevation: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    // Placeholder styling
  },
});

