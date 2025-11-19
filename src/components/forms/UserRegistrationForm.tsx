import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Checkbox } from '@/components/ui';
import { AddressForm } from './AddressForm';
import { colors, sizes } from '@/constants';
import { userRegistrationSchema, UserRegistrationFormData } from '@/utils/validation';
import { router } from 'expo-router';

export const UserRegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      surname: '',
      phone: '',
      address: {
        street: '',
        district: '',
        city: '',
        postalCode: '',
        country: 'Türkiye',
      },
      confirmInformationAccuracy: false,
      acceptKvkk: false,
    },
  });

  const onSubmit = async (data: UserRegistrationFormData) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post('/auth/register', data);
      
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Registration data:', data);
      
      // Navigate to login after successful registration
      router.replace('/login');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>
              Hesap oluşturarak çekilişlere katılabilirsiniz
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-posta"
                  placeholder="ornek@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Şifre"
                  placeholder="En az 8 karakter"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
              )}
            />

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Ad"
                  placeholder="Adınızı giriniz"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  autoCapitalize="words"
                  autoComplete="given-name"
                />
              )}
            />

            <Controller
              control={control}
              name="surname"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Soyad"
                  placeholder="Soyadınızı giriniz"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.surname}
                  helperText={errors.surname?.message}
                  autoCapitalize="words"
                  autoComplete="family-name"
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Telefon"
                  placeholder="5551234567"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              )}
            />

            <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>
              Adres Bilgileri
            </Text>
            <Text style={styles.addressNote}>
              ⚠️ Önemli: Doğru adres bilgisi vermezseniz ödül gönderilemez!
            </Text>
            <AddressForm control={control} errors={errors} />

            <View style={styles.checkboxesContainer}>
              <Controller
                control={control}
                name="confirmInformationAccuracy"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={value}
                    onPress={() => onChange(!value)}
                    label="Bilgilerimin doğruluğunu onaylıyorum"
                    error={!!errors.confirmInformationAccuracy}
                    helperText={errors.confirmInformationAccuracy?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="acceptKvkk"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={value}
                    onPress={() => onChange(!value)}
                    label="KVKK şartlarını kabul ediyorum"
                    error={!!errors.acceptKvkk}
                    helperText={errors.acceptKvkk?.message}
                  />
                )}
              />
            </View>

            <Button
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              fullWidth
              style={styles.submitButton}
            >
              Kayıt Ol
            </Button>
          </View>

          <View style={styles.footer}>
            <View style={styles.loginLinkContainer}>
              <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity
                onPress={() => router.replace('/login')}
              >
                <Text style={styles.footerLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.advertiserLink}
              onPress={() => router.push('/advertiser-register')}
            >
              <Text style={styles.advertiserLinkText}>
                Kurumsal/Reklam Veren Kaydı
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: sizes.lg,
  },
  header: {
    marginBottom: sizes.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  subtitle: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: sizes.lg,
  },
  sectionTitle: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.md,
    marginTop: sizes.sm,
  },
  sectionTitleSpacing: {
    marginTop: sizes.lg,
  },
  addressNote: {
    fontSize: sizes.fontSize.sm,
    color: colors.warning,
    marginBottom: sizes.md,
    padding: sizes.sm,
    backgroundColor: colors.surfaceVariant,
    borderRadius: sizes.borderRadius.sm,
  },
  checkboxesContainer: {
    marginTop: sizes.lg,
    marginBottom: sizes.md,
  },
  submitButton: {
    marginTop: sizes.xl,
  },
  footer: {
    marginTop: sizes.lg,
    alignItems: 'center',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: sizes.md,
  },
  footerText: {
    fontSize: sizes.fontSize.md,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: sizes.fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  advertiserLink: {
    padding: sizes.sm,
  },
  advertiserLinkText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});

