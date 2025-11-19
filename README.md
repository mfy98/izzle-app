# Cursor Raffle - Reklam İzle, Çekiliş Kazan

React Native + Expo kullanılarak geliştirilen modern bir çekiliş uygulaması.

## 🚀 Özellikler

- Reklam izleme sistemi
- Sprint bazlı çekiliş yapısı
- Çarpan mekanizması ile adil dağıtım
- Üç farklı kullanıcı tipi (Admin, User, Reklam Veren)
- Modern ve responsive UI
- Google AdMob entegrasyonu desteği
- Custom reklam yükleme

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator / Android Emulator veya fiziksel cihaz

## 🛠️ Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Uygulamayı başlatın:
```bash
npm start
```

3. iOS için:
```bash
npm run ios
```

4. Android için:
```bash
npm run android
```

## 📁 Proje Yapısı

```
src/
├── app/              # Expo Router sayfaları
├── components/       # Yeniden kullanılabilir bileşenler
├── features/         # Özellik bazlı modüller
├── services/         # API ve dış servisler
├── hooks/           # Custom React hooks
├── store/           # Zustand state yönetimi
├── types/           # TypeScript type tanımları
├── utils/           # Yardımcı fonksiyonlar
└── constants/       # Sabitler ve konfigürasyon
```

## 🔧 Teknoloji Stack

- **React Native** (Expo SDK 51)
- **TypeScript**
- **Expo Router** (Navigation)
- **Zustand** (State Management)
- **TanStack Query** (Server State)
- **React Native Paper** (UI Components)
- **React Hook Form + Zod** (Forms & Validation)
- **Expo AV** (Video Ads)

## 📱 Tab Yapısı

1. **Ana Sayfa** - Reklam gösterimi ve sprint bilgileri
2. **Reklam İzle** - Aktif sprint'te reklam izleme (ortada, büyük tab)
3. **Çekiliş** - Çekiliş sonuçları ve bilgiler
4. **Profil** - Kullanıcı bilgileri
5. **Bilgi** - Yasal bilgiler ve kurallar

## 🔐 Environment Variables

`.env` dosyası oluşturun:

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## 📝 Notlar

- Backend API henüz hazır değil, frontend mock data ile çalışacak şekilde yapılandırılmıştır
- AdMob entegrasyonu için ek konfigürasyon gerekebilir
- Push notification'lar için Firebase Cloud Messaging kurulumu gerekli

## 📄 Lisans

Bu proje özel bir projedir.

