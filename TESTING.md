# Testing Guide

Bu proje için kapsamlı test altyapısı kurulmuştur. Unit, Integration ve QA testleri içerir.

## Test Yapısı

```
src/__tests__/
├── components/          # Component unit testleri
│   └── ui/             # UI component testleri
├── hooks/              # Custom hook testleri
├── store/              # Zustand store testleri
├── utils/              # Utility function testleri
├── integration/        # Integration testleri
│   ├── api.integration.test.ts
│   └── store.integration.test.ts
├── qa/                 # QA/E2E testleri
│   ├── components/     # Component QA testleri
│   └── screens/        # Screen QA testleri
└── setup/              # Test setup ve mocks
    ├── mocks.ts
    └── testUtils.tsx
```

## Test Türleri

### 1. Unit Tests
- **Components**: UI component'lerin izole testleri
- **Hooks**: Custom hook'ların testleri
- **Utils**: Utility fonksiyonların testleri
- **Store**: Zustand store'ların testleri

### 2. Integration Tests
- **API Integration**: Backend API ile entegrasyon testleri
- **Store Integration**: Store'ların birlikte çalışma testleri
- **Service Integration**: Service layer entegrasyon testleri

### 3. QA Tests
- **Component QA**: UI/UX ve accessibility testleri
- **Screen QA**: Ekran akışları ve kullanıcı deneyimi testleri
- **Visual Regression**: Görsel tutarlılık testleri

## Çalıştırma

### Tüm Testler
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Raporu
```bash
npm run test:coverage
```

### Belirli Test Kategorileri
```bash
# Sadece unit testler
npm run test:unit

# Sadece integration testler
npm run test:integration

# Sadece QA testler
npm run test:qa
```

### Belirli Dosya
```bash
npm test -- Button.test.tsx
```

## Test Yazma

### Component Test Örneği
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button>Test</Button>);
    expect(getByText('Test')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Test</Button>);
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Hook Test Örneği
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth Hook', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.loginUser('test@example.com', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Integration Test Örneği
```typescript
import { apiClient } from '@/services/api/client';

describe('API Integration', () => {
  it('should authenticate user', async () => {
    const response = await apiClient.post('/auth/login', {
      email: 'test@example.com',
      password: 'password',
    });
    
    expect(response.data.token).toBeDefined();
  });
});
```

## Mocking

### Storage Mock
```typescript
jest.mock('@/services/storage', () => ({
  setAuthToken: jest.fn(),
  getAuthToken: jest.fn().mockResolvedValue('mock-token'),
}));
```

### Navigation Mock
```typescript
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));
```

## Best Practices

1. **Test Isolation**: Her test bağımsız olmalı
2. **Arrange-Act-Assert**: Test yapısını takip edin
3. **Descriptive Names**: Test isimleri açıklayıcı olmalı
4. **Mock External Dependencies**: Dış bağımlılıkları mocklayın
5. **Coverage Goals**: Minimum %80 coverage hedefi

## Coverage Raporu

Coverage raporu şu alanları kapsar:
- Components: %80+
- Hooks: %80+
- Utils: %90+
- Store: %80+
- Services: %70+

## CI/CD Integration

Testler CI/CD pipeline'da otomatik çalışır:
- Pull Request'lerde tüm testler çalışır
- Coverage threshold kontrol edilir
- Lint hataları testleri engeller

## Troubleshooting

### Test çalışmıyor
```bash
# Cache'i temizle
npm test -- --clearCache

# Watch mode'da çalıştır
npm run test:watch
```

### Module resolution hatası
- `jest.config.js` içindeki `moduleNameMapper` kontrol edin
- Path alias'ların doğru olduğundan emin olun

### Async test hatası
- `waitFor` kullanın
- `act()` ile async operasyonları sarmalayın

