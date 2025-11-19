# Test Documentation

## Test Kategorileri

### 1. Unit Tests
Tekil component, hook, utility ve store testleri.

**Lokasyon:** `src/__tests__/{components,hooks,store,utils}/`

**Örnekler:**
- `components/ui/Button.test.tsx` - Button component testi
- `hooks/useAuth.test.ts` - useAuth hook testi
- `store/authStore.test.ts` - Auth store testi
- `utils/formatting.test.ts` - Formatting utility testleri

### 2. Integration Tests
Sistem bileşenlerinin birlikte çalışmasını test eder.

**Lokasyon:** `src/__tests__/integration/`

**Örnekler:**
- `api.integration.test.ts` - API client entegrasyon testleri
- `store.integration.test.ts` - Store'ların birlikte çalışma testleri

### 3. QA Tests
Kullanıcı deneyimi, UI/UX ve erişilebilirlik testleri.

**Lokasyon:** `src/__tests__/qa/`

**Örnekler:**
- `components/SprintTimer.qa.test.tsx` - SprintTimer UI testleri
- `screens/HomeScreen.qa.test.tsx` - HomeScreen kullanıcı akış testleri
- `e2e/AuthFlow.qa.test.tsx` - Authentication E2E testleri
- `e2e/AdWatchingFlow.qa.test.tsx` - Reklam izleme E2E testleri

## Test Coverage Hedefleri

- **Components**: %80+
- **Hooks**: %80+
- **Utils**: %90+
- **Store**: %80+
- **Services**: %70+

## Çalıştırma

```bash
# Tüm testler
npm test

# Watch mode
npm run test:watch

# Coverage raporu
npm run test:coverage

# Sadece unit testler
npm run test:unit

# Sadece integration testler
npm run test:integration

# Sadece QA testler
npm run test:qa
```

