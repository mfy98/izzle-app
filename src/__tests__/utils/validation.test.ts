import { userRegistrationSchema, advertiserRegistrationSchema, addressSchema } from '@/utils/validation';

describe('Validation Schemas', () => {
  describe('userRegistrationSchema', () => {
    it('should validate correct user registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe',
        phone: '5551234567',
        address: {
          street: 'Test Street 123',
          district: 'Test District',
          city: 'Istanbul',
          postalCode: '34000',
          country: 'Turkey',
        },
      };

      expect(() => userRegistrationSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'John',
        surname: 'Doe',
        phone: '5551234567',
        address: {
          street: 'Test Street 123',
          district: 'Test District',
          city: 'Istanbul',
          postalCode: '34000',
          country: 'Turkey',
        },
      };

      expect(() => userRegistrationSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        name: 'John',
        surname: 'Doe',
        phone: '5551234567',
        address: {
          street: 'Test Street 123',
          district: 'Test District',
          city: 'Istanbul',
          postalCode: '34000',
          country: 'Turkey',
        },
      };

      expect(() => userRegistrationSchema.parse(invalidData)).toThrow();
    });

    it('should reject invalid postal code', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe',
        phone: '5551234567',
        address: {
          street: 'Test Street 123',
          district: 'Test District',
          city: 'Istanbul',
          postalCode: '123',
          country: 'Turkey',
        },
      };

      expect(() => userRegistrationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('addressSchema', () => {
    it('should validate correct address', () => {
      const validAddress = {
        street: 'Test Street 123',
        district: 'Test District',
        city: 'Istanbul',
        postalCode: '34000',
        country: 'Turkey',
      };

      expect(() => addressSchema.parse(validAddress)).not.toThrow();
    });
  });
});

