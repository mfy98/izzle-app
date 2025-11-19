# Coupon & Affiliate Marketing Features

## 🎫 İndirim Kodları (Coupon Codes)

### Özellikler
- **Firma bazlı kupon kodları**: Her reklam veren kendi kupon kodlarını oluşturabilir
- **İndirim tipleri**: Yüzde indirim veya sabit tutar indirim
- **Kullanım limitleri**: Maksimum kullanım sayısı veya sınırsız
- **Minimum alışveriş tutarı**: Belirli bir tutarın üzerinde geçerli
- **Geçerlilik tarihleri**: Başlangıç ve bitiş tarihleri
- **Affiliate link entegrasyonu**: Kupon kodlarına affiliate link eklenebilir

### Backend API
```
POST /api/coupons - Kupon kodu oluştur (Advertiser)
GET /api/coupons/active - Aktif kupon kodları
GET /api/coupons/my-coupons - Kendi kuponlarım (Advertiser)
POST /api/coupons/validate?code=XXX&purchaseAmount=100 - Kupon doğrula
POST /api/coupons/use?code=XXX&purchaseAmount=100 - Kupon kullan
```

### Frontend
- **Coupons Screen**: `src/app/(tabs)/coupons.tsx`
- Tab'lar: Kupon Kodları / İndirim Çekleri
- Kupon listesi, detaylar, kopyalama

## 🎁 İndirim Çekleri (Discount Vouchers)

### Özellikler
- **Kullanıcıya özel çekler**: Belirli kullanıcılara atanabilir
- **Genel çekler**: Herkes kullanabilir
- **Tek kullanımlık**: Bir kez kullanılabilir
- **Firma bazlı veya genel**: Reklam veren veya sistem tarafından oluşturulabilir

### Backend API
```
POST /api/vouchers - İndirim çeki oluştur
GET /api/vouchers/my-vouchers - Kullanıcının çekleri
POST /api/vouchers/use?voucherCode=XXX&purchaseAmount=100 - Çek kullan
```

## 🔗 Affiliate Marketing

### Özellikler
- **Affiliate link oluşturma**: Reklam verenler affiliate link oluşturabilir
- **Komisyon sistemi**: Yüzde veya sabit tutar komisyon
- **Click tracking**: Her tıklama kaydedilir
- **Conversion tracking**: Satış/dönüşüm takibi
- **Earnings tracking**: Toplam kazanç takibi
- **Stats dashboard**: Detaylı istatistikler

### Backend API
```
POST /api/affiliate/links?affiliateUserId=1 - Affiliate link oluştur (Advertiser)
GET /api/affiliate/links/my-links - Kendi affiliate linklerim
GET /api/affiliate/stats - Affiliate istatistikleri
GET /api/affiliate/click/{affiliateCode} - Tıklama kaydet ve yönlendir
POST /api/affiliate/conversion?clickId=1&purchaseAmount=100 - Dönüşüm kaydet
```

### Frontend
- **Affiliate Screen**: `src/app/(tabs)/affiliate.tsx`
- İstatistikler: Toplam link, tıklama, dönüşüm, kazanç
- Link listesi: Her link için detaylar
- Paylaş/Kopyala butonları

## 📊 Sistem Akışı

### Kupon Kodu Kullanımı
1. Kullanıcı kupon kodunu görür
2. Kodu kopyalar
3. Alışveriş yaparken kodu girer
4. Sistem kodu doğrular
5. İndirim uygulanır
6. Kullanım kaydedilir

### Affiliate Link Kullanımı
1. Affiliate link oluşturulur
2. Link paylaşılır
3. Kullanıcı linke tıklar → Click kaydedilir
4. Kullanıcı satın alma yapar → Conversion kaydedilir
5. Komisyon hesaplanır ve affiliate user'a ödenir

### İndirim Çeki Kullanımı
1. Kullanıcıya çek atanır veya genel çek oluşturulur
2. Kullanıcı çeklerini görüntüler
3. Çek kodu kopyalanır
4. Alışveriş yaparken çek kullanılır
5. Çek tek kullanımlık olarak işaretlenir

## 💰 Komisyon Hesaplama

### Yüzde Komisyon
```
Komisyon = Satış Tutarı × (Komisyon Yüzdesi / 100)
Örnek: 1000 TL × (%10 / 100) = 100 TL
```

### Sabit Tutar Komisyon
```
Komisyon = Sabit Tutar
Örnek: 50 TL
```

## 🎯 Kullanım Senaryoları

### Senaryo 1: Firma Kupon Kampanyası
1. Firma kupon kodu oluşturur (%20 indirim, 100 kullanım)
2. Kupon kodları kullanıcılara gösterilir
3. Kullanıcılar kodu kullanarak indirim alır
4. Firma kullanım istatistiklerini görür

### Senaryo 2: Affiliate Program
1. Reklam veren affiliate programı başlatır
2. Kullanıcılar affiliate link alır
3. Linkler paylaşılır
4. Tıklamalar ve dönüşümler takip edilir
5. Komisyonlar hesaplanır ve ödenir

### Senaryo 3: Özel İndirim Çekleri
1. Sistem veya firma özel çek oluşturur
2. Belirli kullanıcılara atanır
3. Kullanıcılar çeklerini görüntüler
4. Çekler alışverişte kullanılır

## 🔐 Güvenlik

- Kupon kodları benzersiz olmalı
- Kullanım limitleri kontrol edilmeli
- Geçerlilik tarihleri kontrol edilmeli
- Minimum alışveriş tutarı kontrol edilmeli
- Her kullanıcı bir kuponu sadece bir kez kullanabilir
- Affiliate link'ler benzersiz kodlara sahip olmalı

