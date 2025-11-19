# 📱 iOS Production Bağlantı Rehberi

Production sunucunuzda (`srv1140142.hstgr.cloud`) iOS telefonunuzdan Expo Go ile bağlanmak için bu rehberi takip edin.

## 🚀 Hızlı Başlangıç

### 1. Development Server'ı Başlat

Production'da development server zaten çalışıyor olmalı. Kontrol edin:

```bash
docker-compose -f docker-compose.prod.yml ps frontend-dev
```

Eğer çalışmıyorsa başlatın:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d frontend-dev
```

### 2. Expo Loglarını Kontrol Et

QR kod ve bağlantı bilgilerini görmek için:

```bash
docker-compose -f docker-compose.prod.yml logs -f frontend-dev
```

Loglarda şunları göreceksiniz:
- QR kod (terminal'de ASCII art olarak)
- Tunnel URL (örn: `exp://xxx.xxx.xxx.xxx:8081`)
- Bağlantı bilgileri

### 3. iOS Telefonda Expo Go ile Bağlan

#### Yöntem 1: QR Kod ile (Önerilen)

1. **Expo Go** uygulamasını iOS telefonunuzda açın
2. **"Scan QR code"** seçeneğini seçin
3. Terminal'deki QR kodu tarayın
4. Uygulama yüklenecek ve bağlanacak

#### Yöntem 2: Manuel URL Girişi

1. **Expo Go** uygulamasını açın
2. **"Enter URL manually"** seçeneğini seçin
3. Terminal loglarından URL'yi kopyalayın (örn: `exp://xxx.xxx.xxx.xxx:8081`)
4. URL'yi yapıştırın ve **"Connect"** butonuna tıklayın

## 🔧 Expo Hesabı Gerekli

Tunnel modu için Expo hesabı gereklidir (ücretsiz). Eğer hesabınız yoksa:

```bash
# Container'a gir
docker-compose -f docker-compose.prod.yml exec frontend-dev sh

# Expo hesabı oluştur
npx expo register

# veya giriş yap
npx expo login

# Çıkış
exit
```

Sonra servisi yeniden başlatın:

```bash
docker-compose -f docker-compose.prod.yml restart frontend-dev
```

## 📋 Portlar

Production'da şu portlar açık olmalı:

- **8081**: Expo development server (public)
- **19000**: Expo dev tools (public)
- **19001**: Expo dev tools (public)
- **8080**: Backend API (public)
- **80**: Frontend web (public)

## 🔍 Sorun Giderme

### "Connection Timeout" Hatası

**Çözüm 1: Tunnel Modu Kontrolü**
```bash
# Logları kontrol et
docker-compose -f docker-compose.prod.yml logs frontend-dev

# Tunnel modunda çalıştığından emin olun
# Loglarda "Tunnel ready" mesajını görmelisiniz
```

**Çözüm 2: Expo Hesabı Kontrolü**
```bash
# Container'a gir ve kontrol et
docker-compose -f docker-compose.prod.yml exec frontend-dev sh
npx expo whoami
# Eğer "Not logged in" görürseniz:
npx expo login
exit
```

**Çözüm 3: Servisi Yeniden Başlat**
```bash
docker-compose -f docker-compose.prod.yml restart frontend-dev
```

### "Internet Connection Offline" Hatası

Bu hata genellikle Metro bundler'a bağlanamama sorunudur.

**Çözüm:**
```bash
# Frontend-dev servisini durdur
docker-compose -f docker-compose.prod.yml stop frontend-dev

# Cache'i temizle ve yeniden başlat
docker-compose -f docker-compose.prod.yml up -d --force-recreate frontend-dev

# Logları takip et
docker-compose -f docker-compose.prod.yml logs -f frontend-dev
```

### QR Kod Görünmüyor

**Çözüm:**
```bash
# Logları kontrol et
docker-compose -f docker-compose.prod.yml logs frontend-dev | grep -i "qr\|tunnel\|exp://"

# Manuel URL'yi kullan
# Loglardan `exp://` ile başlayan URL'yi kopyalayın
```

### API Bağlantı Hatası

iOS'ta API'ye bağlanamıyorsanız:

1. **app.json** dosyasında production IP'si ekli olmalı (zaten eklendi)
2. **EXPO_PUBLIC_API_URL** environment variable doğru olmalı:
   ```bash
   # .env.prod dosyasında
   EXPO_PUBLIC_API_URL=http://31.97.126.71:8080/api
   ```

3. **Backend CORS** ayarlarında iOS origin'i olmalı:
   ```bash
   # .env.prod dosyasında
   CORS_ORIGINS=http://srv1140142.hstgr.cloud,http://31.97.126.71,https://srv1140142.hstgr.cloud,exp://31.97.126.71:8081
   ```

## 🔐 Güvenlik Notları

1. **Tunnel Modu**: Expo Cloud üzerinden çalışır, güvenlidir
2. **HTTPS**: Production'da HTTPS kullanmanız önerilir (Nginx reverse proxy)
3. **Firewall**: Sadece gerekli portları açın (8081, 19000, 19001, 8080, 80)

## 📱 Test Etme

1. **Expo Go** uygulamasını iOS'ta açın
2. QR kodu tarayın veya URL'yi manuel girin
3. Uygulama yüklenecek
4. Backend API'ye bağlanıp bağlanamadığını test edin
5. Login/Register işlemlerini deneyin

## 🎯 Özet

1. ✅ `frontend-dev` servisi çalışıyor olmalı
2. ✅ Expo hesabı ile giriş yapılmış olmalı
3. ✅ Tunnel modu aktif olmalı
4. ✅ iOS'ta Expo Go uygulaması yüklü olmalı
5. ✅ QR kod veya manuel URL ile bağlanın

## 📞 Yardım

Sorun yaşarsanız:

1. Logları kontrol edin: `docker-compose -f docker-compose.prod.yml logs frontend-dev`
2. Servis durumunu kontrol edin: `docker-compose -f docker-compose.prod.yml ps`
3. Network bağlantısını test edin: `curl http://31.97.126.71:8081`

