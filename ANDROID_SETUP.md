# Android Emülatör Kurulum Rehberi

## Android SDK Kurulumu

Android emülatörünü çalıştırmak için Android SDK'ya ihtiyacınız var. İki seçenek:

### Seçenek 1: Android Studio ile (Önerilen)

1. **Android Studio'yu indirin ve kurun:**
   - https://developer.android.com/studio adresinden indirin
   - Kurulum sırasında "Android SDK" ve "Android SDK Platform" seçeneklerini işaretleyin

2. **Android SDK Konumunu Bulun:**
   - Android Studio'yu açın
   - File > Settings > Appearance & Behavior > System Settings > Android SDK
   - "Android SDK Location" yolunu not edin (genellikle: `C:\Users\<KullanıcıAdı>\AppData\Local\Android\Sdk`)

3. **Environment Variables Ayarlayın:**
   ```powershell
   # PowerShell'de (Yönetici olarak çalıştırın)
   [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\<KullanıcıAdı>\AppData\Local\Android\Sdk", "User")
   [System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools", "User")
   ```

4. **PowerShell'i yeniden başlatın**

### Seçenek 2: Sadece Android SDK (Command Line Tools)

1. **Android SDK Command Line Tools'u indirin:**
   - https://developer.android.com/studio#command-tools

2. **SDK'yı kurun ve environment variable'ları ayarlayın**

## Emülatör Oluşturma

1. **Android Studio'yu açın**
2. **Tools > Device Manager** menüsüne gidin
3. **Create Device** butonuna tıklayın
4. Bir cihaz seçin (örn: Pixel 5)
5. Sistem görüntüsü seçin (API 33 veya üzeri önerilir)
6. **Finish** ile emülatörü oluşturun

## Emülatörü Başlatma

### Yöntem 1: Android Studio'dan
- Device Manager'dan emülatörü seçip ▶️ butonuna tıklayın

### Yöntem 2: Komut Satırından
```powershell
# Emülatör listesini görüntüle
emulator -list-avds

# Emülatörü başlat
emulator -avd <emulator_name>
```

## Expo ile Kullanım

Emülatör başladıktan sonra:

```powershell
# Expo development server'ı başlat
npx expo start

# Android emülatöründe açmak için 'a' tuşuna basın
# veya
npx expo start --android
```

## Sorun Giderme

### ADB bulunamıyor
- `ANDROID_HOME\platform-tools` yolunun PATH'e eklendiğinden emin olun
- PowerShell'i yeniden başlatın

### Emülatör başlamıyor
- Android Studio'da emülatörün çalıştığından emin olun
- HAXM veya Hyper-V'nin etkin olduğundan emin olun

### Expo emülatörü bulamıyor
- `adb devices` komutu ile emülatörün bağlı olduğunu kontrol edin
- Emülatörün tamamen başladığından emin olun





