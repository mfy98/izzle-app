# CDN Kurulum Rehberi

> **Not:** MVP için CDN opsiyoneldir. S3/MinIO direkt erişim yeterlidir.
> Büyüme sonrası (10K+ kullanıcı) Cloudflare Free CDN eklenebilir.

## 🌐 CDN Kurulumu

### Ne Zaman CDN Kullanılmalı?

- ✅ **10K+ kullanıcı** - Cloudflare Free yeterli
- ✅ **100K+ kullanıcı** - CloudFront gerekli
- ❌ **MVP (< 10K kullanıcı)** - CDN gereksiz, S3/MinIO direkt erişim

---

## 1. Cloudflare CDN Setup (Önerilen - Free Tier)

### A. Cloudflare Account & API Token

1. Cloudflare hesabı oluştur
2. API Token oluştur:
   - Permissions: Zone > Zone Settings > Edit
   - Zone > Zone > Read

### B. Cloudflare CDN Configuration

```yaml
# application-storage.yml
cdn:
  enabled: true
  provider: cloudflare
  cloudflare:
    domain: cdn.cursorraffle.com
    zone-id: ${CDN_CLOUDFLARE_ZONE_ID}
    api-token: ${CDN_CLOUDFLARE_API_TOKEN}
```

### C. Cloudflare CDN Service

CDN sadece URL generation için kullanılır. Dosya yükleme yapılmaz!

```java
@Service
@Slf4j
public class CdnService {
    
    @Value("${cdn.enabled:false}")
    private boolean cdnEnabled;
    
    @Value("${cdn.cloudflare.domain:}")
    private String cloudflareDomain;
    
    /**
     * S3 URL'den CDN URL oluştur
     * CDN, S3'ü origin olarak kullanır
     */
    public String generateCdnUrl(String s3Url) {
        if (!cdnEnabled) {
            return s3Url; // CDN yok, direkt S3 URL
        }
        
        String key = extractKeyFromS3Url(s3Url);
        return String.format("https://%s/%s", cloudflareDomain, key);
    }
}
```

---

## 2. AWS CloudFront Setup (Büyük Ölçek)

### A. CloudFront Distribution Oluşturma

1. AWS Console → CloudFront
2. Create Distribution
3. Origin: S3 bucket
4. Default Cache Behavior: Cache Policy

### B. CloudFront Configuration

```yaml
# application-storage.yml
cdn:
  enabled: true
  provider: cloudfront
  cloudfront:
    domain: d1234567890.cloudfront.net
    distribution-id: ${CDN_CLOUDFRONT_DISTRIBUTION_ID}
    access-key-id: ${CDN_CLOUDFRONT_ACCESS_KEY_ID}
    secret-access-key: ${CDN_CLOUDFRONT_SECRET_ACCESS_KEY}
```

---

## 3. CDN Kullanımı

### Backend'de CDN URL Generation

```java
@Service
public class AdUploadService {
    
    private final S3Service s3Service;
    private final CdnService cdnService;
    
    public Ad approveAd(String adId) {
        // 1. S3'ü public yap
        Ad ad = adRepository.findById(adId);
        s3Service.makeObjectPublic(ad.getSourceUrl());
        
        // 2. CDN URL oluştur (opsiyonel)
        String cdnUrl = cdnService.generateCdnUrl(ad.getSourceUrl());
        ad.setCdnUrl(cdnUrl);
        
        // 3. Database'e kaydet
        adRepository.save(ad);
        
        return ad;
    }
}
```

### Frontend'de CDN URL Kullanımı

```typescript
// CDN URL varsa kullan, yoksa S3 URL
const adUrl = ad.cdnUrl || ad.sourceUrl;
```

---

## 4. Cache Invalidation

### Cloudflare Cache Purge

```java
public void invalidateCache(String cdnUrl) {
    if (!cdnEnabled) {
        return;
    }
    
    // Cloudflare API ile cache purge
    // NOT: Bu işlem pahalı olabilir, sadece gerektiğinde kullan
}
```

### CloudFront Cache Invalidation

```java
public void invalidateCloudFrontCache(String path) {
    // CloudFront invalidation API
    // NOT: Bu işlem pahalı ($0.005/invalidation), sadece gerektiğinde kullan
}
```

---

## 5. Best Practices

### ✅ Yapılması Gerekenler

1. **CDN sadece delivery için** - Upload yapma
2. **S3/MinIO origin olarak kullan** - CDN S3'ü cache'ler
3. **Cache TTL ayarla** - 24 saat yeterli
4. **CDN opsiyonel** - MVP için gerekli değil

### ❌ Yapılmaması Gerekenler

1. **CDN'e direkt upload yapma** - S3'e yükle, CDN cache'ler
2. **Gereksiz cache invalidation** - Pahalı
3. **MVP'de CDN kullanma** - Gereksiz maliyet

---

## 6. Maliyet Karşılaştırması

| Senaryo | CDN | Aylık Maliyet |
|---------|-----|---------------|
| MVP (< 10K) | ❌ Yok | $0 |
| Orta (10K-100K) | ✅ Cloudflare Free | $0 |
| Büyük (> 100K) | ✅ CloudFront | $50-200 |

---

## 7. Kurulum Adımları

### Cloudflare Free CDN (Önerilen)

1. Cloudflare hesabı oluştur
2. Domain ekle (veya subdomain)
3. DNS ayarları yap
4. `application-storage.yml`'de CDN enabled: true
5. Restart backend

### CloudFront (Büyük Ölçek)

1. AWS S3 bucket oluştur
2. CloudFront distribution oluştur
3. Origin olarak S3'i seç
4. `application-storage.yml`'de CloudFront config
5. Restart backend

---

## 📋 Özet

- ✅ **MVP için CDN gereksiz** - S3/MinIO direkt erişim
- ✅ **Büyüme sonrası Cloudflare Free** - Ücretsiz ve yeterli
- ✅ **CDN sadece delivery** - Upload yapma
- ✅ **S3 origin olarak** - CDN S3'ü cache'ler


