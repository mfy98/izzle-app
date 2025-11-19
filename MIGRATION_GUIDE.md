# 🚀 Mimari Güncelleme - Migration Rehberi

## 📋 Özet

Kodlar önerilen mimariye göre güncellendi. Artık:
- ✅ CDN'e direkt upload YOK
- ✅ S3/MinIO source of truth
- ✅ CDN sadece delivery için (opsiyonel)
- ✅ Spring Events event handling için

---

## 🔄 Migration Adımları

### 1. Database Migration

```sql
-- Yeni kolonlar ekle
ALTER TABLE ads ADD COLUMN IF NOT EXISTS source_url VARCHAR(500);
ALTER TABLE ads ADD COLUMN IF NOT EXISTS cdn_url VARCHAR(500);
ALTER TABLE ads ADD COLUMN IF NOT EXISTS upload_status VARCHAR(20);

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_ads_upload_status ON ads(upload_status);

-- Mevcut reklamlar için default değerler
UPDATE ads 
SET upload_status = CASE 
    WHEN is_approved = true THEN 'APPROVED'
    ELSE 'PENDING'
END
WHERE upload_status IS NULL;

-- Mevcut videoUrl'leri sourceUrl'e kopyala (backward compatibility)
UPDATE ads 
SET source_url = video_url 
WHERE source_url IS NULL AND video_url IS NOT NULL;
```

### 2. MinIO Kurulumu

```bash
# Docker Compose ile başlat
docker-compose -f docker-compose.storage.yml up -d

# MinIO Console'a eriş
# http://localhost:9001
# Login: minioadmin / minioadmin123

# Bucket oluştur (otomatik oluşturulabilir)
# Bucket name: cursor-raffle-ads
```

### 3. Backend Konfigürasyonu

`application.yml` veya `application-storage.yml` dosyasına ekle:

```yaml
storage:
  s3:
    endpoint: http://localhost:9000
    access-key: minioadmin
    secret-key: minioadmin123
    bucket: cursor-raffle-ads
    region: us-east-1

cdn:
  enabled: true
  provider: cloudflare
  cloudflare:
    domain: cdn.cursorraffle.com
```

### 4. Maven Dependencies

```bash
cd backend
mvn clean install
```

AWS SDK dependency otomatik eklenecek.

### 5. CDN Setup (Cloudflare)

1. Cloudflare hesabı oluştur
2. DNS → CNAME ekle:
   - Name: `cdn`
   - Target: `minio.cursorraffle.com` (veya S3 endpoint)
3. Cloudflare → Origin olarak S3/MinIO yapılandır

---

## 🔧 Test

### 1. MinIO Test

```bash
# MinIO health check
curl http://localhost:9000/minio/health/live

# Bucket list
curl http://localhost:9000 \
  -H "Authorization: AWS minioadmin:minioadmin123"
```

### 2. Upload Test

```bash
# Reklam upload
curl -X POST http://localhost:8080/api/advertiser/ads/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@test-video.mp4" \
  -F "title=Test Ad" \
  -F "adType=SPONSOR" \
  -F "startDate=2024-01-01T00:00:00" \
  -F "endDate=2024-01-31T23:59:59"
```

### 3. Admin Approval Test

```bash
# Admin onayı
curl -X POST http://localhost:8080/api/admin/ads/{adId}/approve \
  -H "Authorization: Bearer <admin-token>"
```

---

## ⚠️ Breaking Changes

### 1. Ad Entity
- Yeni kolonlar: `sourceUrl`, `cdnUrl`, `uploadStatus`
- Mevcut `videoUrl`, `bannerUrl` hala çalışıyor (backward compatibility)

### 2. API Changes
- Yeni endpoint: `POST /api/advertiser/ads/upload`
- Yeni endpoint: `POST /api/admin/ads/{id}/approve`
- Yeni endpoint: `POST /api/admin/ads/{id}/reject`

### 3. Response Changes
- `AdUploadResponse.adId` artık `String` (önceden `Long` değildi, yeni field)

---

## 📊 Rollback Plan

Eğer sorun olursa:

1. **Database Rollback:**
```sql
-- Yeni kolonları kaldır (dikkatli!)
ALTER TABLE ads DROP COLUMN IF EXISTS source_url;
ALTER TABLE ads DROP COLUMN IF EXISTS cdn_url;
ALTER TABLE ads DROP COLUMN IF EXISTS upload_status;
```

2. **Code Rollback:**
- Eski commit'e dön
- `pom.xml`'den AWS SDK'yı kaldır

---

## ✅ Checklist

- [ ] Database migration çalıştırıldı
- [ ] MinIO kuruldu ve çalışıyor
- [ ] Backend konfigürasyonu yapıldı
- [ ] Maven dependencies yüklendi
- [ ] Upload test başarılı
- [ ] Admin approval test başarılı
- [ ] CDN URL generation test başarılı
- [ ] Production'da CDN setup yapıldı

---

## 🎯 Sonuç

Tüm kodlar önerilen mimariye göre güncellendi:
- ✅ S3/MinIO source of truth
- ✅ CDN sadece delivery
- ✅ Basit ve maliyet-etkin mimari

Migration tamamlandı! 🚀

