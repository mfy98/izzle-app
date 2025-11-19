import { z } from 'zod';

// User registration validation
export const userRegistrationSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  surname: z.string().min(2, 'Soyisim en az 2 karakter olmalıdır'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Geçerli bir telefon numarası giriniz'),
  address: z.object({
    street: z.string().min(5, 'Sokak adresi en az 5 karakter olmalıdır'),
    district: z.string().min(2, 'İlçe bilgisi giriniz'),
    city: z.string().min(2, 'Şehir bilgisi giriniz'),
    postalCode: z.string().regex(/^[0-9]{5}$/, 'Posta kodu 5 haneli olmalıdır'),
    country: z.string().min(2, 'Ülke bilgisi giriniz'),
  }),
  confirmInformationAccuracy: z.boolean().refine(val => val === true, {
    message: 'Bilgilerinizin doğruluğunu onaylamanız gerekmektedir',
  }),
  acceptKvkk: z.boolean().refine(val => val === true, {
    message: 'KVKK şartlarını kabul etmeniz gerekmektedir',
  }),
});

// Advertiser registration validation
export const advertiserRegistrationSchema = z.object({
  companyName: z.string().min(3, 'Şirket adı en az 3 karakter olmalıdır'),
  taxNumber: z.string().optional().or(z.literal('')),
  contactEmail: z.string().email('Geçerli bir e-posta adresi giriniz'),
  contactPhone: z.string().regex(/^[0-9]{10,11}$/, 'Geçerli bir telefon numarası giriniz'),
  address: z.string().optional().or(z.literal('')),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
  websiteUrl: z.string().refine((val) => {
    if (!val || val.trim() === '') return true; // Empty is OK
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, 'Geçerli bir web sitesi URL\'si giriniz').optional(),
  industry: z.string().min(2, 'Sektör bilgisi giriniz'),
  description: z.string().min(10, 'Firma açıklaması en az 10 karakter olmalıdır'),
});

// Address validation
export const addressSchema = z.object({
  street: z.string().min(5, 'Sokak adresi en az 5 karakter olmalıdır'),
  district: z.string().min(2, 'İlçe bilgisi giriniz'),
  city: z.string().min(2, 'Şehir bilgisi giriniz'),
  postalCode: z.string().regex(/^[0-9]{5}$/, 'Posta kodu 5 haneli olmalıdır'),
  country: z.string().min(2, 'Ülke bilgisi giriniz'),
});

export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;
export type AdvertiserRegistrationFormData = z.infer<typeof advertiserRegistrationSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;

