import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, CardHeader } from '@/components/ui/Card';
import { SnakeGame } from './SnakeGame';
import { TapGame } from './TapGame';
import { colors, sizes } from '@/constants';

type GameType = 'snake' | 'tap' | null;

export const GamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [snakeHighScore, setSnakeHighScore] = useState(0);
  const [tapHighScore, setTapHighScore] = useState(0);

  const handleSnakeGameEnd = (score: number) => {
    if (score > snakeHighScore) {
      setSnakeHighScore(score);
    }
  };

  const handleTapGameEnd = (score: number) => {
    if (score > tapHighScore) {
      setTapHighScore(score);
    }
  };

  if (activeGame) {
    return (
      <Card style={styles.card}>
        <View style={styles.gameHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setActiveGame(null)}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
        </View>

        {activeGame === 'snake' && <SnakeGame onGameEnd={handleSnakeGameEnd} />}
        {activeGame === 'tap' && <TapGame onGameEnd={handleTapGameEnd} />}
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <CardHeader title="🎮 Mini Oyunlar" />
      <Text style={styles.subtitle}>
        Sprint beklerken eğlen! Skorunu yükselt ve liderlik tablosunda yer al.
      </Text>

      <View style={styles.gamesList}>
        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => setActiveGame('snake')}
        >
          <View style={styles.gameIcon}>
            <MaterialCommunityIcons name="snake" size={32} color={colors.primary} />
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Snake Oyunu</Text>
            <Text style={styles.gameDescription}>
              Klasik yılan oyunu. Yemekleri topla ve büyü!
            </Text>
            {snakeHighScore > 0 && (
              <Text style={styles.highScore}>En Yüksek: {snakeHighScore}</Text>
            )}
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => setActiveGame('tap')}
        >
          <View style={styles.gameIcon}>
            <MaterialCommunityIcons name="flash" size={32} color={colors.primary} />
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Hızlı Tıklama</Text>
            <Text style={styles.gameDescription}>
              30 saniyede mümkün olduğunca çok tıkla!
            </Text>
            {tapHighScore > 0 && (
              <Text style={styles.highScore}>En Yüksek: {tapHighScore}</Text>
            )}
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: sizes.md,
  },
  gameHeader: {
    marginBottom: sizes.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
  },
  backButtonText: {
    fontSize: sizes.fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.md,
    lineHeight: 20,
  },
  gamesList: {
    gap: sizes.sm,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    padding: sizes.md,
    borderRadius: sizes.borderRadius.md,
    gap: sizes.md,
  },
  gameIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs / 2,
  },
  gameDescription: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: sizes.xs / 2,
  },
  highScore: {
    fontSize: sizes.fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
});


