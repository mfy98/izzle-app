import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button } from '@/components/ui';
import { colors, sizes } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { apiClient } from '@/services/api/client';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      // Call actual backend API for login
      const response = await apiClient.post<any>('/auth/login', data);
      const authData = response.data;
      
      // Update global auth state
      await login(authData);
      
      // Redirect based on role
      const role = authData.role;
      if (role === 'admin') {
        router.replace('/(tabs)/admin-panel');
      } else if (role === 'advertiser') {
        router.replace('/(tabs)/advertiser-dashboard');
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
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
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>
              Hesabınıza giriş yapın
            </Text>
          </View>

          <View style={styles.form}>
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
                  placeholder="Şifrenizi giriniz"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                />
              )}
            />

            <Button
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              fullWidth
              style={styles.loginButton}
            >
              Giriş Yap
            </Button>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => {
                // TODO: Navigate to forgot password
                console.log('Forgot password');
              }}
            >
              <Text style={styles.forgotPasswordText}>
                Şifremi Unuttum
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabınız yok mu? </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
            >
              <Text style={styles.footerLink}>Kayıt Ol</Text>
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: sizes.xxl,
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
  },
  form: {
    marginBottom: sizes.lg,
  },
  loginButton: {
    marginTop: sizes.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: sizes.sm,
  },
  forgotPasswordText: {
    fontSize: sizes.fontSize.sm,
    color: colors.primary,
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

