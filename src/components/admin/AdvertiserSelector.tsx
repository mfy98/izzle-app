import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { colors, sizes } from '@/constants';

interface Advertiser {
  id: string;
  companyName: string;
  isActive: boolean;
}

interface AdvertiserSelectorProps {
  advertisers: Advertiser[];
  selectedAdvertiser: string | null;
  onSelect: (advertiserId: string) => void;
}

export const AdvertiserSelector: React.FC<AdvertiserSelectorProps> = ({
  advertisers,
  selectedAdvertiser,
  onSelect,
}) => {
  const activeAdvertisers = advertisers.filter(adv => adv.isActive);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firma Seçimi</Text>
      {activeAdvertisers.length === 0 ? (
        <Text style={styles.emptyText}>Aktif firma bulunmuyor</Text>
      ) : (
        <FlatList
          data={activeAdvertisers}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedAdvertiser === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.advertiserButton,
                  isSelected && styles.advertiserButtonSelected,
                ]}
                onPress={() => onSelect(item.id)}
              >
                <Text
                  style={[
                    styles.advertiserText,
                    isSelected && styles.advertiserTextSelected,
                  ]}
                >
                  {item.companyName}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
      {selectedAdvertiser && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedLabel}>
            Seçili: {advertisers.find(a => a.id === selectedAdvertiser)?.companyName}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  emptyText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: sizes.md,
  },
  advertiserButton: {
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.borderRadius.md,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: sizes.sm,
  },
  advertiserButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  advertiserText: {
    fontSize: sizes.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  advertiserTextSelected: {
    color: '#FFFFFF',
  },
  selectedInfo: {
    marginTop: sizes.sm,
    padding: sizes.sm,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.sm,
  },
  selectedLabel: {
    fontSize: sizes.fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
});


