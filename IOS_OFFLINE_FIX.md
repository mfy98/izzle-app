# 📱 iOS "Internet Connection Offline" Çözümü

## 🔴 Sorun
iOS'ta Expo Go açılıyor ama şu hatayı veriyor:
```
unknown error: the internet connection appears to be offline
```

## 🔍 Neden?
Bu hata genellikle şu nedenlerden kaynaklanır:
1. **Expo Go Metro bundler'a bağlanamıyor** (network sorunu)
2. **Tunnel modu düzgün çalışmıyor** (Expo hesabı gerekebilir)
3. **LAN modu çalışmıyor** (farklı network'ler)
4. **Metro bundler çalışmıyor** (server başlamadı)

## ✅ Çözümler

### Çözüm 1: Tunnel Modu (Önerilen)

Tunnel modu Expo Cloud kullanır ve herhangi bir network'ten erişilebilir:

```powershell
# 1. Metro'yu durdurun (Ctrl+C)

# 2. Tunnel modunda başlatın
npx expo start --tunnel

# 3. QR kodu tarayın
```

**Gereksinimler:**
- Expo hesabı (ücretsiz)
- İnternet bağlantısı

**Expo hesabı oluşturma:**
```powershell
npx expo register
# Email ve şifre girin
```

### Çözüm 2: Expo Hesabı ile Giriş Yap

Eğer tunnel modu çalışmıyorsa:

```powershell
# 1. Expo'ya giriş yapın
npx expo login

# 2. Tunnel modunda başlatın
npx expo start --tunnel

# 3. QR kodu tarayın
```

### Çözüm 3: LAN Modu (Aynı WiFi)

Eğer telefon ve bilgisayar aynı WiFi ağındaysa:

```powershell
# 1. Host IP'nizi bulun
ipconfig | Select-String "IPv4"

# 2. LAN modunda başlatın
npx expo start --lan

# 3. QR kodu tarayın
```

**Gereksinimler:**
- ✅ Telefon ve bilgisayar aynı WiFi ağında
- ✅ Firewall portları açık (8081, 19000, 19001)

### Çözüm 4: Manuel URL Girişi

QR kod çalışmıyorsa:

1. **Terminal'de görünen URL'yi kopyalayın:**
   ```
   exp://192.168.1.4:8081
   veya
   exp://xxx.xxx.xxx.xxx:8081
   ```

2. **Expo Go'da:**
   - "Enter URL manually" seçeneğini seçin
   - URL'yi yapıştırın
   - "Connect" butonuna tıklayın

---

## 🚀 Hızlı Çözüm (Adım Adım)

### 1. Metro'yu Durdurun
Terminal'de `Ctrl+C` tuşlarına basın

### 2. Tunnel Modunda Başlatın
```powershell
npx expo start --tunnel
```

### 3. Expo Hesabı Oluşturun (İlk kez)
```powershell
# Yeni terminal açın
npx expo register
# Email ve şifre girin
```

### 4. QR Kodu Tarayın
- Expo Go uygulamasını açın
- QR kodu tarayın
- ✅ Bağlantı kurulacak!

---

## 🔧 Sorun Giderme

### "Tunnel connection failed"
- İnternet bağlantınızı kontrol edin
- Expo hesabınızın aktif olduğundan emin olun
- Expo'ya giriş yapın: `npx expo login`

### "Still showing offline"
1. **Metro'yu tamamen durdurun** (Ctrl+C)
2. **Cache'i temizleyin:**
   ```powershell
   Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
   ```
3. **Tunnel modunda yeniden başlatın:**
   ```powershell
   npx expo start --tunnel --clear
   ```

### "Expo login required"
```powershell
npx expo login
# veya
npx expo register
```

### QR Kod Çalışmıyor
- Manuel URL girişi yapın (yukarıdaki Çözüm 4)
- Terminal'de görünen `exp://` URL'sini kullanın

---

## 📝 Notlar

- **Tunnel modu:** Expo Cloud kullanır, her network'ten erişilebilir
- **LAN modu:** Sadece aynı WiFi ağında çalışır
- **Expo hesabı:** Tunnel modu için gerekli (ücretsiz)
- **Metro bundler:** Çalışıyor olmalı (terminal'de görünmeli)

---

## ✅ Başarı Kontrolü

Terminal'de şunu görmelisiniz:
```
› Metro waiting on exp://xxx.tunnel.exp.direct:80
› Scan the QR code above with Expo Go
```

Expo Go'da:
- QR kod tarandıktan sonra "Connecting..." görünmeli
- Sonra uygulama yüklenmeli
- "Internet connection offline" hatası gitmeli

---

## 🆘 Hala Çalışmıyor?

1. **Expo Go uygulamasını güncelleyin** (App Store'dan)
2. **Metro'yu tamamen durdurup yeniden başlatın**
3. **Cache'i temizleyin:**
   ```powershell
   Remove-Item -Recurse -Force .expo, node_modules\.cache -ErrorAction SilentlyContinue
   npx expo start --tunnel --clear
   ```
4. **Manuel URL girişi yapın** (QR kod yerine)


