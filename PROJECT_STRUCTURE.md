# Proje Yapısı ve Directory Organizasyonu

## 📁 Tam Directory Yapısı

```
CursorRaffle/
├── src/
│   ├── app/                    # Expo Router - File-based routing
│   │   ├── (tabs)/             # Tab navigation grubu
│   │   │   ├── _layout.tsx    # Tab layout config
│   │   │   ├── home.tsx        # Ana sayfa
│   │   │   ├── watch.tsx       # Reklam izleme (ana özellik - ortada)
│   │   │   ├── raffle.tsx      # Çekiliş sayfası
│   │   │   ├── profile.tsx     # Profil sayfası
│   │   │   └── info.tsx        # Yasal bilgiler
│   │   ├── _layout.tsx         # Root layout
│   │   └── index.tsx           # Entry point
│   │
│   ├── components/             # Yeniden kullanılabilir bileşenler
│   │   ├── ui/                 # Genel UI bileşenleri
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── ads/                # Reklam bileşenleri
│   │   │   ├── AdPlayer.tsx
│   │   │   ├── AdBanner.tsx
│   │   │   ├── AdCover.tsx
│   │   │   └── AdMobWrapper.tsx
│   │   ├── raffle/             # Çekiliş bileşenleri
│   │   │   ├── RaffleCard.tsx
│   │   │   ├── WinnerList.tsx
│   │   │   ├── PrizeCard.tsx
│   │   │   └── TicketCounter.tsx
│   │   └── forms/              # Form bileşenleri
│   │       ├── UserRegistrationForm.tsx
│   │       ├── AdvertiserRegistrationForm.tsx
│   │       └── AddressForm.tsx
│   │
│   ├── features/               # Feature-based modüller
│   │   ├── auth/               # Authentication
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── useAuth.ts
│   │   ├── ads/                # Reklam izleme özelliği
│   │   │   ├── AdWatchScreen.tsx
│   │   │   ├── AdViewTracker.tsx
│   │   │   └── useAdViewing.ts
│   │   ├── raffle/             # Çekiliş sistemi
│   │   │   ├── RaffleScreen.tsx
│   │   │   ├── RaffleResults.tsx
│   │   │   └── useRaffle.ts
│   │   ├── sprint/             # Sprint yönetimi
│   │   │   ├── SprintTimer.tsx
│   │   │   ├── SprintSchedule.tsx
│   │   │   └── useSprint.ts
│   │   └── admin/              # Admin özellikleri
│   │       ├── AdminDashboard.tsx
│   │       ├── AdvertiserManagement.tsx
│   │       └── RaffleManagement.tsx
│   │
│   ├── services/               # API & external services
│   │   ├── api/                # API client
│   │   │   ├── client.ts       # Axios instance
│   │   │   ├── auth.api.ts
│   │   │   ├── ads.api.ts
│   │   │   ├── raffle.api.ts
│   │   │   └── sprint.api.ts
│   │   ├── ads/                # Reklam servisleri
│   │   │   ├── admob.service.ts
│   │   │   ├── custom-ads.service.ts
│   │   │   └── ad-manager.ts
│   │   ├── notifications/      # Push notifications
│   │   │   └── notification.service.ts
│   │   └── storage/            # Local storage
│   │       └── index.ts
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAds.ts
│   │   ├── useRaffle.ts
│   │   ├── useSprint.ts
│   │   └── useTimer.ts
│   │
│   ├── store/                  # Zustand state management
│   │   ├── authStore.ts
│   │   ├── raffleStore.ts
│   │   ├── sprintStore.ts
│   │   └── userStore.ts
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── user.ts
│   │   ├── ad.ts
│   │   ├── raffle.ts
│   │   └── sprint.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── validation.ts       # Zod schemas
│   │   ├── formatting.ts       # Date, number formatters
│   │   ├── helpers.ts          # Helper functions
│   │   └── constants.ts        # Utility constants
│   │
│   └── constants/              # App constants
│       ├── colors.ts           # Color palette
│       ├── sizes.ts            # Spacing, font sizes
│       ├── config.ts           # App configuration
│       └── index.ts            # Barrel export
│
├── assets/                     # Static assets
│   ├── images/
│   ├── fonts/
│   └── videos/
│
├── app.json                     # Expo config
├── app.config.js               # Expo dynamic config
├── babel.config.js             # Babel config with path aliases
├── tsconfig.json               # TypeScript config
├── package.json              # Dependencies
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── ARCHITECTURE_ANALYSIS.md    # Mimari analiz dokümantasyonu
└── README.md
```

## 🎯 Klasör Açıklamaları

### `/src/app`
Expo Router'ın file-based routing sistemi. Her dosya bir route oluşturur.
- `(tabs)` - Tab navigation grubu (parantez isimlendirme Expo Router'da grup oluşturur)
- `_layout.tsx` - Layout dosyaları (özel prefix)

### `/src/components`
Yeniden kullanılabilir UI bileşenleri, feature'a özgü değil.

### `/src/features`
Özellik bazlı modüller. Her modül kendi component'leri, hook'ları ve logic'ini içerir.

### `/src/services`
External servisler ve API çağrıları. Business logic burada değil, sadece data fetching ve external integration.

### `/src/store`
Global state management (Zustand). Sadece gerçekten global olan state'ler burada.

### `/src/types`
TypeScript type tanımları. Paylaşılan type'lar burada.

### `/src/utils`
Pure utility functions. Side effect yok, test edilebilir.

### `/src/constants`
Uygulama sabitleri. Theme colors, spacing, config values.

## 🔗 Path Aliases

TypeScript ve Babel config'de tanımlı:

```typescript
'@'              → './src'
'@components'    → './src/components'
'@features'      → './src/features'
'@services'      → './src/services'
'@hooks'         → './src/hooks'
'@store'         → './src/store'
'@types'         → './src/types'
'@utils'         → './src/utils'
'@constants'     → './src/constants'
```

Kullanım:
```typescript
import { colors } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@components/ui/Button';
```

## 📐 Design Patterns

### 1. Feature-Based Structure
Her özellik kendi modülünde, bağımsız geliştirilebilir.

### 2. Separation of Concerns
- Components: Sadece UI
- Features: Business logic + UI
- Services: Data fetching
- Store: Global state
- Utils: Pure functions

### 3. Barrel Exports
Her klasörde `index.ts` ile export'lar organize edilir.

### 4. Type Safety
Tüm API responses, form data'ları ve state'ler type-safe.

## 🚀 Sonraki Adımlar

1. Component'leri implement et
2. Feature'ları tamamla
3. API integration
4. Testing
5. Performance optimization

