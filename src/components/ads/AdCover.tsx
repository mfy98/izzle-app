import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, sizes } from '@/constants';
import { Ad } from '@/types/ad';
import { LinearGradient } from 'expo-linear-gradient';

interface AdCoverProps {
  ad: Ad;
  onPress?: () => void;
}

export const AdCover: React.FC<AdCoverProps> = ({
  ad,
  onPress,
}) => {
  if (!ad.coverUrl) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: ad.coverUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      >
        {ad.title && (
          <View style={styles.content}>
            <Text style={styles.title}>{ad.title}</Text>
            {ad.logoUrl && (
              <Image
                source={{ uri: ad.logoUrl }}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: sizes.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: sizes.md,
    backgroundColor: colors.surfaceVariant,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: sizes.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
  },
});

