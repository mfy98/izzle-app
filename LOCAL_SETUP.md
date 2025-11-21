# 🏠 Lokal Geliştirme Kurulumu

Bu rehber, projeyi lokal makinenizde çalıştırmak için gerekli adımları içerir.

## 📋 Gereksinimler

- Docker ve Docker Compose
- Node.js 18+ ve npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go uygulaması (telefonunuzda)

## 🚀 Hızlı Başlangıç

### 1. Lokal IP'nizi Belirleyin

```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr IPv4
```

**Not:** Bulduğunuz IP'yi not edin (örn: `192.168.1.100`)

### 2. Backend Servislerini Başlatın

```bash
# Docker compose ile backend servislerini başlat (frontend olmadan)
docker-compose -f docker-compose.local.yml up -d

# Servislerin durumunu kontrol et
docker-compose -f docker-compose.local.yml ps

# Logları izle
docker-compose -f docker-compose.local.yml logs -f backend
```

**Başlatılan servisler:**
- PostgreSQL (port 5432)
- MinIO (port 9000, console: 9001)
- Spring Boot Backend (port 8080)

### 3. Backend'in Hazır Olduğunu Kontrol Edin

```bash
# Health check
curl http://localhost:8080/actuator/health

# API test
curl http://localhost:8080/api/time/current
```

### 4. Frontend'i Başlatın

```bash
# Proje dizininde
cd /Users/u2soft2/Documents/izzle-app

# Environment variable'ı set et (lokal IP'nizi kullanın)
export EXPO_PUBLIC_API_URL=http://192.168.1.100:8080/api

# Expo'yu başlat (tunnel modu ile)
npx expo start --clear --tunnel
```

**Alternatif:** `.env.local` dosyasını `.env` olarak kopyalayın ve IP'yi güncelleyin:
```bash
cp .env.local .env
# .env dosyasını düzenleyip IP'nizi güncelleyin
```

### 5. Expo Go ile Bağlanın

1. Telefonunuzda Expo Go uygulamasını açın
2. QR kodu tarayın (terminal'de görünecek)
3. Uygulama yüklenecek ve çalışacak

**Not:** Expo Go kullanmak için Expo hesabınızla giriş yapmanız gerekebilir:
```bash
npx expo login
```

## 🔧 Yapılandırma

### API URL Yapılandırması

API URL'i iki şekilde ayarlanabilir:

1. **Environment Variable (Önerilen):**
   ```bash
   export EXPO_PUBLIC_API_URL=http://192.168.1.100:8080/api
   ```

2. **config.ts Dosyası:**
   `src/constants/config.ts` dosyasında `LOCAL_IP` değerini güncelleyin:
   ```typescript
   const LOCAL_IP = '192.168.1.100'; // Kendi IP'nizi yazın
   ```

### CORS Ayarları

Backend'de CORS zaten tüm origin'lere izin verecek şekilde yapılandırılmış (`SecurityConfig.java`). Ekstra bir ayar gerekmez.

## 🛠️ Sorun Giderme

### Backend'e Bağlanamıyorum

1. **Backend'in çalıştığını kontrol edin:**
   ```bash
   docker-compose -f docker-compose.local.yml ps
   curl http://localhost:8080/actuator/health
   ```

2. **Firewall kontrolü:**
   - Port 8080'in açık olduğundan emin olun
   - Mac: System Preferences > Security & Privacy > Firewall

3. **IP adresini kontrol edin:**
   - Telefon ve bilgisayar aynı WiFi ağında olmalı
   - IP adresinin doğru olduğundan emin olun

### Expo Go'da Bağlantı Hatası

1. **Tunnel modunu kullanın:**
   ```bash
   npx expo start --clear --tunnel
   ```

2. **Expo login yapın:**
   ```bash
   npx expo login
   ```

3. **Cache'i temizleyin:**
   ```bash
   npx expo start --clear
   ```

### Database Bağlantı Hatası

```bash
# PostgreSQL container'ının çalıştığını kontrol edin
docker-compose -f docker-compose.local.yml ps postgres

# Logları kontrol edin
docker-compose -f docker-compose.local.yml logs postgres
```

## 📱 Test Etme

### Backend API Test

```bash
# Health check
curl http://localhost:8080/actuator/health

# Time endpoint
curl http://localhost:8080/api/time/current

# Auth register (test)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456",
    "name": "Test",
    "surname": "User",
    "phone": "+905551234567",
    "address": {
      "street": "Test Street",
      "district": "Test District",
      "city": "Istanbul",
      "postalCode": "34000",
      "country": "Turkey"
    }
  }'
```

### Frontend Test

1. Expo Go'da uygulamayı açın
2. Login ekranı bypass edilmiş olmalı (direkt ana sayfaya yönlendirir)
3. Console loglarını kontrol edin (API URL'in doğru olduğunu görmek için)

## 🛑 Servisleri Durdurma

```bash
# Tüm servisleri durdur
docker-compose -f docker-compose.local.yml down

# Verileri de silmek isterseniz
docker-compose -f docker-compose.local.yml down -v
```

## 📝 Notlar

- **Login Bypass:** Development için login ekranı bypass edilmiştir (`app/index.tsx` dosyasında `BYPASS_LOGIN = true`)
- **Database:** Veriler Docker volume'lerinde saklanır, `down -v` komutu ile silinir
- **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin123)
- **Backend Health:** http://localhost:8080/actuator/health

## 🔄 Güncellemeler

IP adresiniz değişirse:
1. `.env` dosyasını güncelleyin
2. `src/constants/config.ts` dosyasındaki `LOCAL_IP` değerini güncelleyin
3. Expo'yu yeniden başlatın

