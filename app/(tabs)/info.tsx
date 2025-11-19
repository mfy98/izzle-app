import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, sizes } from '@/constants';

export default function InfoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Yasal Bilgiler</Text>
        <Text style={styles.sectionTitle}>Çekiliş Kuralları</Text>
        <Text style={styles.text}>
          Çekilişlerimiz noter huzurunda gerçekleştirilmektedir.
        </Text>
        <Text style={styles.sectionTitle}>KVKK</Text>
        <Text style={styles.text}>
          Kişisel verileriniz KVKK uyumlu şekilde korunmaktadır.
        </Text>
        <Text style={styles.sectionTitle}>İletişim</Text>
        <Text style={styles.text}>
          Sorularınız için: info@cursorraffle.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: sizes.md,
  },
  title: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.lg,
  },
  sectionTitle: {
    fontSize: sizes.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    marginTop: sizes.md,
    marginBottom: sizes.sm,
  },
  text: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: sizes.md,
  },
});

