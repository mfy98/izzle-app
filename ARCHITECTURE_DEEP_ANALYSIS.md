# 🏗️ Mimari Derinlemesine Analiz - CDN ve Depolama Stratejisi

## 📊 Mevcut Mimari Analizi

### Mevcut Sistem Bileşenleri

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                            │
│  React Native (Expo) - Mobile App                           │
│  - Expo Router (Navigation)                                  │
│  - Zustand (State Management)                                │
│  - TanStack Query (Server State)                             │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ REST API
┌──────────────────────▼───────────────────────────────────────┐
│                    BACKEND LAYER                             │
│  Spring Boot (Java)                                          │
│  - REST Controllers                                           │
│  - Service Layer                                              │
│  - JPA Repositories                                           │
│  - JWT Authentication                                         │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│  PostgreSQL  │ │  Redis   │ │  External  │
│  Database    │ │  (Cache) │ │  Services  │
└──────────────┘ └───────────┘ └────────────┘
```

### Mevcut Özellikler
- ✅ User Management (Auth, Registration)
- ✅ Sprint System (Time-based raffles)
- ✅ Ad Viewing System
- ✅ Raffle System
- ✅ Advertiser Dashboard
- ✅ Monitoring (Prometheus, Grafana)
- ✅ Docker Compose Deployment

---

## 🤔 CDN Kullanımı - Mantıklı mı?

### ❌ CDN'e Direkt Yükleme - NEDEN MANTIKSIZ?

#### 1. **Maliyet Analizi**

**CDN'e Direkt Yükleme:**
```
Advertiser → Backend → CDN (Cloudflare Stream)
                      ↓
                  Video Processing
                      ↓
                  HLS Manifest
                      ↓
                  Storage (CDN)
```

**Sorunlar:**
- ❌ **Yüksek Maliyet**: Cloudflare Stream $1/1000 dakika + storage
- ❌ **Gereksiz İşlem**: Her reklam için video processing
- ❌ **Lock-in**: CDN provider'a bağımlılık
- ❌ **Kontrol Eksikliği**: Dosya yönetimi zor

**Örnek Maliyet (1000 reklam/gün, 30 saniye/reklam):**
- Video Processing: 1000 × 0.5 dk = 500 dk/gün = 15,000 dk/ay
- Cloudflare Stream: $15/ay (processing) + $5/ay (storage) = **$20/ay**
- Bandwidth: Ekstra maliyet

#### 2. **Mimari Sorunlar**

**Problem 1: Gereksiz Karmaşıklık**
```
Advertiser Upload → Backend → CDN Upload
                          ↓
                    Video Processing
                          ↓
                    HLS Conversion
                          ↓
                    Storage
```

**Daha Basit Alternatif:**
```
Advertiser Upload → Backend → S3/MinIO → Direct URL
```

**Problem 2: Latency**
- CDN Upload = 2-5 saniye gecikme
- Kullanıcı deneyimi için gereksiz

**Problem 3: Error Handling**
- CDN upload başarısız olursa?
- Retry mekanizması karmaşık
- Partial upload durumları

---

## ✅ ÖNERİLEN MİMARİ - 3 Katmanlı Depolama

### Mimari Önerisi

```
┌─────────────────────────────────────────────────────────────┐
│                    UPLOAD LAYER                              │
│  Advertiser → Backend → Object Storage (S3/MinIO)          │
│  - Direct upload                                             │
│  - Validation                                                │
│  - Metadata storage                                          │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ URL Reference
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    DELIVERY LAYER                           │
│  CDN (Cloudflare/CloudFront) - Sadece Delivery             │
│  - Origin: S3/MinIO                                         │
│  - Cache optimization                                        │
│  - Global distribution                                       │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Cached URL
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    CLIENT LAYER                             │
│  Mobile App → CDN URL → Fast Delivery                       │
└─────────────────────────────────────────────────────────────┘
```

### Katmanlar

#### 1. **Object Storage (S3/MinIO) - Source of Truth**
**Neden:**
- ✅ Düşük maliyet ($0.023/GB/ay S3)
- ✅ Yüksek dayanıklılık (99.999999999%)
- ✅ Kolay yönetim
- ✅ Direct upload desteği
- ✅ Versioning
- ✅ Lifecycle policies

**Kullanım:**
- Reklam dosyalarının asıl depolama yeri
- Database'de sadece URL referansı
- Admin onayı sonrası public yapılır

#### 2. **CDN (Cloudflare/CloudFront) - Delivery Only**
**Neden:**
- ✅ Global cache (düşük latency)
- ✅ Bandwidth optimizasyonu
- ✅ DDoS koruması
- ✅ SSL/TLS
- ✅ **Sadece delivery, storage değil**

**Kullanım:**
- S3'ten origin olarak çeker
- Cache'ler ve global dağıtır
- Video streaming için HLS/DASH

#### 3. **Backend - Orchestration**
**Neden:**
- ✅ Upload validation
- ✅ Admin approval workflow
- ✅ Metadata management
- ✅ URL generation

---

## 🎯 ÖNERİLEN MİMARİ DETAYLARI

### Senaryo 1: Reklam Upload (Basitleştirilmiş)

```
1. Advertiser → Upload Form
   ↓
