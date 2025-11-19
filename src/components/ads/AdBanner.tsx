import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, sizes } from '@/constants';
import { Ad } from '@/types/ad';

interface AdBannerProps {
  ad: Ad;
  onPress?: () => void;
  height?: number;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  ad,
  onPress,
  height = 120,
}) => {
  if (!ad.bannerUrl && !ad.imageUrl) {
    return null;
  }

  const imageUrl = ad.bannerUrl || ad.imageUrl;

  return (
    <TouchableOpacity
      style={[styles.container, { height }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {ad.title && (
        <View style={styles.overlay}>
          <View style={styles.badge}>
            {/* Sponsored badge can be added here */}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: sizes.borderRadius.md,
    overflow: 'hidden',
    marginVertical: sizes.sm,
    backgroundColor: colors.surfaceVariant,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: sizes.sm,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.borderRadius.sm,
  },
});

