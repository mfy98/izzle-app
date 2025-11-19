import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { colors, sizes } from '@/constants';

const GRID_SIZE = 20;
const CELL_SIZE = Dimensions.get('window').width / GRID_SIZE - 2;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

interface SnakeGameProps {
  onGameEnd: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onGameEnd }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      gameLoopRef.current = setInterval(() => {
        moveSnake();
      }, 150);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [snake, direction, isGameOver, isPaused]);

  const generateFood = (): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const moveSnake = () => {
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
        return newSnake;
      }

      // Remove tail
      newSnake.pop();
      return newSnake;
    });
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    onGameEnd(score);
  };

  const handleDirectionChange = (newDirection: Direction) => {
    // Prevent reverse direction
    if (
      (direction === 'UP' && newDirection === 'DOWN') ||
      (direction === 'DOWN' && newDirection === 'UP') ||
      (direction === 'LEFT' && newDirection === 'RIGHT') ||
      (direction === 'RIGHT' && newDirection === 'LEFT')
    ) {
      return;
    }
    setDirection(newDirection);
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let cellStyle = styles.cell;
    if (isSnakeHead) {
      cellStyle = [styles.cell, styles.snakeHead];
    } else if (isSnakeBody) {
      cellStyle = [styles.cell, styles.snakeBody];
    } else if (isFood) {
      cellStyle = [styles.cell, styles.food];
    }

    return <View key={`${x}-${y}`} style={cellStyle} />;
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>🐍 Snake Oyunu</Text>
        <Text style={styles.score}>Skor: {score}</Text>
      </View>

      {isGameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Oyun Bitti!</Text>
          <Text style={styles.finalScore}>Final Skor: {score}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
            <Text style={styles.restartButtonText}>Tekrar Oyna</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.gameBoard}>
            {Array.from({ length: GRID_SIZE }).map((_, y) =>
              Array.from({ length: GRID_SIZE }).map((_, x) => renderCell(x, y))
            )}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={() => setIsPaused(!isPaused)}
            >
              <MaterialCommunityIcons
                name={isPaused ? 'play' : 'pause'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>

            <View style={styles.directionButtons}>
              <TouchableOpacity
                style={styles.directionButton}
                onPress={() => handleDirectionChange('UP')}
              >
                <MaterialCommunityIcons name="arrow-up" size={24} color={colors.primary} />
              </TouchableOpacity>
              <View style={styles.directionRow}>
                <TouchableOpacity
                  style={styles.directionButton}
                  onPress={() => handleDirectionChange('LEFT')}
                >
                  <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.directionButton}
                  onPress={() => handleDirectionChange('RIGHT')}
                >
                  <MaterialCommunityIcons name="arrow-right" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.directionButton}
                onPress={() => handleDirectionChange('DOWN')}
              >
                <MaterialCommunityIcons name="arrow-down" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
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
  score: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.md,
    padding: 2,
    marginBottom: sizes.md,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 1,
    backgroundColor: colors.background,
  },
  snakeHead: {
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  snakeBody: {
    backgroundColor: colors.primary + '80',
    borderRadius: 2,
  },
  food: {
    backgroundColor: colors.success,
    borderRadius: CELL_SIZE / 2,
  },
  controls: {
    gap: sizes.sm,
  },
  pauseButton: {
    alignSelf: 'center',
    padding: sizes.sm,
  },
  directionButtons: {
    alignItems: 'center',
    gap: sizes.xs,
  },
  directionRow: {
    flexDirection: 'row',
    gap: sizes.md,
  },
  directionButton: {
    padding: sizes.sm,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.sm,
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
    marginBottom: sizes.md,
  },
  restartButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.lg,
    paddingVertical: sizes.md,
    borderRadius: sizes.borderRadius.md,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
  },
});


