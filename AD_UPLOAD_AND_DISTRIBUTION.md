# Reklam Upload ve Dağıtım Sistemi

## 📋 Genel Bakış

Sistem, reklam verenlerin kendi reklamlarını yükleyebilmesini ve yoksa Google Ads'ten otomatik reklam gösterimini sağlar. Spring Events ve CDN entegrasyonu ile ölçeklenebilir bir dağıtım altyapısı sunar.

---

## 🎯 1. Reklam Upload Sistemi

### Advertiser Upload Flow

```
1. Advertiser → Reklam Upload Sayfası
2. Video/Image Dosyası Seçimi
3. Dosya Validasyonu (format, boyut, süre)
4. Backend'e Upload (Multipart Form Data)
5. Backend → Dosyayı Geçici Depolamaya Alır
6. Admin Onayı Beklenir
7. Onay Sonrası → S3 Public Yapılır
8. Spring Event: AdUploaded
9. CDN URL oluşturulur (opsiyonel)
10. Database'e kaydedilir
```

### File Upload Component

**Özellikler:**
- Video formatları: MP4, MOV, AVI
- Image formatları: JPG, PNG, WebP
- Max dosya boyutu: 100MB (video), 10MB (image)
- Video süre limiti: 30 saniye - 5 dakika
- Progress indicator
- Preview özelliği
- Drag & drop (web için)

### Backend Upload Endpoint

```java
POST /api/advertiser/ads/upload
Content-Type: multipart/form-data

Request:
- file: File
- title: String
- description: String
- duration: Integer (video için)
- adType: AdType
- startDate: LocalDateTime
- endDate: LocalDateTime
```

---

## 🔄 2. Google Ads Entegrasyonu

### Fallback Mekanizması

```
1. Kullanıcı Reklam İzlemek İster
2. Sistem Aktif Reklamları Kontrol Eder
3. Eğer Custom Reklam Yoksa:
   a. Google Ads API'ye İstek Gönderilir
   b. Reklam Alınır
   c. Geçici Olarak Cache'lenir
   d. Kullanıcıya Gösterilir
4. İzlenme Kaydedilir
```

### Google Ads API Integration

**Kullanılan API:**
- Google AdMob API (Mobile ads)
- Google Ads API (Web ads)

**Özellikler:**
- Interstitial ads (tam ekran)
- Rewarded ads (ödüllü)
- Banner ads
- Native ads

### Adapter Pattern

```java
interface AdProvider {
    Ad fetchAd(String adUnitId);
    void recordImpression(String adId);
    void recordClick(String adId);
}

class GoogleAdsProvider implements AdProvider {
    // Google Ads implementation
}

class CustomAdsProvider implements AdProvider {
    // Custom ads implementation
}

class AdProviderFactory {
    AdProvider getProvider(boolean useGoogleAds) {
        return useGoogleAds ? new GoogleAdsProvider() : new CustomAdsProvider();
    }
}
```

---

## 🚀 3. Kafka Sistemi

### Architecture

```
Producer (Backend) → Kafka Topic → Consumer (Ad Distribution Service) → CDN
```

### Topics

1. **ad-uploaded**: Yeni reklam yüklendiğinde
2. **ad-approved**: Reklam onaylandığında
3. **ad-scheduled**: Zamanlama oluşturulduğunda
4. **ad-distribution**: CDN'e dağıtım komutu
5. **ad-view-recorded**: Reklam izlenme kaydı

### Producer Implementation

```java
@Service
public class KafkaAdProducer {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    public void sendAdUploadedEvent(AdUploadedEvent event) {
        kafkaTemplate.send("ad-uploaded", event);
    }
    
    public void sendAdDistributionCommand(AdDistributionCommand command) {
        kafkaTemplate.send("ad-distribution", command);
    }
}
```

### Consumer Implementation

