# 📱 Expo Go Bağlantı Rehberi

## 🔧 Docker Container'dan Telefona Bağlanma

### Sorun
Expo Go'da "Connection Timeout" hatası alıyorsunuz.

### Çözüm

#### 1. Tunnel Modu (Önerilen)

Docker container'dan telefona bağlanmak için Expo **tunnel** modunu kullanın:

```bash
npx expo start --tunnel
```

**Avantajlar:**
- ✅ Docker container'dan çalışır
- ✅ NAT/firewall sorunlarını aşar
- ✅ Herhangi bir network'ten erişilebilir

**Dezavantajlar:**
- ⚠️ Expo hesabı gerekir (ücretsiz)
- ⚠️ Biraz daha yavaş olabilir

#### 2. LAN Modu (Alternatif)

Aynı WiFi ağındaysanız:

```bash
npx expo start --lan
```

**Gereksinimler:**
- ✅ Telefon ve bilgisayar aynı WiFi ağında
- ✅ Docker network ayarları doğru
- ⚠️ Firewall portları açık olmalı

#### 3. Manuel Başlatma (En Kolay)

Docker yerine lokal olarak başlatın:

```powershell
# Frontend'i lokal olarak başlat
npm start

# Tunnel modu ile
npx expo start --tunnel

# LAN modu ile (aynı WiFi)
npx expo start --lan
```

---

## 🚀 Hızlı Çözüm

### Seçenek 1: Tunnel Modu (Docker)

```powershell
# Frontend container'ına gir
docker compose exec frontend sh

# Tunnel modunda başlat
npx expo start --tunnel
```

### Seçenek 2: Lokal Başlatma (Önerilen)

```powershell
# Docker frontend'i durdur
docker compose stop frontend

# Lokal olarak başlat
npm start

# Tunnel modu seç (terminal'de 't' tuşuna bas)
# veya direkt:
npx expo start --tunnel
```

### Seçenek 3: Network Mode Host

`docker-compose.yml`'de network mode'u host yapın (sadece Linux'ta çalışır):

```yaml
frontend:
  network_mode: host
```

---

## 📋 Adım Adım

### 1. Expo Hesabı Oluştur (Tunnel için)

```bash
npx expo login
```

veya

```bash
npx expo register
```

### 2. Tunnel Modunda Başlat

```bash
npx expo start --tunnel
```

### 3. QR Kodu Tara

- Expo Go uygulamasını açın
- QR kodu tarayın
- Bağlantı kurulacak

---

## 🔍 Sorun Giderme

### Connection Timeout

**Çözüm 1: Tunnel Modu**
```bash
npx expo start --tunnel
```

**Çözüm 2: Lokal Başlatma**
```bash
# Docker'ı durdur
docker compose stop frontend

# Lokal başlat
npm start
```

**Çözüm 3: Network Kontrolü**
```bash
# IP adresini kontrol et
ipconfig  # Windows
ifconfig  # Linux/Mac

# Expo'yu LAN modunda başlat
npx expo start --lan
```

### QR Kod Görünmüyor

**Çözüm:**
```bash
# Clear cache
npx expo start --clear

# Tunnel modu
npx expo start --tunnel
```

### Expo Hesabı Gerekli

Tunnel modu için Expo hesabı gerekir (ücretsiz):
```bash
npx expo register
# veya
npx expo login
```

---

## ✅ Önerilen Yöntem

**Development için:**
1. Docker'ı durdur: `docker compose stop frontend`
2. Lokal başlat: `npm start`
3. Tunnel modu seç: Terminal'de `t` tuşuna bas
4. QR kodu tara

**Production için:**
- Docker container kullan
- Tunnel modu aktif

---

## 📝 Notlar

- Tunnel modu Expo Cloud kullanır (ücretsiz)
- LAN modu daha hızlı ama aynı network gerekir
- Docker container'dan direkt bağlanmak zor olabilir
- Lokal başlatma en kolay yöntem


