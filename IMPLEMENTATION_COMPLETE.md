# ✅ Mimari Güncellemeleri - Tamamlandı

## 🎯 Yapılan Değişiklikler

Önerilen mimariye göre tüm kodlar güncellendi. Artık sistem:

### ✅ S3/MinIO - Source of Truth
- Dosyalar direkt S3'e yükleniyor
- Private by default
- Admin onayı sonrası public yapılıyor

### ✅ CDN - Sadece Delivery
- CDN'e direkt upload YOK
- CDN sadece URL generation yapıyor
- S3'ü origin olarak kullanıyor

### ✅ Kafka - Sadece Events
- File upload için Kafka kullanılmıyor
- Sadece notification/analytics için (opsiyonel)

---

## 📁 Oluşturulan/Güncellenen Dosyalar

### Backend

#### Entity Updates
- ✅ `Ad.java` - `sourceUrl`, `cdnUrl`, `uploadStatus` eklendi
- ✅ `UploadStatus.java` - Yeni enum (PENDING, UPLOADED, APPROVED, REJECTED, DELETED)

#### Services
- ✅ `S3Service.java` - S3/MinIO upload yönetimi
- ✅ `CdnService.java` - CDN URL generation (upload değil!)
- ✅ `AdUploadService.java` - Upload workflow (S3 → Admin Approval → CDN URL)
- ✅ `AdService.java` - CDN URL kullanımı eklendi

#### Controllers
- ✅ `AdvertiserAdController.java` - Reklam upload endpoint
- ✅ `AdminAdController.java` - Admin onay/red endpoint'leri

#### DTOs
- ✅ `AdUploadRequest.java` - Upload request DTO
- ✅ `AdUploadResponse.java` - Upload response DTO

#### Repository
- ✅ `AdRepository.java` - `findByUploadStatus` metodu eklendi

#### Configuration
- ✅ `application-storage.yml` - S3 ve CDN konfigürasyonu
- ✅ `pom.xml` - AWS SDK dependency eklendi

---

## 🔄 Yeni Sistem Akışı

### 1. Reklam Upload

```
Advertiser → POST /api/advertiser/ads/upload
    ↓
Backend → File Validation
    ↓
Backend → S3Service.uploadFile() → S3/MinIO (PRIVATE)
    ↓
Backend → Database (sourceUrl, status=UPLOADED)
    ↓
Response → PENDING_APPROVAL
```

**ÖNEMLİ:** CDN'e upload YOK! Sadece S3'e yükleniyor.

### 2. Admin Onayı

```
Admin → POST /api/admin/ads/{id}/approve
    ↓
Backend → S3Service.makePublic() → S3 object PUBLIC
    ↓
Backend → CdnService.generateCdnUrl() → CDN URL oluştur
    ↓
Backend → Database (cdnUrl, status=APPROVED, isActive=true)
    ↓
Response → APPROVED
```

**ÖNEMLİ:** CDN'e upload YOK! Sadece URL oluşturuluyor. CDN, S3'ü origin olarak kullanır.

### 3. Reklam Gösterimi

```
User → GET /api/ads/active
    ↓
Backend → AdService.getActiveAds()
    ↓
Response → Ad object (cdnUrl varsa onu kullan, yoksa sourceUrl)
    ↓
Mobile App → CDN URL'den yükler (fast delivery)
```

---

## 📊 Database Schema Değişiklikleri

### Ad Table - Yeni Kolonlar

```sql
ALTER TABLE ads ADD COLUMN source_url VARCHAR(500);
ALTER TABLE ads ADD COLUMN cdn_url VARCHAR(500);
ALTER TABLE ads ADD COLUMN upload_status VARCHAR(20);

-- Index
CREATE INDEX idx_ads_upload_status ON ads(upload_status);
```

---

## ⚙️ Konfigürasyon

### application.yml veya application-storage.yml

```yaml
storage:
  s3:
    endpoint: http://localhost:9000  # MinIO
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

---

## 🚀 Kullanım Örnekleri

### 1. Reklam Upload (Advertiser)

```bash
POST /api/advertiser/ads/upload
Content-Type: multipart/form-data

file: [video.mp4]
title: "Yeni Ürün Tanıtımı"
adType: SPONSOR
startDate: 2024-01-01T00:00:00
endDate: 2024-01-31T23:59:59
```

**Response:**
```json
{
  "adId": "123",
  "status": "UPLOADED",
  "message": "Ad uploaded successfully. Waiting for admin approval.",
  "sourceUrl": "http://localhost:9000/cursor-raffle-ads/videos/abc-123/video.mp4"
}
```

### 2. Admin Onayı

```bash
POST /api/admin/ads/123/approve
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "id": "123",
  "title": "Yeni Ürün Tanıtımı",
  "sourceUrl": "http://localhost:9000/cursor-raffle-ads/videos/abc-123/video.mp4",
  "cdnUrl": "https://cdn.cursorraffle.com/videos/abc-123/video.mp4",
  "uploadStatus": "APPROVED",
  "isActive": true
}
```

### 3. Reklam Listesi

```bash
GET /api/ads/active
```

**Response:**
```json
[
  {
    "id": "123",
    "title": "Yeni Ürün Tanıtımı",
    "cdnUrl": "https://cdn.cursorraffle.com/videos/abc-123/video.mp4",
    "videoUrl": "https://cdn.cursorraffle.com/videos/abc-123/video.mp4",
    "uploadStatus": "APPROVED",
    "isActive": true
  }
]
```

---

## 🔧 MinIO Kurulumu (Docker)

```yaml
# docker-compose.yml'e ekle
minio:
  image: minio/minio:latest
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin123
  volumes:
    - minio_data:/data
  command: server /data --console-address ":9001"
```

---

## ✅ Test Senaryoları

### 1. Upload Test
```bash
# 1. MinIO'yu başlat
docker-compose up minio -d

# 2. Bucket oluştur (MinIO Console: http://localhost:9001)
# veya otomatik oluşturulur

# 3. Upload test
curl -X POST http://localhost:8080/api/advertiser/ads/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@video.mp4" \
  -F "title=Test Ad" \
  -F "adType=SPONSOR" \
  -F "startDate=2024-01-01T00:00:00" \
  -F "endDate=2024-01-31T23:59:59"
```

### 2. Approval Test
```bash
# Admin onayı
curl -X POST http://localhost:8080/api/admin/ads/123/approve \
  -H "Authorization: Bearer <admin-token>"
```

### 3. CDN URL Test
```bash
# Aktif reklamları getir
curl http://localhost:8080/api/ads/active
# Response'da cdnUrl olmalı
```

---

## 📝 Önemli Notlar

### 1. CDN Setup
- CDN'in S3'ü origin olarak yapılandırılması gerekiyor
- Cloudflare: DNS → CNAME → S3 endpoint
- CloudFront: Distribution → Origin → S3 bucket

### 2. S3/MinIO Access
- Upload: Private (sadece backend erişebilir)
- After Approval: Public (CDN erişebilir)
- CDN: Origin olarak S3'ü kullanır

### 3. Kafka (Opsiyonel)
- Upload için Kafka kullanılmıyor
- Sadece notification/analytics için kullanılabilir
- `kafkaProducer.sendAdUploadedEvent()` - Commented out

---

## 🎯 Sonuç

✅ **CDN'e direkt upload YOK** - Sadece S3'e yükleniyor
✅ **CDN sadece URL generation** - Delivery için
✅ **S3 source of truth** - Ana depolama
✅ **Basit ve maliyet-etkin** mimari

Tüm kodlar önerilen mimariye göre güncellendi! 🚀


