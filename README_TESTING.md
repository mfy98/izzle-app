# Test Sistemi - Hızlı Başlangıç

## 🧪 Test Çalıştırma

```bash
# Tüm testler
npm test

# Coverage ile
npm run test:coverage

# Watch mode
npm run test:watch

# Test kategorileri
npm run test:unit
npm run test:integration
npm run test:qa
```

## 📊 Test Dashboard (JMeter Benzeri)

### Dashboard Oluşturma

```bash
# Testleri çalıştır ve dashboard oluştur
npm run test:full

# Sadece dashboard oluştur
npm run test:dashboard
```

### Dashboard'u Görüntüleme

1. `test-results/dashboard.html` dosyasını tarayıcıda açın
2. Veya Windows'ta: `start test-results/dashboard.html`

### Dashboard Özellikleri

- ✅ Test sonuçları metrikleri
- 📈 Coverage raporları (Statements, Branches, Functions, Lines)
- 📊 Görsel progress bar'lar
- 🔗 Detaylı raporlara linkler
- 🎨 Modern, responsive tasarım

## 📁 Test Sonuçları

- **Dashboard**: `test-results/dashboard.html`
- **Detaylı Rapor**: `test-results/test-report.html`
- **Coverage**: `coverage/index.html`
- **JUnit XML**: `test-results/junit.xml` (CI/CD için)

## 🔍 Test Kategorileri

### Unit Tests
```bash
npm run test:unit
```
- Components
- Hooks
- Utils
- Store

### Integration Tests
```bash
npm run test:integration
```
- API integration
- Store integration

### QA Tests
```bash
npm run test:qa
```
- Authentication flows
- Sprint & Ad watching
- Coupon & Voucher
- Affiliate marketing
- Advertiser dashboard
- End-to-end flows

## 📈 Coverage Hedefleri

- **Statements**: %80+
- **Branches**: %80+
- **Functions**: %80+
- **Lines**: %80+

## 🛠️ Troubleshooting

### expo-modules-core hatası
```bash
npm install expo-modules-core --save
```

### Dashboard boş görünüyor
```bash
npm test -- --coverage
npm run test:dashboard
```

Detaylı bilgi için: [TEST_DASHBOARD.md](./TEST_DASHBOARD.md)