2. Backend → File Validation
   ↓
3. Backend → Direct S3 Upload (Presigned URL)
   ↓
4. Backend → Save Metadata (DB)
   ↓
5. Admin Approval
   ↓
6. Backend → Make S3 Object Public
   ↓
7. Backend → Generate CDN URL (CloudFront signed URL)
   ↓
8. Database → Update with CDN URL
   ↓
9. Reklam Aktif
```

**Event Handling:**
- ✅ Spring Events + @Async kullanılıyor
- ✅ Analytics için yeterli
- ✅ Notification için yeterli

### Senaryo 2: Reklam Gösterimi

```
1. User → Watch Ad Request
   ↓
2. Backend → Get Active Ad
   ↓
3. Backend → Return CDN URL
   ↓
4. Mobile App → Load from CDN
   ↓
5. CDN → Cache Hit (Fast) veya Origin (S3)
   ↓
6. User Views Ad
   ↓
7. Backend → Record View (Spring Event)
```

---

## 💰 Maliyet Karşılaştırması

### Senaryo: 1000 reklam/gün, 30 saniye/reklam, 10MB/reklam

#### Seçenek 1: CDN'e Direkt Yükleme (Önceki Öneri)
```
Cloudflare Stream:
- Processing: 15,000 dk/ay × $1/1000 dk = $15/ay
- Storage: 300 GB × $5/100 GB = $15/ay
- Bandwidth: 10 TB × $0.10/GB = $1,000/ay
TOPLAM: ~$1,030/ay
```

#### Seçenek 2: S3 + CloudFront (Önerilen)
```
AWS S3:
- Storage: 300 GB × $0.023/GB = $6.90/ay
- PUT requests: 30,000 × $0.005/1000 = $0.15/ay

CloudFront:
- Origin requests: 1M × $0.0075/10k = $0.75/ay
- Data transfer: 10 TB × $0.085/GB = $850/ay

TOPLAM: ~$857.80/ay
```

**Tasarruf: ~$172/ay (%17)**

#### Seçenek 3: MinIO (Self-hosted) + Cloudflare CDN
```
MinIO (Self-hosted):
- Server: $20/ay (VPS)
- Storage: Included

Cloudflare CDN (Free tier):
- Bandwidth: Unlimited (Free)
- Cache: Unlimited

TOPLAM: ~$20/ay
```

**Tasarruf: ~$1,010/ay (%98)**

---

## 🏗️ ÖNERİLEN MİMARİ - DETAYLI

### 1. Upload Service

```java
@Service
public class AdUploadService {
    
    @Autowired
    private S3Service s3Service;
    
    @Autowired
    private CdnService cdnService;
    
