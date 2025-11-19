// Kategori temaları ve renkleri
export interface CategoryTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  icon: string;
  gradient: string[];
}

export const categoryThemes: Record<string, CategoryTheme> = {
  Kozmetik: {
    name: 'Kozmetik',
    primaryColor: '#E91E63',
    secondaryColor: '#F8BBD0',
    backgroundColor: '#FFF0F5',
    icon: 'lipstick',
    gradient: ['#E91E63', '#F06292'],
  },
  Teknoloji: {
    name: 'Teknoloji',
    primaryColor: '#2196F3',
    secondaryColor: '#90CAF9',
    backgroundColor: '#E3F2FD',
    icon: 'laptop',
    gradient: ['#2196F3', '#64B5F6'],
  },
  Moda: {
    name: 'Moda',
    primaryColor: '#9C27B0',
    secondaryColor: '#CE93D8',
    backgroundColor: '#F3E5F5',
    icon: 'tshirt-crew',
    gradient: ['#9C27B0', '#BA68C8'],
  },
  Spor: {
    name: 'Spor',
    primaryColor: '#4CAF50',
    secondaryColor: '#A5D6A7',
    backgroundColor: '#E8F5E9',
    icon: 'dumbbell',
    gradient: ['#4CAF50', '#81C784'],
  },
  Ev: {
    name: 'Ev & Yaşam',
    primaryColor: '#FF9800',
    secondaryColor: '#FFCC80',
    backgroundColor: '#FFF3E0',
    icon: 'home',
    gradient: ['#FF9800', '#FFB74D'],
  },
  Yemek: {
    name: 'Yemek & İçecek',
    primaryColor: '#F44336',
    secondaryColor: '#EF9A9A',
    backgroundColor: '#FFEBEE',
    icon: 'food',
    gradient: ['#F44336', '#E57373'],
  },
  Seyahat: {
    name: 'Seyahat',
    primaryColor: '#00BCD4',
    secondaryColor: '#80DEEA',
    backgroundColor: '#E0F7FA',
    icon: 'airplane',
    gradient: ['#00BCD4', '#4DD0E1'],
  },
  Eğlence: {
    name: 'Eğlence',
    primaryColor: '#FF5722',
    secondaryColor: '#FFAB91',
    backgroundColor: '#FBE9E7',
    icon: 'movie',
    gradient: ['#FF5722', '#FF8A65'],
  },
};

export const getCategoryTheme = (category: string): CategoryTheme => {
  return categoryThemes[category] || categoryThemes['Teknoloji'];
};

export const getCategoryColor = (category: string): string => {
  return getCategoryTheme(category).primaryColor;
};


