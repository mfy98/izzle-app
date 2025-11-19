# Test Dashboard Kullanım Kılavuzu

JMeter benzeri test sonuçlarını görselleştiren bir dashboard sistemi kuruldu.

## 🚀 Hızlı Başlangıç

### 1. Testleri Çalıştır ve Dashboard Oluştur

```bash
# Tüm testleri çalıştır ve dashboard oluştur
npm run test:full

# Sadece dashboard oluştur (test sonuçları zaten varsa)
npm run test:dashboard
```

### 2. Dashboard'u Görüntüle

Dashboard otomatik olarak `test-results/dashboard.html` dosyasında oluşturulur.

Tarayıcıda açmak için:
- Windows: `test-results/dashboard.html` dosyasına çift tıklayın
- Veya terminal'de: `start test-results/dashboard.html` (Windows)

## 📊 Dashboard Özellikleri

### Metrikler

Dashboard şu metrikleri gösterir:

1. **Test Sonuçları**
   - Toplam test sayısı
   - Başarılı testler
   - Başarısız testler
   - Başarı oranı (%)

2. **Coverage Metrikleri**
   - Statements coverage
   - Branches coverage
   - Functions coverage
   - Lines coverage

3. **Görsel Göstergeler**
   - Renkli progress bar'lar
   - Durum rozetleri (Success/Warning/Danger)
   - Gradient kartlar

### Raporlar

Dashboard'dan erişilebilen raporlar:

1. **Detailed Test Report** (`test-report.html`)
   - Tüm test detayları
   - Başarısız testlerin hata mesajları
   - Test süreleri

2. **Coverage Report** (`coverage/index.html`)
   - Kod coverage detayları
   - Dosya bazında coverage
   - Coverage trend analizi

3. **JUnit XML** (`junit.xml`)
   - CI/CD entegrasyonu için
   - Jenkins, GitLab CI, GitHub Actions uyumlu

## 🛠️ Kullanım Senaryoları

### Senaryo 1: Tüm Testleri Çalıştır ve Dashboard Oluştur

```bash
npm run test:full
```

Bu komut:
1. Tüm testleri coverage ile çalıştırır
2. HTML, LCOV, JSON formatlarında raporlar oluşturur
3. Dashboard'u otomatik oluşturur

### Senaryo 2: Sadece Belirli Testleri Çalıştır

```bash
# Sadece unit testler
npm run test:unit -- --coverage

# Sadece QA testler
npm run test:qa -- --coverage

# Sonra dashboard oluştur
npm run test:dashboard
```

### Senaryo 3: CI/CD Entegrasyonu

```yaml
# .github/workflows/tests.yml örneği
- name: Run Tests
  run: npm run test:full

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: |
      test-results/
      coverage/
```

## 📁 Dosya Yapısı

```
project-root/
├── test-results/
│   ├── dashboard.html          # Ana dashboard
│   ├── test-report.html        # Detaylı test raporu
│   ├── junit.xml               # JUnit format
│   └── custom-styles.css       # Özel stiller
├── coverage/
│   ├── index.html              # Coverage raporu
│   ├── lcov.info               # LCOV format
│   └── coverage-summary.json   # JSON özet
└── scripts/
    └── test-dashboard.js       # Dashboard generator
```

## 🎨 Dashboard Özelleştirme

### Renkleri Değiştir

`test-results/custom-styles.css` dosyasını düzenleyin:

```css
.metric-card.passed {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### Metrikleri Özelleştir

`scripts/test-dashboard.js` dosyasını düzenleyerek yeni metrikler ekleyebilirsiniz.

## 🔧 Troubleshooting

### Dashboard boş görünüyor

1. Test sonuçlarının oluşturulduğundan emin olun:
   ```bash
   npm test -- --coverage
   ```

2. `test-results` ve `coverage` klasörlerinin var olduğunu kontrol edin

3. Dashboard'u yeniden oluşturun:
   ```bash
   npm run test:dashboard
   ```

### Coverage verileri görünmüyor

`coverage/coverage-summary.json` dosyasının var olduğundan emin olun. Coverage raporu oluşturmak için:

```bash
npm test -- --coverage
```

## 📈 Best Practices

1. **Düzenli Test Çalıştırma**
   - Her commit öncesi testleri çalıştırın
   - CI/CD pipeline'da otomatik test çalıştırın

2. **Coverage Hedefleri**
   - Statements: %80+
   - Branches: %80+
   - Functions: %80+
   - Lines: %80+

3. **Dashboard Paylaşımı**
   - Test sonuçlarını takım ile paylaşın
   - CI/CD artifact olarak saklayın

## 🚀 Gelişmiş Özellikler

### Otomatik Dashboard Güncelleme

Test çalıştıktan sonra otomatik dashboard oluşturmak için `package.json`'a ekleyin:

```json
{
  "scripts": {
    "test": "jest && npm run test:dashboard"
  }
}
```

### Dashboard'u Web Server'da Host Etme

```bash
# Python ile
cd test-results
python -m http.server 8000

# Node.js ile
npx http-server test-results -p 8000
```

Sonra tarayıcıda: `http://localhost:8000/dashboard.html`

## 📝 Notlar

- Dashboard, test sonuçlarını okur ve görselleştirir
- Test çalıştırılmadan dashboard oluşturulursa, varsayılan değerler gösterilir
- Coverage raporu için `--coverage` flag'i gereklidir
- JUnit XML formatı CI/CD sistemleri ile uyumludur

