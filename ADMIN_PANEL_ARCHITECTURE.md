# Admin Panel - Reklam Zamanlama Sistemi

## 📋 Genel Bakış

Admin paneli, reklam gösterimlerini zamanlamak için kapsamlı bir arayüz sağlar. 1 aylık dönemler için gün ve saat bazlı reklam planlaması yapılabilir.

## 🏗️ Mimari

### Frontend (React Native)
- **Admin Panel Screen**: Ana zamanlama arayüzü
- **Calendar Component**: Takvim görünümü
- **TimeSlot Manager**: Saat dilimi yönetimi
- **Advertiser Selector**: Firma seçimi

### Backend (Spring Boot)
- **AdSchedule Entity**: Zamanlama veritabanı modeli
- **AdScheduleService**: Zamanlama iş mantığı
- **AdScheduleController**: REST API endpoints
- **Schedule Validator**: Çakışma kontrolü

### Event Integration
- **Spring Events**: Zamanlama değişikliklerini event olarak yayınlar
- **Event Listeners**: Zamanlanmış reklamları işler
- **CDN Distribution**: Reklamları CDN'e dağıtır (opsiyonel)

---

## 📊 Veritabanı Şeması

### AdSchedule Entity
```sql
CREATE TABLE ad_schedules (
    id BIGSERIAL PRIMARY KEY,
    advertiser_id BIGINT NOT NULL REFERENCES advertisers(id),
    ad_id BIGINT REFERENCES ads(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(advertiser_id, start_date, day_of_week, start_time)
);

CREATE INDEX idx_ad_schedules_date ON ad_schedules(start_date, end_date);
CREATE INDEX idx_ad_schedules_day_time ON ad_schedules(day_of_week, start_time);
```

---

## 🔄 Sistem Akışı

1. **Admin Zamanlama Oluşturur**
   - Takvimden tarih seçer
   - Gün ve saat aralığı belirler
   - Firma seçer
   - Reklam seçer (veya Google Ads fallback)

2. **Backend Validasyon**
   - Çakışma kontrolü
   - Tarih geçerliliği
   - Firma aktiflik kontrolü

3. **Spring Event Gönderimi**
   - ScheduleCreated event
   - Event listener ile işlenir

4. **CDN Dağıtımı**
   - Reklam dosyası CDN'e yüklenir
   - URL oluşturulur
   - Cache ayarları yapılır

5. **Zamanlanmış Gösterim**
   - Scheduled job zamanlanmış reklamları kontrol eder
   - Belirlenen saatte reklam gösterilir

---

## 📱 Frontend Component Yapısı

```
app/(tabs)/
  └── admin-panel.tsx (Ana admin panel)
      ├── AdScheduleCalendar (Takvim görünümü)
      ├── TimeSlotSelector (Saat seçimi)
      ├── AdvertiserSelector (Firma seçimi)
      └── ScheduleList (Mevcut zamanlamalar)

src/components/admin/
  ├── AdScheduleCalendar.tsx
  ├── TimeSlotManager.tsx
  ├── AdvertiserSelector.tsx
  └── ScheduleConflictWarning.tsx
```

---

## 🔌 API Endpoints

### Schedule Management
```
POST   /api/admin/schedules          - Yeni zamanlama oluştur
GET    /api/admin/schedules           - Tüm zamanlamaları listele
GET    /api/admin/schedules/:id       - Zamanlama detayı
PUT    /api/admin/schedules/:id       - Zamanlama güncelle
DELETE /api/admin/schedules/:id       - Zamanlama sil
GET    /api/admin/schedules/conflicts  - Çakışmaları kontrol et
POST   /api/admin/schedules/bulk      - Toplu zamanlama
```

### Schedule Query
```
GET /api/admin/schedules/calendar?month=2024-01
GET /api/admin/schedules/day?date=2024-01-15
GET /api/admin/schedules/advertiser/:id?startDate=2024-01-01&endDate=2024-01-31
```

---

## 🎯 Özellikler

### 1. Takvim Görünümü
- Aylık takvim
- Günlük reklam sayısı göstergesi
- Renk kodlu firma gösterimi
- Tıklanabilir günler

### 2. Zamanlama Oluşturma
- Tarih aralığı seçimi (1 aylık)
- Gün seçimi (Pazartesi-Pazar)
- Saat aralığı seçimi
- Firma seçimi
- Reklam seçimi veya Google Ads

### 3. Çakışma Kontrolü
- Aynı saatte birden fazla reklam uyarısı
- Öncelik sistemi
- Otomatik çakışma çözümü önerileri

### 4. Toplu İşlemler
- Haftalık tekrar
- Aylık tekrar
- Belirli günler için toplu zamanlama

---

## 🔐 Güvenlik

- Sadece ADMIN rolü erişebilir
- JWT token kontrolü
- Rate limiting
- Audit log (kim ne zaman değişiklik yaptı)

---

## 📈 Monitoring

- Zamanlama oluşturma sayısı
- Çakışma sayısı
- Başarılı gösterim oranı
- Hata oranları

