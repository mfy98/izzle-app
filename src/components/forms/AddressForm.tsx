import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { Input } from '@/components/ui';
import { sizes } from '@/constants';
import { AddressFormData } from '@/types/user';

interface AddressFormProps {
  control: Control<any>;
  errors: any;
}

export const AddressForm: React.FC<AddressFormProps> = ({ control, errors }) => {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="address.street"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Sokak Adresi"
            placeholder="Mahalle, Sokak, Bina No, Daire No"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.address?.street}
            helperText={errors.address?.street?.message}
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="address.district"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="İlçe"
            placeholder="İlçe adını giriniz"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.address?.district}
            helperText={errors.address?.district?.message}
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="address.city"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Şehir"
            placeholder="Şehir adını giriniz"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.address?.city}
            helperText={errors.address?.city?.message}
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="address.postalCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Posta Kodu"
            placeholder="34000"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.address?.postalCode}
            helperText={errors.address?.postalCode?.message}
            keyboardType="number-pad"
            maxLength={5}
          />
        )}
      />

      <Controller
        control={control}
        name="address.country"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Ülke"
            placeholder="Türkiye"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.address?.country}
            helperText={errors.address?.country?.message}
            autoCapitalize="words"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: sizes.sm,
  },
});

