# Advertiser Features Documentation

## 🎯 Özellikler

### 1. Role-Based Arayüz Ayrımı
- **User**: Normal kullanıcı arayüzü (Reklam İzle, Çekiliş, Profil)
- **Advertiser**: Reklam veren arayüzü (Dashboard, Metrikler, Teklif Yönetimi)
- **Admin**: Yönetim paneli (Teklif onaylama, sistem yönetimi)

### 2. Advertiser Dashboard
- **Lokasyon**: `src/app/(tabs)/advertiser-dashboard.tsx`
- **Metrikler**:
  - Toplam izlenme sayısı
  - Benzersiz kullanıcı sayısı
  - Aktif reklam sayısı
  - Günlük/Haftalık/Aylık izlenme istatistikleri
  - Reklam bazlı detaylı istatistikler
  - Ortalama izlenme süresi
  - Tamamlanma oranı

### 3. Reklam İzlenme Tracking
- **Entity**: `AdView` - Her reklam izlenmesi kaydedilir
- **Bilgiler**:
  - Hangi kullanıcı izledi
  - Hangi reklam izlendi
  - Hangi firmaya ait
  - İzlenme süresi
  - Tamamlanma durumu (minimum süre karşılandı mı)
  - Sprint bilgisi

### 4. Banner Ads Sistemi
- **Component**: `MultiBannerAds` - Birden fazla firmanın banner reklamlarını gösterir
- **Özellikler**:
  - Horizontal scroll
  - Her firma kendi banner'ını gösterir
  - Tıklanabilir banner'lar
  - Otomatik döngü

### 5. Backend API Endpoints

#### Advertiser Metrikleri
```
GET /api/advertiser/metrics
GET /api/advertiser/metrics/{advertiserId}
```

**Response:**
```json
{
  "totalViews": 1250,
  "uniqueUsers": 450,
  "totalAds": 5,
  "activeAds": 3,
  "viewsToday": 120,
  "viewsThisWeek": 850,
  "viewsThisMonth": 1250,
  "viewsByAd": [
    {
      "adId": 1,
      "adTitle": "Premium Reklam",
      "viewCount": 500,
      "uniqueUserCount": 200,
      "averageDuration": 25.5
    }
  ],
  "averageViewDuration": 24.3,
  "completionRate": 85.5
}
```

#### Reklam Teklifleri
```
POST /api/ad-proposals - Teklif oluştur
GET /api/ad-proposals/my-proposals - Kendi tekliflerim
GET /api/ad-proposals/pending - Admin: Bekleyen teklifler
POST /api/ad-proposals/{id}/review - Admin: Teklif onayla/reddet
```

## 📊 Metrik Detayları

### Toplam İzlenme
- Firma reklamlarının toplam izlenme sayısı
- Sadece tamamlanan izlemeler sayılır (minimum süre karşılandı)

### Benzersiz Kullanıcı
- Firma reklamlarını izleyen farklı kullanıcı sayısı
- Aynı kullanıcı birden fazla reklam izlese bile 1 sayılır

### Reklam Bazlı İstatistikler
- Her reklam için:
  - Toplam izlenme
  - Benzersiz kullanıcı
  - Ortalama izlenme süresi

### Zaman Bazlı İstatistikler
- Bugün: Günün başından itibaren
- Bu Hafta: Son 7 gün
- Bu Ay: Son 30 gün

## 🔄 Sistem Akışı

1. **Kullanıcı Reklam İzler**
   - `AdView` kaydı oluşturulur
   - Firma bilgisi kaydedilir
   - İzlenme süresi kaydedilir
   - Tamamlanma durumu kontrol edilir

2. **Advertiser Metrikleri Görüntüler**
   - Dashboard'da tüm metrikler gösterilir
   - Her reklam için detaylı istatistikler
   - Zaman bazlı grafikler

3. **Banner Reklamlar**
   - Birden fazla firmanın banner'ları gösterilir
   - Her firma kendi izlenme bilgisini alır
   - Horizontal scroll ile gezinme

## 🎨 UI/UX

### Advertiser Dashboard
- Modern kart tasarımı
- Pull-to-refresh
- Loading states
- Error handling
- Responsive layout

### Banner Ads
- Smooth scrolling
- Auto-play (opsiyonel)
- Touch feedback
- Image optimization

## 🔐 Güvenlik

- Advertiser sadece kendi metriklerini görebilir
- Admin tüm metrikleri görebilir
- Role-based access control
- JWT authentication

