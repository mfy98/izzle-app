# Hızlı Implementasyon Rehberi

## ✅ Eklenen Örnek Özellikler

### 1. Reklam Kuyruğu Sistemi (`AdQueue`)
**Dosya**: `src/components/ads/AdQueue.tsx`

**Özellikler**:
- Birden fazla reklamı sırayla izleme
- İlerleme çubuğu
- Toplam kazanç önizlemesi
- Sıradaki reklamlar önizlemesi
- Otomatik sıradaki reklama geçiş

**Kullanım**:
```tsx
import { AdQueue } from '@/components/ads';

<AdQueue 
  onQueueComplete={(totalTickets) => {
    console.log(`Toplam ${totalTickets} bilet kazandınız!`);
  }}
/>
```

**Watch ekranında kullanım**:
```tsx
// app/(tabs)/watch.tsx içinde
import { AdQueue } from '@/components/ads';

// Mevcut AdPlayer yerine:
{canWatchAds ? (
  <AdQueue 
    onQueueComplete={(totalTickets) => {
      Alert.alert('Tebrikler!', `Toplam ${totalTickets} bilet kazandınız!`);
    }}
  />
) : (
  // Inactive message
)}
```

---

### 2. Rozet ve Başarım Sistemi (`BadgeSystem`)
**Dosya**: `src/components/gamification/BadgeSystem.tsx`

**Özellikler**:
- Rozet koleksiyonu görüntüleme
- İlerleme takibi
- Nadirlik seviyeleri (common, rare, epic, legendary)
- Kazanılan/kazanılacak rozetler ayrımı

**Kullanım**:
```tsx
import { BadgeSystem, BadgeType, type Badge } from '@/components/gamification';

const badges: Badge[] = [
  {
    id: '1',
    type: BadgeType.FIRST_AD,
    name: 'İlk Adım',
    description: 'İlk reklamınızı izleyin',
    icon: '🎬',
    earned: true,
    earnedAt: new Date().toISOString(),
    rarity: 'common',
  },
  // ... diğer rozetler
];

<BadgeSystem 
  badges={badges}
  totalAdsWatched={50}
  currentStreak={5}
/>
```

**Profil ekranında kullanım**:
```tsx
// app/(tabs)/profile.tsx içine ekle
import { BadgeSystem } from '@/components/gamification';

// Profil kartlarından sonra:
<Card style={styles.card}>
  <CardHeader title="Rozetlerim" />
  <BadgeSystem 
    badges={userBadges}
    totalAdsWatched={totalAdsWatched}
    currentStreak={currentStreak}
  />
</Card>
```

---

## 🔧 Backend Entegrasyonu Gereksinimleri

### Badge Sistemi için Database Schema

```sql
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    rarity VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (badge_id) REFERENCES badges(id),
    UNIQUE(user_id, badge_id)
);

CREATE TABLE user_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    total_ads_watched INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_ad_watched_date DATE,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

```typescript
// Badge endpoints
GET /api/badges - Tüm rozetleri getir
GET /api/badges/user/:userId - Kullanıcının rozetlerini getir
POST /api/badges/check - Kullanıcı için yeni rozet kontrolü

// Stats endpoints
GET /api/stats/user/:userId - Kullanıcı istatistikleri
POST /api/stats/increment-ads - Reklam izlenme sayısını artır
POST /api/stats/update-streak - Streak güncelle
```

---

## 📱 State Management Güncellemeleri

### Badge Store (Zustand)

```typescript
// src/store/badgeStore.ts
import { create } from 'zustand';
import { Badge } from '@/components/gamification';

interface BadgeStore {
  badges: Badge[];
  totalAdsWatched: number;
  currentStreak: number;
  setBadges: (badges: Badge[]) => void;
  addBadge: (badge: Badge) => void;
  incrementAdsWatched: () => void;
  updateStreak: (streak: number) => void;
}

export const useBadgeStore = create<BadgeStore>((set) => ({
  badges: [],
  totalAdsWatched: 0,
  currentStreak: 0,
  setBadges: (badges) => set({ badges }),
  addBadge: (badge) => set((state) => ({
    badges: [...state.badges, badge]
  })),
  incrementAdsWatched: () => set((state) => ({
    totalAdsWatched: state.totalAdsWatched + 1
  })),
  updateStreak: (streak) => set({ currentStreak: streak }),
}));
```

---

## 🎯 Sonraki Adımlar

### 1. Bildirim Sistemi
- Firebase Cloud Messaging kurulumu
- Push notification servisi
- Bildirim tercihleri ayarları

### 2. Streak Sistemi
- Günlük streak takibi
- Streak bonus hesaplama
- Streak kaybetme uyarıları

### 3. Liderlik Tablosu
- Leaderboard component
- Backend ranking endpoint
- Real-time güncellemeler

### 4. Kullanıcı İstatistikleri Dashboard
- Chart kütüphanesi (recharts)
- Grafik component'leri
- Filtreleme seçenekleri

---

## 🚀 Hızlı Test

### AdQueue Testi
1. `watch.tsx` dosyasını açın
2. `AdPlayer` yerine `AdQueue` kullanın
3. Uygulamayı çalıştırın ve reklam izleme ekranına gidin
4. Birden fazla reklamın sırayla gösterildiğini kontrol edin

### BadgeSystem Testi
1. `profile.tsx` dosyasını açın
2. `BadgeSystem` component'ini ekleyin
3. Mock badge data'sı oluşturun
4. Rozetlerin görüntülendiğini kontrol edin

---

## 📝 Notlar

- Tüm yeni component'ler TypeScript ile yazıldı
- Mevcut design system (colors, sizes) kullanıldı
- Responsive tasarım uygulandı
- Linter hataları kontrol edildi
- Backend entegrasyonu için TODO'lar eklendi

---

## 🔗 İlgili Dosyalar

- `AD_FEATURE_SUGGESTIONS.md` - Tüm özellik önerileri
- `src/components/ads/AdQueue.tsx` - Reklam kuyruğu implementasyonu
- `src/components/gamification/BadgeSystem.tsx` - Rozet sistemi implementasyonu
- `src/components/ads/index.ts` - Export güncellemesi
- `src/components/gamification/index.ts` - Yeni export dosyası


