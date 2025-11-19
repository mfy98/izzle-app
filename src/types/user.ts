export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  ADVERTISER = 'advertiser',
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  address: Address;
  role: UserRole;
  raffleMultiplier: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  isVerified: boolean;
}

export interface UserRegistrationForm {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  address: Address;
}

// For form data compatibility
export type UserRegistrationFormData = UserRegistrationForm;

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

