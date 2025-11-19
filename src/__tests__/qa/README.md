# QA Test Suite

Bu dizin, uygulamanın kritik kullanıcı akışları ve end-to-end senaryolarını test eden QA testlerini içerir.

## Test Kategorileri

### 1. Authentication Flows (`auth.qa.test.tsx`)
- ✅ Login flow (başarılı/başarısız)
- ✅ Registration flow (form validation, password strength)
- ✅ Logout flow
- ✅ Session management

### 2. Sprint and Ad Watching Flows (`sprint-ad.qa.test.tsx`)
- ✅ Sprint timer display
- ✅ Ad viewing during active sprint
- ✅ Ad viewing prevention outside sprint hours
- ✅ Ticket earning after ad view
- ✅ Multiplier system (default, winner, non-winner)

### 3. Coupon and Voucher Flows (`coupon-voucher.qa.test.tsx`)
- ✅ Coupon code display
- ✅ Coupon code copying
- ✅ Discount voucher display
- ✅ Used voucher marking
- ✅ Coupon validation
- ✅ Tab navigation

### 4. Affiliate Marketing Flows (`affiliate.qa.test.tsx`)
- ✅ Affiliate link display
- ✅ Link copying
- ✅ Statistics display
- ✅ Click tracking
- ✅ Conversion recording
- ✅ Earnings calculation

### 5. Advertiser Dashboard (`advertiser.qa.test.tsx`)
- ✅ Metrics display
- ✅ Time-based statistics
- ✅ Ad-specific statistics
- ✅ Metrics refresh
- ✅ Loading states

### 6. Integration Tests (`integration.qa.test.tsx`)
- ✅ Complete ad watching flow
- ✅ Complete raffle flow
- ✅ Complete coupon flow
- ✅ Complete affiliate flow
- ✅ Error handling

## Test Çalıştırma

```bash
# Tüm QA testleri
npm run test:qa

# Belirli bir kategori
npm run test:qa:auth
npm run test:qa:sprint
npm run test:qa:coupon
npm run test:qa:affiliate
npm run test:qa:advertiser
npm run test:qa:integration
```

## Test Coverage

QA testleri şu kritik kullanıcı akışlarını kapsar:

1. **Authentication**: Login, register, logout, session management
2. **Sprint Participation**: Sprint timer, ad watching, ticket earning
3. **Raffle**: Results viewing, winner display
4. **Coupons & Vouchers**: Viewing, copying, validation, usage
5. **Affiliate Marketing**: Link management, click tracking, conversions
6. **Advertiser Dashboard**: Metrics viewing, statistics

## Best Practices

- Her test bağımsız olmalı
- Mock'lar her test öncesi temizlenmeli
- Gerçekçi test verileri kullanılmalı
- Error handling senaryoları test edilmeli
- Loading states kontrol edilmeli




