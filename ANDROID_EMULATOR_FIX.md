# 🤖 Android Emulator Bağlantı Çözümü

## 🔴 Sorun
Expo Android emulator'ü bulamıyor:
```
CommandError: No Android connected device found, and no emulators could be started automatically.
```

## ✅ Çözüm

### Adım 1: Android SDK Yolunu Bulun

Android Studio'da:
1. **File > Settings** (veya **Android Studio > Preferences** on Mac)
2. **Appearance & Behavior > System Settings > Android SDK**
3. **Android SDK Location** yolunu not edin
   - Genellikle: `C:\Users\<KullanıcıAdı>\AppData\Local\Android\Sdk`

### Adım 2: Environment Variables Ayarlayın

**PowerShell'de (Yönetici olarak):**

```powershell
# Android SDK yolunu ayarlayın (kendi yolunuzu kullanın)
$androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"

# ANDROID_HOME ayarla
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")

# PATH'e ekle
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPath = $currentPath + ";$androidSdkPath\platform-tools;$androidSdkPath\emulator;$androidSdkPath\tools"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")

Write-Host "✅ Environment variables ayarlandı!" -ForegroundColor Green
Write-Host "PowerShell'i yeniden başlatın!" -ForegroundColor Yellow
```

### Adım 3: PowerShell'i Yeniden Başlatın

Environment variables'ın yüklenmesi için PowerShell'i kapatıp yeniden açın.

### Adım 4: Emulator'ü Başlatın

**Yöntem 1: Android Studio'dan**
- Android Studio'yu açın
- **Tools > Device Manager**
- Emulator'ünüzü seçip ▶️ butonuna tıklayın

**Yöntem 2: Komut Satırından**
```powershell
# Emulator listesini görüntüle
& "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds

# Emulator'ü başlat (AVD adını kullanın)
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd <AVD_NAME>
```

### Adım 5: ADB Bağlantısını Kontrol Edin

```powershell
# ADB'nin çalıştığını kontrol et
adb devices

# Çıktı şöyle olmalı:
# List of devices attached
# emulator-5554   device
```

### Adım 6: Expo'yu Başlatın

```powershell
# Expo'yu başlat
npm start

# Terminal'de 'a' tuşuna bas (Android)
# veya direkt:
npx expo start --android
```

---

## 🔧 Hızlı Kontrol

```powershell
# 1. Android SDK var mı?
Test-Path "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"

# 2. ADB çalışıyor mu?
adb version

# 3. Emulator çalışıyor mu?
adb devices

# 4. Emulator listesi
& "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds
```

---

## 🐛 Sorun Giderme

### ADB bulunamıyor
- PowerShell'i yeniden başlatın
- `ANDROID_HOME` environment variable'ını kontrol edin
- PATH'e `platform-tools` eklendiğinden emin olun

### Emulator başlamıyor
- Android Studio'da emulator'ün çalıştığından emin olun
- HAXM veya Hyper-V'nin etkin olduğundan emin olun
- Emulator'ü Android Studio'dan başlatmayı deneyin

### Expo emulator'ü bulamıyor
- `adb devices` ile emulator'ün bağlı olduğunu kontrol edin
- Emulator'ün tamamen başladığından emin olun (lock screen açık)
- Expo'yu yeniden başlatın: `npm start`

---

## 📝 Notlar

- **API 36** emulator'ü destekleniyor ✅
- Emulator başlaması 1-2 dakika sürebilir
- İlk başlatmada daha uzun sürebilir
- Emulator çalışırken `adb devices` komutu cihazı göstermeli


