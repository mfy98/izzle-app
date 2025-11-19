# 🚀 Projeyi Başlatma Rehberi

## 📋 Ön Gereksinimler

1. **Docker Desktop** - Çalışıyor olmalı
2. **Node.js 18+** - Frontend için
3. **Java 21** - Backend için (manuel başlatma)
4. **Maven 3.8+** - Backend için (manuel başlatma)

---

## 🐳 Docker Compose ile Başlatma (Önerilen)

### 1. Docker Desktop'ı Başlat

Windows'ta Docker Desktop'ı açın ve çalıştığından emin olun.

### 2. Servisleri Başlat

```bash
# Ana servisleri başlat
docker-compose up -d

# Storage servisini başlat (MinIO)
docker-compose -f docker-compose.storage.yml up -d

# Servisleri kontrol et
docker-compose ps
```

### 3. Servis Durumunu Kontrol Et

```bash
# Backend logları
docker-compose logs -f backend

# Frontend logları
docker-compose logs -f frontend

# Tüm servisler
docker-compose ps
```

### 4. Servislere Erişim

- **Backend API**: http://localhost:8080
- **Frontend Web**: http://localhost:8081
- **PostgreSQL**: localhost:5432
- **MinIO API**: http://localhost:9000
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin123)
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

---

## 🔧 Manuel Başlatma

### Backend

```bash
cd backend

# Dependencies yükle
mvn clean install

# Uygulamayı başlat
mvn spring-boot:run
```

**Backend çalışıyor mu kontrol et:**
```bash
curl http://localhost:8080/actuator/health
```

### Frontend

```bash
# Dependencies yükle
npm install

# Uygulamayı başlat
npm start
# veya
npx expo start
```

**Frontend erişim:**
- Web: http://localhost:8081
- Expo Dev Tools: http://localhost:19000

---

## ✅ Servis Kontrolleri

### Backend Health Check

```bash
# Health endpoint
curl http://localhost:8080/actuator/health

# Metrics
curl http://localhost:8080/actuator/metrics

# Prometheus metrics
curl http://localhost:8080/actuator/prometheus
```

### Frontend Kontrol

```bash
# Web sayfası
curl http://localhost:8081

# Expo dev server
curl http://localhost:19000
```

### Database Kontrol

```bash
# PostgreSQL bağlantısı
docker exec -it cursor-raffle-db psql -U postgres -d cursor_raffle

# Tabloları listele
\dt
```

### MinIO Kontrol

```bash
# MinIO console
# Tarayıcıda: http://localhost:9001
# Kullanıcı: minioadmin
# Şifre: minioadmin123
```

---

## 🧪 Test API Endpoints

### 1. Kullanıcı Kaydı

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456",
    "name": "Test",
    "surname": "User",
    "phone": "5551234567",
    "address": {
      "street": "Test Street",
      "district": "Test District",
      "city": "Istanbul",
      "postalCode": "34000",
      "country": "Turkey"
    },
    "confirmInformationAccuracy": true,
    "acceptKvkk": true
  }'
```

### 2. Giriş

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456"
  }'
```

**Response:**
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}
```

### 3. Aktif Sprint

```bash
curl http://localhost:8080/api/sprint/current \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Aktif Reklamlar

```bash
curl http://localhost:8080/api/ads/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Sorun Giderme

### Docker Desktop Çalışmıyor

```bash
# Docker Desktop'ı başlat
# Windows: Docker Desktop uygulamasını aç

# Docker durumunu kontrol et
docker ps
```

### Backend Başlamıyor

```bash
# Logları kontrol et
docker-compose logs backend

# Database bağlantısını kontrol et
docker-compose logs postgres

# Backend'i yeniden başlat
docker-compose restart backend
```

### Frontend Başlamıyor

```bash
# Logları kontrol et
docker-compose logs frontend

# Node modules'ü temizle
docker-compose exec frontend rm -rf node_modules
docker-compose restart frontend

# Manuel başlat
cd D:\Projects\CursorRaffle
npm install
npm start
```

### Port Çakışması

Eğer portlar kullanılıyorsa:

```bash
# Kullanan process'i bul
netstat -ano | findstr :8080
netstat -ano | findstr :8081

# Process'i sonlandır
taskkill /PID <PID> /F
```

---

## 📊 Monitoring

### Prometheus

- URL: http://localhost:9090
- Metrics: http://localhost:8080/actuator/prometheus

### Grafana

- URL: http://localhost:3001
- User: admin
- Password: admin

### MinIO Console

- URL: http://localhost:9001
- User: minioadmin
- Password: minioadmin123

---

## 🔄 Servisleri Durdurma

```bash
# Tüm servisleri durdur
docker-compose down

# Volumes ile birlikte durdur (veri silinir!)
docker-compose down -v

# Sadece belirli servisleri durdur
docker-compose stop backend frontend
```

---

## 📝 Notlar

- Backend port: **8080** (3000 değil!)
- Frontend port: **8081** (web), **19000-19001** (Expo)
- Database: PostgreSQL **5432**
- MinIO: **9000** (API), **9001** (Console)
- CDN: **Disabled** (MVP için)
- Kafka: **Removed** (Spring Events kullanılıyor)

---

## ✅ Başarılı Başlatma Kontrolü

Tüm servisler çalışıyorsa:

1. ✅ Backend: http://localhost:8080/actuator/health → `{"status":"UP"}`
2. ✅ Frontend: http://localhost:8081 → Expo sayfası açılır
3. ✅ Database: `docker-compose ps` → postgres `healthy`
4. ✅ MinIO: http://localhost:9001 → Console açılır

**Proje hazır! 🎉**


