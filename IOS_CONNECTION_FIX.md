# 📱 iOS Connection Timeout Çözümü

## 🔴 Sorun
iOS kameradan QR kod tarandığında "Request Timed Out" hatası alınıyor.

## 🔍 Neden?
Docker container'ın IP adresi (`172.20.0.11`) sadece Docker network içinde geçerli. Telefon bu IP'ye erişemez çünkü:
- Container IP: `172.20.0.11` (Docker bridge network)
- Host IP: `172.21.48.1` (WSL/Docker Desktop network)
- Telefon: Farklı network'te

## ✅ Çözümler

### Çözüm 1: Tunnel Modu (Önerilen - Docker)

Tunnel modu Expo Cloud kullanır ve herhangi bir network'ten erişilebilir:

```powershell
# docker-compose.yml zaten tunnel moduna ayarlandı
docker compose restart frontend
```

**Gereksinimler:**
- Expo hesabı (ücretsiz)
- İnternet bağlantısı

**Expo hesabı oluşturma:**
```powershell
docker compose exec frontend sh
npx expo register
# veya
npx expo login
```

### Çözüm 2: Lokal Başlatma (En Kolay)

Docker container yerine lokal olarak başlatın:

```powershell
# 1. Frontend container'ı durdur
docker compose stop frontend

# 2. Lokal olarak başlat
npm start

# 3. Terminal'de 't' tuşuna bas (tunnel modu)
# veya direkt:
npx expo start --tunnel
```

**Avantajlar:**
- ✅ Host IP kullanır (telefona erişilebilir)
- ✅ QR kod çalışır
- ✅ Tunnel modu ile her network'ten erişilebilir

### Çözüm 3: Host IP ile LAN Modu

Host IP'sini kullanarak LAN modunda başlatın:

```powershell
# 1. Host IP'nizi bulun
ipconfig | Select-String "IPv4"

# 2. Frontend'i durdurun
docker compose stop frontend

# 3. Host IP ile başlatın (örnek: 192.168.1.100)
$env:EXPO_DEVTOOLS_LISTEN_ADDRESS="0.0.0.0"
npm start -- --lan --host 192.168.1.100
```

**Gereksinimler:**
- ✅ Telefon ve bilgisayar aynı WiFi ağında
- ✅ Firewall portları açık (8081, 19000, 19001)

---

## 🚀 Hızlı Çözüm (Önerilen)

### Adım 1: Expo Hesabı Oluştur
```powershell
docker compose exec frontend sh
npx expo register
# Email ve şifre girin
exit
```

### Adım 2: Tunnel Modunda Başlat
```powershell
# docker-compose.yml zaten tunnel moduna ayarlandı
docker compose restart frontend
```

### Adım 3: QR Kodu Tara
- Expo Go uygulamasını açın
- QR kodu tarayın
- Bağlantı kurulacak!

---

## 🔧 Alternatif: Lokal Başlatma

Eğer tunnel modu çalışmazsa:

```powershell
# 1. Docker frontend'i durdur
docker compose stop frontend

# 2. Lokal başlat
npm start

# 3. Terminal'de 't' tuşuna bas (tunnel)
# veya 'l' tuşuna bas (LAN - aynı WiFi gerekir)
```

---

## 📝 Notlar

- **Tunnel modu:** Expo Cloud kullanır, her network'ten erişilebilir
- **LAN modu:** Sadece aynı WiFi ağında çalışır
- **Docker container IP:** Telefona erişilebilir değil (sadece Docker network içinde)
- **Host IP:** Telefona erişilebilir (aynı WiFi ağında)

---

## 🐛 Sorun Giderme

### "Expo login required"
```powershell
docker compose exec frontend sh
npx expo login
```

### "Tunnel connection failed"
- İnternet bağlantınızı kontrol edin
- Expo hesabınızın aktif olduğundan emin olun
- Lokal başlatmayı deneyin

### "Still timing out"
1. Lokal başlatmayı deneyin (`npm start`)
2. Tunnel modunu kullanın (`npx expo start --tunnel`)
3. Aynı WiFi ağında olduğunuzdan emin olun