```java
@Component
public class KafkaAdConsumer {
    
    @KafkaListener(topics = "ad-distribution")
    public void handleAdDistribution(AdDistributionCommand command) {
        // CDN'e reklam yükle
        cdnService.uploadAd(command.getAdId(), command.getFileUrl());
    }
    
    @KafkaListener(topics = "ad-scheduled")
    public void handleAdScheduled(AdScheduledEvent event) {
        // Zamanlanmış reklamı aktif et
        adService.activateScheduledAd(event.getScheduleId());
    }
}
```

### Event Schemas

```json
// AdUploadedEvent
{
  "adId": "123",
  "advertiserId": "456",
  "fileUrl": "s3://bucket/ad.mp4",
  "uploadedAt": "2024-01-15T10:00:00Z"
}

// AdDistributionCommand
{
  "adId": "123",
  "sourceUrl": "s3://bucket/ad.mp4",
  "targetCdn": "cloudflare",
  "priority": "high"
}
```

---

## 🌐 4. CDN Entegrasyonu

### CDN Provider Seçimi

**Önerilen:**
- Cloudflare (Global CDN)
- AWS CloudFront (AWS entegrasyonu)
- Google Cloud CDN (GCP entegrasyonu)

### CDN Service Implementation

```java
@Service
public class CdnService {
    
    @Value("${cdn.provider}")
    private String cdnProvider;
    
    public String uploadAd(String adId, String sourceUrl) {
        switch (cdnProvider) {
            case "cloudflare":
                return cloudflareCdn.upload(sourceUrl, adId);
            case "cloudfront":
                return cloudFrontCdn.upload(sourceUrl, adId);
            default:
                return defaultCdn.upload(sourceUrl, adId);
        }
    }
    
    public void invalidateCache(String adId) {
        // Cache invalidation
    }
}
```

### CDN Configuration

**Cloudflare:**
- Stream API (Video streaming)
- Images API (Image optimization)
- Cache Rules
- Custom Domain

**AWS CloudFront:**
- S3 Origin
- Signed URLs
- CloudFront Functions
- Cache Behaviors

### Video Streaming

```java
// Adaptive Bitrate Streaming
public class VideoStreamingService {
    
    public VideoManifest generateManifest(String videoId) {
        // HLS/DASH manifest oluştur
        return VideoManifest.builder()
            .masterPlaylist(createMasterPlaylist(videoId))
            .variants(createVariants(videoId))
            .build();
    }
    
    private List<VideoVariant> createVariants(String videoId) {
        return Arrays.asList(
            createVariant(videoId, "1080p", 5000),
            createVariant(videoId, "720p", 3000),
            createVariant(videoId, "480p", 1500)
        );
    }
}
```

---

## 📊 5. Sistem Akışı Detayları

### Reklam Upload Akışı

```
1. Advertiser → Upload Component
   ↓
2. File Validation (Frontend)
   ↓
3. Upload to Backend (Multipart)
   ↓
4. Backend → Temporary Storage (S3/MinIO)
   ↓
5. Admin Notification (Kafka: ad-uploaded)
   ↓
6. Admin Approval
   ↓
7. Kafka: ad-approved
   ↓
8. CDN Upload Service
   ↓
9. CDN URL Generation
   ↓
10. Database Update
   ↓
11. Kafka: ad-distribution (success)
```

### Reklam Gösterim Akışı

```
1. User → Watch Ad Request
   ↓
2. Backend → Check Active Ads
   ↓
3. Custom Ad Available?
   ├─ Yes → Return Custom Ad
   └─ No → Google Ads API Call
       ↓
4. Google Ads Response
   ↓
5. Cache Google Ad (Redis, 1 hour)
   ↓
6. Return Ad to User
   ↓
7. User Views Ad
   ↓
8. Kafka: ad-view-recorded
   ↓
9. Analytics Update
```

### Zamanlanmış Reklam Akışı

```
1. Admin → Create Schedule
   ↓
2. Schedule Saved to DB
   ↓
3. Kafka: ad-scheduled
   ↓
4. Schedule Consumer
   ↓
5. Check Current Time
   ↓
6. Time Matches?
   ├─ Yes → Activate Ad
   └─ No → Wait
   ↓
7. Kafka: ad-activated
   ↓
8. CDN Cache Warm-up
   ↓
9. Ad Available for Users
```

