import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Input, Button } from '@/components/ui';
import { colors, sizes } from '@/constants';
import { advertiserRegistrationSchema, AdvertiserRegistrationFormData } from '@/utils/validation';
import { router } from 'expo-router';
import { apiClient } from '@/services/api/client';

export const AdvertiserRegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logoUri, setLogoUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdvertiserRegistrationFormData>({
    resolver: zodResolver(advertiserRegistrationSchema),
    mode: 'onBlur',
    defaultValues: {
      companyName: '',
      taxNumber: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      password: '',
      websiteUrl: '',
      industry: '',
      description: '',
    },
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Galeri erişim izni gerekli!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: AdvertiserRegistrationFormData) => {
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    try {
      console.log('Submitting advertiser registration:', data);
      
      // Prepare data for backend - clean empty strings
      const registrationData: any = {
        companyName: data.companyName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        password: data.password,
        industry: data.industry,
        description: data.description,
      };

      // Add optional fields only if they have values
      if (data.taxNumber && data.taxNumber.trim()) {
        registrationData.taxNumber = data.taxNumber;
      }
      if (data.address && data.address.trim()) {
        registrationData.address = data.address;
      }
      if (data.websiteUrl && data.websiteUrl.trim()) {
        registrationData.websiteUrl = data.websiteUrl;
      }
      if (logoUri) {
        registrationData.logoUrl = logoUri;
      }

      console.log('Sending registration data:', registrationData);

      // Call actual backend API
      const response = await apiClient.post('/auth/register/advertiser', registrationData);
      console.log('Registration successful:', response.data);
      
      alert('Kayıt başarılı! Hesabınız admin onayından sonra aktif olacaktır.');
      
      // Navigate to login
      router.replace('/login');
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      
      let errorMessage = 'Kayıt sırasında bir hata oluştu.';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        const platform = Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : 'Web';
        errorMessage = `Backend sunucusuna bağlanılamıyor.\n\n` +
          `Platform: ${platform}\n` +
          `API URL: ${error.config?.baseURL || 'Bilinmiyor'}\n\n` +
          `Çözüm önerileri:\n` +
          `1. Backend'in çalıştığından emin olun (http://localhost:8080)\n` +
          `${Platform.OS === 'android' ? '2. Android Emulator kullanıyorsanız, 10.0.2.2:8080 kullanılır\n' : ''}` +
          `${Platform.OS === 'ios' ? '2. iOS Simulator kullanıyorsanız, localhost:8080 kullanılır\n' : ''}` +
          `3. Fiziksel cihaz kullanıyorsanız, bilgisayarınızın IP adresini kullanın\n` +
          `4. Aynı WiFi ağında olduğunuzdan emin olun`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Registration error:', errorMessage);
      alert(errorMessage);
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
            <Text style={styles.title}>Reklam Veren Kaydı</Text>
            <Text style={styles.subtitle}>
              Şirketinizi kaydedin ve reklamlarınızı yükleyin
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Şirket Bilgileri</Text>

            <View style={styles.logoSection}>
              <Text style={styles.logoLabel}>Şirket Logosu</Text>
              <TouchableOpacity
                style={styles.logoPicker}
                onPress={pickImage}
              >
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoPlaceholderText}>+ Logo Yükle</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Controller
              control={control}
              name="companyName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Şirket Adı"
                  placeholder="Şirket adını giriniz"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                  autoCapitalize="words"
                />
              )}
            />

            <Controller
              control={control}
              name="taxNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Vergi Numarası (Opsiyonel)"
                  placeholder="10 haneli vergi numarası"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.taxNumber}
                  helperText={errors.taxNumber?.message}
                  keyboardType="number-pad"
                />
              )}
            />

            <Controller
              control={control}
              name="industry"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Sektör"
                  placeholder="Örn: Teknoloji, Giyim"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.industry}
                  helperText={errors.industry?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="websiteUrl"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Web Sitesi (Opsiyonel)"
                  placeholder="https://www.sirket.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.websiteUrl}
                  helperText={errors.websiteUrl?.message}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Firma Hakkında Kısa Bilgi"
                  placeholder="Firmanızı tanıtan kısa bir açıklama"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  multiline
                  numberOfLines={3}
                />
              )}
            />

            <Controller
              control={control}
              name="contactEmail"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="İletişim E-postası"
                  placeholder="iletisim@sirket.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail?.message}
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
                />
              )}
            />

            <Controller
              control={control}
              name="contactPhone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="İletişim Telefonu"
                  placeholder="5551234567"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.contactPhone}
                  helperText={errors.contactPhone?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              )}
            />

            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Adres (Opsiyonel)"
                  placeholder="Şirket adresini giriniz"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  multiline
                  numberOfLines={3}
                  autoCapitalize="words"
                />
              )}
            />

            <Button
              variant="primary"
              onPress={handleSubmit(
                onSubmit,
                (validationErrors) => {
                  console.log('Form validation errors:', validationErrors);
                  // Show first validation error
                  const errorKeys = Object.keys(validationErrors);
                  if (errorKeys.length > 0) {
                    const firstErrorKey = errorKeys[0];
                    const firstError = validationErrors[firstErrorKey as keyof typeof validationErrors];
                    if (firstError && typeof firstError === 'object' && 'message' in firstError) {
                      alert(String(firstError.message));
                    } else {
                      alert(`Lütfen "${firstErrorKey}" alanını kontrol edin.`);
                    }
                  }
                }
              )}
              loading={loading}
              disabled={loading}
              fullWidth
              style={styles.submitButton}
            >
              Kayıt Ol
            </Button>

            <Text style={styles.infoText}>
              Kayıt sonrası reklam videolarınızı ve materyallerinizi yükleyebileceksiniz.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
            <TouchableOpacity
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.footerLink}>Giriş Yap</Text>
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
  logoSection: {
    marginBottom: sizes.md,
  },
  logoLabel: {
    fontSize: sizes.fontSize.md,
    fontWeight: '500',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  logoPicker: {
    width: 120,
    height: 120,
    borderRadius: sizes.borderRadius.md,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  logoPlaceholderText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
  },
  submitButton: {
    marginTop: sizes.xl,
  },
  infoText: {
    fontSize: sizes.fontSize.sm,
    color: colors.textSecondary,
    marginTop: sizes.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: sizes.lg,
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
});

