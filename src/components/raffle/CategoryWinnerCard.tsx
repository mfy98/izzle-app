import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCategoryTheme } from '@/utils/categoryThemes';
import { formatDate } from '@/utils/formatting';

interface Winner {
  userName: string;
  prizeName: string;
  prizeValue: number;
  announcedAt: string;
}

interface CategoryWinnerCardProps {
  category: string;
  winners: Winner[];
}

export const CategoryWinnerCard: React.FC<CategoryWinnerCardProps> = ({
  category,
  winners,
}) => {
  const theme = getCategoryTheme(category);

  return (
    <View style={[styles.container, { borderLeftColor: theme.primaryColor }]}>
      <LinearGradient
        colors={[theme.backgroundColor, '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primaryColor + '20' }]}>
            <MaterialCommunityIcons
              name={theme.icon as any}
              size={24}
              color={theme.primaryColor}
            />
          </View>
          <Text style={[styles.categoryTitle, { color: theme.primaryColor }]}>
            {category}
          </Text>
        </View>

        <View style={styles.winnersList}>
          {winners.map((winner, index) => (
            <View key={index} style={styles.winnerItem}>
              <View style={styles.winnerInfo}>
                <View style={[styles.winnerBadge, { backgroundColor: theme.secondaryColor }]}>
                  <Text style={styles.winnerInitial}>
                    {winner.userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.winnerDetails}>
                  <Text style={styles.winnerName}>{winner.userName}</Text>
                  <Text style={[styles.prizeName, { color: theme.primaryColor }]}>
                    {winner.prizeName}
                  </Text>
                </View>
              </View>
              <Text style={styles.winnerDate}>{formatDate(winner.announcedAt)}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  winnersList: {
    gap: 12,
  },
  winnerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  winnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  winnerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  winnerInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  winnerDetails: {
    flex: 1,
  },
  winnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  prizeName: {
    fontSize: 12,
    fontWeight: '500',
  },
  winnerDate: {
    fontSize: 10,
    color: '#999',
  },
});