    public AdUploadResponse uploadAd(MultipartFile file, AdUploadRequest request) {
        // 1. Validation
        validateFile(file);
        
        // 2. Generate unique key
        String key = "ads/" + UUID.randomUUID() + "/" + file.getOriginalFilename();
        
        // 3. Upload to S3 (direct, no processing)
        String s3Url = s3Service.uploadFile(key, file);
        
        // 4. Save metadata to DB
        Ad ad = Ad.builder()
            .title(request.getTitle())
            .sourceUrl(s3Url)  // S3 URL
            .cdnUrl(null)       // CDN URL (admin approval sonrası)
            .uploadStatus(UploadStatus.PENDING)
            .build();
        
        adRepository.save(ad);
        
        // 5. Notify admin (Spring Event)
        eventPublisher.publishEvent(new AdUploadedEvent(ad.getId()));
        
        return AdUploadResponse.builder()
            .adId(ad.getId())
            .status("PENDING_APPROVAL")
            .build();
    }
    
    @Transactional
    public void approveAd(Long adId) {
        Ad ad = adRepository.findById(adId).orElseThrow();
        
        // 1. Make S3 object public
        s3Service.makePublic(ad.getSourceUrl());
        
        // 2. Generate CDN URL (CloudFront signed URL)
        String cdnUrl = cdnService.generateUrl(ad.getSourceUrl());
        
        // 3. Update ad
        ad.setCdnUrl(cdnUrl);
        ad.setUploadStatus(UploadStatus.APPROVED);
        ad.setIsActive(true);
        
        adRepository.save(ad);
        
        // 4. Notify (Spring Event)
        eventPublisher.publishEvent(new AdApprovedEvent(adId));
    }
}
```

### 2. S3 Service (MinIO veya AWS S3)

```java
@Service
public class S3Service {
    
    @Value("${storage.s3.bucket}")
    private String bucketName;
    
    @Autowired
    private AmazonS3 s3Client;
    
    public String uploadFile(String key, MultipartFile file) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());
        
        PutObjectRequest request = new PutObjectRequest(
            bucketName, 
            key, 
            file.getInputStream(), 
            metadata
        );
        
        // Private by default
        request.setCannedAcl(CannedAccessControlList.Private);
        
        s3Client.putObject(request);
        
        return s3Client.getUrl(bucketName, key).toString();
    }
    
    public void makePublic(String s3Url) {
        String key = extractKeyFromUrl(s3Url);
        s3Client.setObjectAcl(bucketName, key, CannedAccessControlList.PublicRead);
    }
    
    public String generatePresignedUrl(String key, Duration expiration) {
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(
            bucketName, 
            key
        );
        request.setExpiration(Date.from(Instant.now().plus(expiration)));
        request.setMethod(HttpMethod.PUT);
        
        return s3Client.generatePresignedUrl(request).toString();
    }
}
```

### 3. CDN Service (Sadece URL Generation)

```java
@Service
public class CdnService {
    
    @Value("${cdn.cloudfront.distribution-id}")
    private String distributionId;
    
    @Value("${cdn.cloudfront.domain}")
    private String cdnDomain;
    
    @Autowired
    private CloudFrontUrlSigner urlSigner;
    
    /**
     * S3 URL'den CDN URL oluştur
     * CDN, S3'ü origin olarak kullanır
     */
    public String generateUrl(String s3Url) {
        // S3 URL'den key'i çıkar
        String key = extractKeyFromUrl(s3Url);
        
        // CloudFront URL oluştur
        String cdnUrl = String.format(
            "https://%s/%s",
            cdnDomain,
            key
        );
        
        // Signed URL (opsiyonel, güvenlik için)
        if (needsSigning()) {
            return urlSigner.getSignedUrl(cdnUrl, Duration.ofDays(365));
        }
        
        return cdnUrl;
    }
    
