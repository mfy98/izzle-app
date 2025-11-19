# 🐳 Docker Desktop Başlatma Rehberi

## ⚠️ Sorun

Docker Desktop çalışmıyor. Hata mesajı:
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/containers/json": 
open //./pipe/dockerDesktopLinuxEngine: Sistem belirtilen dosyayı bulamıyor.
```

## ✅ Çözüm

### 1. Docker Desktop'ı Başlat

**Windows'ta:**
1. Başlat menüsünden "Docker Desktop" arayın
2. Docker Desktop'ı açın
3. Sistem tepsisinde Docker ikonunun göründüğünü kontrol edin
4. Docker Desktop'ın tamamen başlamasını bekleyin (1-2 dakika)

### 2. Docker Durumunu Kontrol Et

```powershell
# Docker çalışıyor mu?
docker ps

# Docker versiyonu
docker --version

# Docker Compose versiyonu
docker compose version
```

**Başarılı çıktı:**
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### 3. Projeyi Başlat

Docker Desktop çalıştıktan sonra:

```powershell
# Ana servisleri başlat
docker compose up -d

# Storage servisini başlat
docker compose -f docker-compose.storage.yml up -d

# Servisleri kontrol et
docker compose ps
```

---

## 🔧 Alternatif: Manuel Başlatma

Docker Desktop çalışmıyorsa, servisleri manuel olarak başlatabilirsiniz:

### Backend (Spring Boot)

```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend (Expo)

```powershell
npm install
npm start
```

### PostgreSQL

PostgreSQL'i manuel kurup başlatmanız gerekir veya Docker Desktop'ı kullanın.

---

## 🐛 Sorun Giderme

### Docker Desktop Başlamıyor

1. **Windows'ta WSL2 kontrolü:**
   ```powershell
   wsl --status
   ```

2. **Docker Desktop'ı yeniden başlat:**
   - Sistem tepsisinden Docker Desktop'ı kapat
   - Tekrar aç

3. **Windows özelliklerini kontrol et:**
   - Hyper-V etkin mi?
   - WSL2 kurulu mu?

### Docker Compose Hataları

**Version uyarısı:**
- ✅ Düzeltildi: `version: '3.8'` satırı kaldırıldı

**Network hatası:**
```powershell
# Network'ü oluştur
docker network create cursor-raffle-network
```

**Port çakışması:**
```powershell
# Port kullanan process'i bul
netstat -ano | findstr :8080
netstat -ano | findstr :8081

# Process'i sonlandır
taskkill /PID <PID> /F
```

---

## ✅ Başarılı Başlatma Kontrolü

Tüm servisler çalışıyorsa:

```powershell
docker compose ps
```

**Beklenen çıktı:**
```
NAME                        STATUS
cursor-raffle-db            Up (healthy)
cursor-raffle-backend       Up (healthy)
cursor-raffle-frontend      Up
cursor-raffle-minio         Up (healthy)
cursor-raffle-prometheus    Up
cursor-raffle-grafana       Up
```

---

## 📝 Notlar

- Docker Desktop başlaması 1-2 dakika sürebilir
- İlk başlatmada image'ler indirilecek (5-10 dakika)
- Backend ve frontend'in başlaması 30-60 saniye sürebilir

---

## 🚀 Hızlı Başlatma

```powershell
# 1. Docker Desktop'ı başlat (manuel)

# 2. Projeyi başlat
docker compose up -d
docker compose -f docker-compose.storage.yml up -d

# 3. Logları izle
docker compose logs -f backend
docker compose logs -f frontend

# 4. Servisleri kontrol et
docker compose ps
```

**Servisler:**
- Backend: http://localhost:8080
- Frontend: http://localhost:8081
- MinIO Console: http://localhost:9001


