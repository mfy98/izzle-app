# Production Setup Guide

Bu doküman, production ortamında Docker Compose ile uygulamayı çalıştırmak için gerekli adımları içerir.

## Sunucu Bilgileri

- **IP Adresi**: 31.97.126.71
- **Domain**: srv1140142.hstgr.cloud

## Ön Gereksinimler

1. Docker ve Docker Compose yüklü olmalı
2. Sunucuda gerekli portlar açık olmalı:
   - 80 (HTTP - Frontend)
   - 443 (HTTPS - Frontend, opsiyonel)
   - 8080 (Backend API)
   - 5432 (PostgreSQL - sadece localhost, opsiyonel)

## Kurulum Adımları

### 1. Environment Variables Dosyası Oluştur

Production için `.env.prod` dosyası oluştur:

```bash
# .env.prod dosyası
POSTGRES_DB=cursor_raffle
POSTGRES_USER=postgres
POSTGRES_PASSWORD=GÜÇLÜ_ŞİFRE_BURAYA

SPRING_SECURITY_JWT_SECRET=GÜÇLÜ_SECRET_KEY_BURAYA
SPRING_SECURITY_JWT_EXPIRATION=86400000
SPRING_SECURITY_JWT_REFRESH_EXPIRATION=604800000

MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=GÜÇLÜ_ŞİFRE_BURAYA
STORAGE_S3_BUCKET=cursor-raffle-ads

GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=GÜÇLÜ_ŞİFRE_BURAYA

CORS_ORIGINS=http://srv1140142.hstgr.cloud,http://31.97.126.71,https://srv1140142.hstgr.cloud

EXPO_PUBLIC_API_URL=http://31.97.126.71:8080/api

LOG_LEVEL=INFO
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```

**ÖNEMLİ**: 
- Tüm şifreleri güçlü değerlerle değiştirin
- `SPRING_SECURITY_JWT_SECRET` için en az 64 karakterlik rastgele bir string kullanın
- Production'da `SPRING_JPA_HIBERNATE_DDL_AUTO` değeri `validate` veya `none` olmalı, asla `update` veya `create` kullanmayın

### 2. JWT Secret Oluştur

Güçlü bir JWT secret oluşturmak için:

```bash
openssl rand -base64 64
```

### 3. Docker Compose ile Başlat

```bash
# Environment dosyasını yükle ve compose'u çalıştır
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

### 4. Servisleri Kontrol Et

```bash
# Tüm servislerin durumunu kontrol et
docker-compose -f docker-compose.prod.yml ps

# Logları kontrol et
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Health Check

```bash
# Backend health check
curl http://31.97.126.71:8080/actuator/health

# Frontend kontrol
curl http://31.97.126.71:80
```

## Servis Erişim Bilgileri

### Public Erişim (Dışarıdan Erişilebilir)

- **Frontend**: http://31.97.126.71:80 veya http://srv1140142.hstgr.cloud:80
- **Backend API**: http://31.97.126.71:8080/api

### Localhost Erişim (Sadece Sunucu İçinden)

- **PostgreSQL**: localhost:5432
- **MinIO Console**: localhost:9001
- **MinIO API**: localhost:9000
- **Prometheus**: localhost:9090
- **Grafana**: localhost:3001
- **Alertmanager**: localhost:9093
- **Postgres Exporter**: localhost:9187
- **Node Exporter**: localhost:9100

## Güvenlik Notları

1. **Firewall Ayarları**: Sadece gerekli portları (80, 443, 8080) dışarıya açın
2. **Database**: PostgreSQL sadece localhost'a bind edilmiş (127.0.0.1:5432)
3. **Monitoring**: Tüm monitoring servisleri sadece localhost'a bind edilmiş
4. **MinIO**: MinIO console ve API sadece localhost'a bind edilmiş
5. **Şifreler**: Tüm şifreleri güçlü değerlerle değiştirin
6. **HTTPS**: Production'da mutlaka HTTPS kullanın (Nginx reverse proxy önerilir)

## Nginx Reverse Proxy Örneği (Opsiyonel)

HTTPS için Nginx reverse proxy kullanabilirsiniz:

```nginx
server {
    listen 80;
    server_name srv1140142.hstgr.cloud;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name srv1140142.hstgr.cloud;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Backup

Otomatik backup servisi günlük olarak çalışır. Backup dosyaları `./backup/wal_archive` dizininde saklanır.

Manuel backup için:

```bash
docker-compose -f docker-compose.prod.yml exec postgres-backup /backup/postgres-backup.sh backup
```

## Monitoring

- **Grafana**: http://localhost:3001 (admin/admin - şifreyi değiştirin)
- **Prometheus**: http://localhost:9090
- **Alertmanager**: http://localhost:9093

## Troubleshooting

### Servisler Başlamıyor

```bash
# Logları kontrol et
docker-compose -f docker-compose.prod.yml logs [service-name]

# Servisleri yeniden başlat
docker-compose -f docker-compose.prod.yml restart [service-name]
```

### Database Bağlantı Sorunu

```bash
# PostgreSQL loglarını kontrol et
docker-compose -f docker-compose.prod.yml logs postgres

# Database'e bağlan
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d cursor_raffle
```

### Port Çakışması

Eğer portlar kullanılıyorsa, `docker-compose.prod.yml` dosyasındaki port mapping'leri değiştirin.

## Güncelleme

Yeni bir versiyon deploy etmek için:

```bash
# Servisleri durdur
docker-compose -f docker-compose.prod.yml down

# Yeni image'ları build et
docker-compose -f docker-compose.prod.yml build

# Servisleri başlat
docker-compose -f docker-compose.prod.yml up -d
```

## Durdurma

```bash
# Servisleri durdur (veriler korunur)
docker-compose -f docker-compose.prod.yml stop

# Servisleri durdur ve container'ları kaldır (veriler korunur)
docker-compose -f docker-compose.prod.yml down

# Servisleri durdur, container'ları kaldır ve volume'leri sil (DİKKAT: Veriler silinir!)
docker-compose -f docker-compose.prod.yml down -v
```

