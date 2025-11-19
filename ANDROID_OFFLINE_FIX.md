# 🔧 Android Emulator "Device Offline" Çözümü

## 🔴 Sorun
```
[ADB] Couldn't reverse port 8081: adb.exe: device offline
Error: adb.exe: device offline
```

## ✅ Çözümler

### Çözüm 1: ADB Server'ı Yeniden Başlat (En Hızlı)

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"

# ADB server'ı durdur
adb kill-server

# ADB server'ı başlat
adb start-server

# Cihazları kontrol et
adb devices
```

### Çözüm 2: Emulator'ü Yeniden Başlat

1. **Emulator'ü kapatın** (pencereyi kapatın)
2. **Android Studio'dan yeniden başlatın:**
   - Tools > Device Manager
   - Medium_Phone_API_36.1 > ▶️
3. **Emulator tamamen açılana kadar bekleyin** (lock screen görünecek)
4. **ADB'yi kontrol edin:**
   ```powershell
   adb devices
   ```

### Çözüm 3: USB Debugging'i Kontrol Et

Emulator'de:
1. **Settings > About phone**
2. **Build number**'a 7 kez tıklayın (Developer options açılır)
3. **Settings > Developer options**
4. **USB debugging**'in açık olduğundan emin olun

### Çözüm 4: Emulator'ü Tamamen Kapat ve Yeniden Başlat

```powershell
# Tüm emulator process'lerini kapat
Get-Process | Where-Object {$_.ProcessName -like "*emulator*"} | Stop-Process -Force

# ADB'yi yeniden başlat
adb kill-server
adb start-server

# Emulator'ü yeniden başlat
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\emulator"
emulator -avd Medium_Phone_API_36.1
```

---

## 🚀 Hızlı Çözüm (Adım Adım)

### 1. ADB'yi Yeniden Başlat
```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
adb kill-server
adb start-server
```

### 2. Emulator Durumunu Kontrol Et
```powershell
adb devices
```

**Beklenen çıktı:**
```
List of devices attached
emulator-5554   device
```

**Eğer "offline" görüyorsanız:**
- Emulator'ün tamamen açıldığından emin olun
- 10-20 saniye bekleyin
- `adb devices` komutunu tekrar çalıştırın

### 3. Expo'yu Yeniden Başlat
```powershell
# Terminal'de Ctrl+C ile durdurun
# Sonra:
npm start
# Terminal'de 'a' tuşuna basın
```

---

## 🔍 Sorun Giderme

### "device offline" Hatası Devam Ediyor

1. **Emulator'ü tamamen kapatın**
2. **Android Studio'yu kapatın**
3. **ADB'yi temizleyin:**
   ```powershell
   adb kill-server
   taskkill /F /IM adb.exe 2>$null
   ```
4. **Emulator'ü Android Studio'dan yeniden başlatın**
5. **30 saniye bekleyin** (emulator tamamen açılsın)
6. **ADB'yi kontrol edin:**
   ```powershell
   adb devices
   ```

### Emulator Başlamıyor

- **Android Studio'da başlatın:** Tools > Device Manager > ▶️
- **HAXM veya Hyper-V kontrolü:** Windows Features'da Hyper-V etkin olmalı
- **Emulator loglarını kontrol edin:** Android Studio > View > Tool Windows > Logcat

### ADB Bulunamıyor

```powershell
# PATH'i kontrol et
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"

# ADB versiyonunu kontrol et
adb version
```

---

## 📝 Notlar

- Emulator başlaması **1-2 dakika** sürebilir
- İlk başlatmada daha uzun sürebilir
- "offline" hatası genellikle emulator'ün tamamen başlamadığı anlamına gelir
- Emulator açıldıktan sonra **10-20 saniye** bekleyin
- `adb devices` komutu **"device"** göstermeli (offline değil)

---

## ✅ Başarı Kontrolü

```powershell
adb devices
```

**Başarılı çıktı:**
```
List of devices attached
emulator-5554   device
```

**Hala offline ise:**
- Emulator'ü yeniden başlatın
- ADB server'ı yeniden başlatın
- Birkaç dakika bekleyin


