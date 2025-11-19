import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '@/components/ui/Input';

describe('Input Component', () => {
  it('should render correctly', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Test input" />
    );
    expect(getByPlaceholderText('Test input')).toBeTruthy();
  });

  it('should update value on text change', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Test input" onChangeText={onChangeTextMock} />
    );
    
    const input = getByPlaceholderText('Test input');
    fireEvent.changeText(input, 'New value');
    expect(onChangeTextMock).toHaveBeenCalledWith('New value');
  });

  it('should show error state', () => {
    const { getByText } = render(
      <Input error={true} helperText="Error message" />
    );
    expect(getByText('Error message')).toBeTruthy();
  });

  it('should show helper text', () => {
    const { getByText } = render(
      <Input helperText="Helper text" />
    );
    expect(getByText('Helper text')).toBeTruthy();
  });
});