    /**
     * Cache invalidation (reklam güncellendiğinde)
     */
    public void invalidateCache(String cdnUrl) {
        String key = extractKeyFromUrl(cdnUrl);
        cloudFrontClient.createInvalidation(
            new CreateInvalidationRequest(
                distributionId,
                Arrays.asList("/" + key)
            )
        );
    }
}
```

---

## 🔄 Kafka Kullanımı - Sadece Gerektiğinde

### Kafka Ne Zaman Kullanılmalı?

#### ✅ Kullanılmalı:
1. **Analytics Events**
   - Reklam izlenme kayıtları
   - User behavior tracking
   - Real-time metrics

2. **Notifications**
   - Admin bildirimleri
   - User notifications

3. **Async Processing**
   - Heavy analytics
   - Report generation

#### ❌ Kullanılmamalı:
1. **File Upload**
   - Direct S3 upload daha hızlı
   - Kafka gereksiz overhead

2. **Simple CRUD**
   - Database operations
   - Synchronous işlemler

---

## 📊 Önerilen Mimari - Final

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Mobile App)                      │
│  - Expo AV (Video Player)                                   │
│  - Image Loading (expo-image)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       │ CDN URL
┌──────────────────────▼───────────────────────────────────────┐
│                    CDN (Cloudflare/CloudFront)               │
│  - Origin: S3/MinIO                                         │
│  - Cache: Global                                            │
│  - SSL/TLS: Automatic                                       │
│  - DDoS Protection                                          │
└──────────────────────┬───────────────────────────────────────┘
                       │ Cache Miss
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    OBJECT STORAGE                           │
│  - S3 (AWS) veya MinIO (Self-hosted)                       │
│  - Source of Truth                                          │
│  - Direct Upload                                            │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Metadata
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    BACKEND (Spring Boot)                    │
│  - Upload Service                                           │
│  - Approval Workflow                                        │
│  - URL Generation                                           │
│  - Metadata Management                                      │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│  PostgreSQL  │ │  Redis   │ │  External  │
│  (Metadata)  │ │ (Cache)  │ │  Services  │
└──────────────┘ └───────────┘ └────────────┘
```

---

## ✅ ÖNERİLER ÖZET

### 1. **CDN Kullanımı**
- ✅ **Sadece Delivery**: CDN sadece cache ve delivery için
- ❌ **Storage Değil**: CDN'e direkt upload yapma
- ✅ **Origin: S3/MinIO**: CDN'in origin'i object storage olsun

### 2. **Object Storage**
- ✅ **S3 veya MinIO**: Ana depolama
- ✅ **Direct Upload**: Presigned URL ile direkt yükleme
- ✅ **Lifecycle Policies**: Eski reklamları arşivle

### 3. **Event Handling**
- ✅ **Spring Events**: Analytics, notifications (MVP için yeterli)
- ❌ **Upload İçin Değil**: File upload için gereksiz

### 4. **Maliyet Optimizasyonu**
- ✅ **MinIO**: Self-hosted, düşük maliyet
- ✅ **Cloudflare Free**: CDN için ücretsiz tier
- ✅ **Lifecycle Policies**: Eski dosyaları arşivle

---

## 🚀 Uygulama Adımları

### 1. MinIO Kurulumu (Self-hosted)

```yaml
# docker-compose.yml
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

### 2. Cloudflare CDN Setup

```yaml
# application.yml
cdn:
  cloudflare:
    zone-id: ${CLOUDFLARE_ZONE_ID}
    api-token: ${CLOUDFLARE_API_TOKEN}
  origin:
    type: s3
    endpoint: ${MINIO_ENDPOINT}
    bucket: cursor-raffle-ads
```

### 3. Backend Implementation

- S3Service: MinIO/S3 upload
- CdnService: URL generation only
- Spring Events: Event handling (Kafka yerine)

---

## 📈 Sonuç

**CDN'e direkt yükleme MANTIKSIZ çünkü:**
1. ❌ Yüksek maliyet
2. ❌ Gereksiz karmaşıklık
3. ❌ Lock-in riski
4. ❌ Kontrol eksikliği

**Önerilen Mimari:**
1. ✅ S3/MinIO: Ana depolama (düşük maliyet)
2. ✅ CDN: Sadece delivery (cache + global distribution) - Opsiyonel
3. ✅ Spring Events: Event handling (analytics, notifications) - Kafka yerine
4. ✅ Backend: Orchestration (upload, approval, URL generation)

**Maliyet Tasarrufu:**
- CDN'e direkt: ~$1,030/ay
- S3 + CDN: ~$857/ay
- MinIO + Cloudflare: ~$20/ay

**Öneri: MinIO + Cloudflare CDN (Free tier) = En düşük maliyet + tam kontrol** 🎯

