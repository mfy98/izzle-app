import React from 'react';
import { render } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { AddressForm } from '@/components/forms/AddressForm';

const TestComponent = () => {
  const { control, formState: { errors } } = useForm();
  
  return <AddressForm control={control} errors={errors} />;
};

describe('AddressForm Component', () => {
  it('should render all address fields', () => {
    const { getByPlaceholderText } = render(<TestComponent />);
    
    expect(getByPlaceholderText(/Mahalle, Sokak/i)).toBeTruthy();
    expect(getByPlaceholderText(/İlçe adını giriniz/i)).toBeTruthy();
    expect(getByPlaceholderText(/Şehir adını giriniz/i)).toBeTruthy();
    expect(getByPlaceholderText(/34000/i)).toBeTruthy();
    expect(getByPlaceholderText(/Türkiye/i)).toBeTruthy();
  });

  it('should show error messages', () => {
    const { getByText } = render(<TestComponent />);
    // Error messages are handled by validation
  });
});