---

## 🔧 6. Teknik Detaylar

### Kafka Configuration

```yaml
# application.yml
spring:
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all
      retries: 3
    consumer:
      group-id: ad-distribution-service
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      auto-offset-reset: earliest
```

### CDN Configuration

```yaml
cdn:
  provider: cloudflare
  cloudflare:
    api-token: ${CLOUDFLARE_API_TOKEN}
    account-id: ${CLOUDFLARE_ACCOUNT_ID}
    zone-id: ${CLOUDFLARE_ZONE_ID}
  cloudfront:
    distribution-id: ${CLOUDFRONT_DISTRIBUTION_ID}
    access-key-id: ${AWS_ACCESS_KEY_ID}
    secret-access-key: ${AWS_SECRET_ACCESS_KEY}
```

### Google Ads Configuration

```yaml
google:
  ads:
    application-name: CursorRaffle
    developer-token: ${GOOGLE_ADS_DEVELOPER_TOKEN}
    client-id: ${GOOGLE_ADS_CLIENT_ID}
    client-secret: ${GOOGLE_ADS_CLIENT_SECRET}
    refresh-token: ${GOOGLE_ADS_REFRESH_TOKEN}
  admob:
    app-id: ${ADMOB_APP_ID}
    ad-unit-id-interstitial: ${ADMOB_INTERSTITIAL_AD_UNIT_ID}
    ad-unit-id-rewarded: ${ADMOB_REWARDED_AD_UNIT_ID}
```

---

## 📈 7. Monitoring ve Logging

### Metrics

- Upload success rate
- CDN upload duration
- Kafka message processing time
- Google Ads fallback rate
- Cache hit rate

### Logging

```java
@Slf4j
public class AdUploadService {
    
    public void uploadAd(AdUploadRequest request) {
        log.info("Ad upload started: advertiserId={}, fileName={}", 
            request.getAdvertiserId(), request.getFileName());
        
        try {
            // Upload logic
            log.info("Ad uploaded successfully: adId={}", adId);
        } catch (Exception e) {
            log.error("Ad upload failed: advertiserId={}, error={}", 
                request.getAdvertiserId(), e.getMessage(), e);
        }
    }
}
```

---

## 🚨 8. Error Handling

### Retry Mechanism

```java
@Retryable(value = {CdnUploadException.class}, maxAttempts = 3)
public String uploadToCdn(String fileUrl) {
    // CDN upload with retry
}
```

### Fallback Strategy

```java
public Ad getAdForUser(String userId) {
    // Try custom ad first
    Ad customAd = adRepository.findActiveAd();
    if (customAd != null) {
        return customAd;
    }
    
    // Fallback to Google Ads
    try {
        return googleAdsService.fetchAd();
    } catch (Exception e) {
        log.error("Google Ads fetch failed", e);
        // Return default ad or error
        return getDefaultAd();
    }
}
```

---

## 🔐 9. Security

### File Upload Security

- File type validation
- File size limits
- Virus scanning (ClamAV)
- Content moderation
- Rate limiting

### CDN Security

- Signed URLs
- Token-based access
- IP whitelisting
- CORS configuration
- DDoS protection

---

## 📝 10. Database Schema Updates

```sql
-- Ad upload tracking
ALTER TABLE ads ADD COLUMN upload_status VARCHAR(20);
ALTER TABLE ads ADD COLUMN cdn_url VARCHAR(500);
ALTER TABLE ads ADD COLUMN source_url VARCHAR(500);
ALTER TABLE ads ADD COLUMN use_google_ads BOOLEAN DEFAULT false;
ALTER TABLE ads ADD COLUMN google_ad_unit_id VARCHAR(100);

-- Upload history
CREATE TABLE ad_uploads (
    id BIGSERIAL PRIMARY KEY,
    ad_id BIGINT REFERENCES ads(id),
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(50),
    upload_status VARCHAR(20),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    error_message TEXT
);
```

---

Bu sistem, ölçeklenebilir, güvenilir ve performanslı bir reklam dağıtım altyapısı sağlar! 🚀

