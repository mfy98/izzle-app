import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';

interface TapGameProps {
  onGameEnd: (score: number) => void;
}

export const TapGame: React.FC<TapGameProps> = ({ onGameEnd }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [combo, setCombo] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameActive, timeLeft]);

  useEffect(() => {
    // Combo multiplier
    if (combo >= 10) {
      setMultiplier(3);
    } else if (combo >= 5) {
      setMultiplier(2);
    } else {
      setMultiplier(1);
    }
  }, [combo]);

  const handleTap = () => {
    if (!isGameActive) {
      setIsGameActive(true);
    }

    if (isGameOver) return;

    // Animate button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setScore(prev => prev + multiplier);
    setCombo(prev => prev + 1);
  };

  const handleGameOver = () => {
    setIsGameActive(false);
    setIsGameOver(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onGameEnd(score);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameActive(false);
    setIsGameOver(false);
    setMultiplier(1);
    setCombo(0);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Hızlı Tıklama</Text>
        <View style={styles.stats}>
          <Text style={styles.score}>Skor: {score}</Text>
          <Text style={styles.time}>⏱️ {timeLeft}s</Text>
        </View>
      </View>

      {isGameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Süre Doldu!</Text>
          <Text style={styles.finalScore}>Final Skor: {score}</Text>
          <Text style={styles.comboText}>En Yüksek Combo: {combo}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
            <Text style={styles.restartButtonText}>Tekrar Oyna</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.gameArea}>
            <View style={styles.multiplierContainer}>
              <Text style={styles.multiplierLabel}>Çarpan</Text>
              <Text style={styles.multiplierValue}>x{multiplier}</Text>
            </View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[styles.tapButton, combo >= 5 && styles.tapButtonCombo]}
                onPress={handleTap}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="flash"
                  size={64}
                  color={combo >= 5 ? '#FFD700' : '#FFFFFF'}
                />
                <Text style={styles.tapButtonText}>TIKLA!</Text>
              </TouchableOpacity>
            </Animated.View>

            {combo > 0 && (
              <View style={styles.comboContainer}>
                <Text style={styles.comboText}>🔥 Combo: {combo}</Text>
              </View>
            )}
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              {!isGameActive
                ? 'Başlamak için butona tıklayın!'
                : 'Mümkün olduğunca hızlı tıklayın!'}
            </Text>
          </View>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: sizes.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  title: {
    fontSize: sizes.fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  stats: {
    alignItems: 'flex-end',
    gap: sizes.xs / 2,
  },
  score: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
  time: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  gameArea: {
    alignItems: 'center',
    paddingVertical: sizes.xl,
    gap: sizes.md,
  },
  multiplierContainer: {
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.borderRadius.md,
  },
  multiplierLabel: {
    fontSize: sizes.fontSize.xs,
    color: colors.textSecondary,
  },
  multiplierValue: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tapButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tapButtonCombo: {
    backgroundColor: '#FFD700',
  },
  tapButtonText: {
    color: '#FFFFFF',
    fontSize: sizes.fontSize.md,
    fontWeight: 'bold',
    marginTop: sizes.xs,
  },
  comboContainer: {
    marginTop: sizes.sm,
  },
  comboText: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.success,
  },
  instructions: {
    alignItems: 'center',
    marginTop: sizes.md,
  },
  instructionsText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  gameOverContainer: {
    alignItems: 'center',
    padding: sizes.xl,
  },
  gameOverText: {
    fontSize: sizes.fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  finalScore: {
    fontSize: sizes.fontSize.lg,
    color: colors.primary,
    marginBottom: sizes.xs,
  },
  restartButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.lg,
    paddingVertical: sizes.md,
    borderRadius: sizes.borderRadius.md,
    marginTop: sizes.md,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
  },
});


