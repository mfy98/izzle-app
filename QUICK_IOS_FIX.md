# 🚀 iOS Connection Timeout - Hızlı Çözüm

## ⚡ En Kolay Yöntem (2 Dakika)

### Adım 1: Docker Frontend'i Durdur
```powershell
docker compose stop frontend
```

### Adım 2: Lokal Başlat
```powershell
npm start
```

### Adım 3: Tunnel Modu Seç
Terminal'de **`t`** tuşuna basın (tunnel modu için)

Veya direkt:
```powershell
npx expo start --tunnel
```

### Adım 4: QR Kodu Tara
- Expo Go uygulamasını açın
- QR kodu tarayın
- ✅ Bağlantı kurulacak!

---

## 📱 Alternatif: Expo Hesabı Oluştur (Docker için)

Eğer Docker'da kalmak istiyorsanız:

```powershell
# 1. Container'a gir
docker compose exec frontend sh

# 2. Expo hesabı oluştur (ücretsiz)
npx expo register

# 3. Çık
exit

# 4. Restart
docker compose restart frontend
```

---

## ✅ Neden Lokal Başlatma?

- ✅ Host IP kullanır (telefona erişilebilir)
- ✅ Expo hesabı gerekmez (tunnel modu için)
- ✅ Daha hızlı bağlantı
- ✅ Daha kolay debug

---

## 🔧 Sorun Devam Ederse

1. **Aynı WiFi ağında olduğunuzdan emin olun**
2. **Firewall'u kontrol edin** (Windows Defender)
3. **Expo Go uygulamasını güncelleyin**
4. **Manuel URL girin:** Terminal'de görünen `exp://` URL'sini Expo Go'da manuel girin


