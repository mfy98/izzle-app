# 🔍 Proje Analizi - Cursor Raffle

## 📊 Genel Bakış

**Cursor Raffle**, reklam izleme karşılığında çekiliş hakkı kazanan bir mobil uygulamadır. React Native (Expo) frontend ve Spring Boot backend kullanılarak geliştirilmiştir.

---

## 🏗️ Mimari Yapı

### Backend (Spring Boot)
- **Port**: 8080
- **Database**: PostgreSQL (port 5432)
- **Storage**: MinIO (S3-compatible, port 9000)
- **Monitoring**: Prometheus (9090), Grafana (3001)

### Frontend (React Native/Expo)
- **Port**: 8081 (web), 19000-19001 (Expo dev server)
- **Framework**: Expo Router (file-based routing)
- **State Management**: Zustand
- **API Client**: Axios

---

## 🔄 Sistem Akışı

### 1. Authentication Flow

```
User → Frontend (Login Screen)
  ↓
POST /api/auth/login
  ↓
Backend → JWT Token Generate
  ↓
Frontend → Store Token (AsyncStorage)
  ↓
Redirect → Home Screen
```

**Backend Endpoints:**
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `POST /api/auth/register/advertiser` - Reklam veren kaydı

**Frontend:**
- `src/app/login.tsx` - Login screen
- `src/app/register.tsx` - User registration
- `src/store/authStore.ts` - Auth state management
- `src/services/api/client.ts` - API client with JWT interceptor

---

### 2. Sprint System Flow

```
User → Home Screen
  ↓
GET /api/sprint/current
  ↓
Backend → Check Active Sprint
  ↓
Frontend → Display Sprint Timer
  ↓
User → Watch Ad (during active sprint)
  ↓
POST /api/ads/view
  ↓
Backend → Award Raffle Tickets
```

**Backend Endpoints:**
- `GET /api/sprint/current` - Aktif sprint
- `GET /api/sprint/next` - Sonraki sprint

**Frontend:**
- `src/hooks/useSprint.ts` - Sprint data hook
- `app/(tabs)/home.tsx` - Sprint timer display
- `app/(tabs)/watch.tsx` - Ad watching screen

---

### 3. Ad Viewing Flow

```
User → Watch Ad Screen
  ↓
GET /api/ads/active
  ↓
Backend → Return Active Ad
  ↓
Frontend → Play Video Ad
  ↓
User Watches Ad (min 15 seconds)
  ↓
POST /api/ads/view
  ↓
Backend → Record View + Award Tickets
  ↓
Spring Event: AdViewedEvent
  ↓
Frontend → Show Success Message
```

**Backend Endpoints:**
- `GET /api/ads/active` - Aktif reklamlar
- `GET /api/ads/banners` - Banner reklamlar
- `GET /api/ads/cover` - Cover reklam
- `POST /api/ads/view` - Reklam izlenme kaydı

**Backend Services:**
- `AdService.java` - Ad business logic
- `AdUploadService.java` - Ad upload workflow
- `GoogleAdsService.java` - Google Ads fallback

**Frontend:**
- `src/components/ads/AdPlayer.tsx` - Video player
- `src/components/ads/AdBanner.tsx` - Banner ads
- `src/components/ads/AdCover.tsx` - Cover ads
- `src/hooks/useAds.ts` - Ad data hook

---

### 4. Raffle System Flow

```
Sprint Ends
  ↓
Backend → Create Raffle
  ↓
Select Winners (based on tickets)
  ↓
GET /api/raffle/active
  ↓
Frontend → Display Winners
```

**Backend Endpoints:**
- `GET /api/raffle/active` - Aktif çekilişler
- `GET /api/raffle/pending` - Bekleyen çekilişler
- `GET /api/raffle/winners` - Kazananlar

**Frontend:**
- `app/(tabs)/raffle.tsx` - Raffle screen
- `src/store/raffleStore.ts` - Raffle state

---

### 5. Ad Upload Flow (Advertiser)

```
Advertiser → Profile → Ad Upload
  ↓
Select Video/Image
  ↓
POST /api/advertiser/ads/upload
  ↓
Backend → Validate File
  ↓
Upload to S3/MinIO
  ↓
Save Metadata (Status: PENDING)
  ↓
Spring Event: AdUploadedEvent
  ↓
Admin Approval
  ↓
POST /api/admin/ads/{id}/approve
  ↓
Backend → Make S3 Public
  ↓
Generate CDN URL (optional)
  ↓
Spring Event: AdApprovedEvent
  ↓
Ad Active
```

**Backend Endpoints:**
- `POST /api/advertiser/ads/upload` - Reklam yükleme
- `POST /api/admin/ads/{id}/approve` - Admin onayı
- `POST /api/admin/ads/{id}/reject` - Admin reddi

**Backend Services:**
- `S3Service.java` - S3/MinIO operations
- `CdnService.java` - CDN URL generation (optional)
- `AdUploadService.java` - Upload workflow

**Frontend:**
- `src/components/ads/AdUploadForm.tsx` - Upload form
- `app/(tabs)/profile.tsx` - Profile screen (advertiser actions)

---

## 🗄️ Database Schema

### Main Entities

1. **User** - Kullanıcı bilgileri
   - id, email, password, name, surname, phone
   - address (embedded), role, raffleMultiplier
   - isActive, createdAt, updatedAt

2. **Advertiser** - Reklam veren
   - id, companyName, taxNumber, contactEmail
   - user (OneToOne), ads (OneToMany)

3. **Ad** - Reklam
   - id, advertiserId, type (SPONSOR, BANNER, COVER)
   - title, videoUrl, bannerUrl, coverUrl
   - sourceUrl (S3), cdnUrl (optional)
   - uploadStatus (PENDING, UPLOADED, APPROVED, REJECTED)
   - startDate, endDate, isActive
   - impressionCount, clickCount

4. **Sprint** - Sprint dönemi
   - id, startTime, endTime, status
   - totalViews, totalParticipants
   - raffle (OneToOne)

5. **Raffle** - Çekiliş
   - id, sprint (OneToOne), status
   - drawDate, totalTickets
   - prizes (OneToMany), winners (OneToMany)

6. **RaffleTicket** - Çekiliş bileti
   - id, user, sprint, adView
   - earnedAt, multiplier

7. **AdView** - Reklam izlenme kaydı
   - id, user, ad, sprint
   - viewDuration, isCompleted, viewedAt

---

## 🔐 Security

### JWT Authentication

**Token Structure:**
- Access Token: 24 saat geçerli
- Refresh Token: 7 gün geçerli

**Security Config:**
- Public endpoints: `/api/auth/**`, `/api/public/**`
- Protected endpoints: JWT token required
- CORS: Frontend origins allowed

**Frontend Token Handling:**
- Stored in AsyncStorage
- Auto-added to requests via interceptor
- Auto-refresh on 401 error

---

## 📦 Storage Architecture

### S3/MinIO Storage

**Flow:**
```
Advertiser Upload
  ↓
Backend → S3/MinIO (Private)
  ↓
Admin Approval
  ↓
S3 Object → Public
  ↓
CDN URL Generation (optional)
  ↓
Frontend → Load from S3/CDN
```

**Services:**
- `S3Service.java` - Upload, make public, presigned URLs
- `CdnService.java` - CDN URL generation (disabled by default)

**Configuration:**
- `application-storage.yml` - S3/CDN config
- Default: CDN disabled (MVP için)

---

## 🎯 Event Handling

### Spring Events (Kafka yerine)

**Event Types:**
1. `AdUploadedEvent` - Reklam yüklendiğinde
2. `AdApprovedEvent` - Reklam onaylandığında
3. `AdViewedEvent` - Reklam izlendiğinde

**Event Listeners:**
- `AdEventListener.java` - Event handlers
- `@Async` - Async processing
- `AsyncConfig.java` - Thread pool config

**Flow:**
```
Service → publishEvent()
  ↓
Spring Event Bus
  ↓
@EventListener → handleEvent()
  ↓
Async Processing
```

---

## 🚀 Projeyi Başlatma

### 1. Docker Compose ile (Önerilen)

```bash
# Tüm servisleri başlat
docker-compose up -d

# Storage servisini başlat (MinIO)
docker-compose -f docker-compose.storage.yml up -d

# Servisleri kontrol et
docker-compose ps

# Logları izle
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Servisler:**
- Backend: http://localhost:8080
- Frontend: http://localhost:8081
- PostgreSQL: localhost:5432
- MinIO: http://localhost:9000 (API), http://localhost:9001 (Console)
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

### 2. Manuel Başlatma

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
npm install
npm start
# veya
npx expo start
```

---

## 📱 Frontend Yapısı

### Tab Navigation

1. **Home** (`app/(tabs)/home.tsx`)
   - Sprint timer
   - Cover ads
   - Banner ads
   - User stats

2. **Watch** (`app/(tabs)/watch.tsx`)
   - Ad player
   - Ticket counter
   - Sprint status

3. **Raffle** (`app/(tabs)/raffle.tsx`)
   - Active raffles
   - Winners
   - Rules

4. **Profile** (`app/(tabs)/profile.tsx`)
   - User info
   - Address
   - Raffle stats
   - Role-based actions

5. **Admin Panel** (`app/(tabs)/admin-panel.tsx`)
   - Ad scheduling
   - Ad approval
   - System management

### State Management

**Zustand Stores:**
- `authStore.ts` - Authentication state
- `sprintStore.ts` - Sprint state
- `raffleStore.ts` - Raffle state

**TanStack Query:**
- Server state management
- Caching
- Auto-refetch

---

## 🔧 Configuration

### Backend Config

**application.yml:**
- Database connection
- JWT settings
- CORS origins
- Logging levels

**application-storage.yml:**
- S3/MinIO config
- CDN config (disabled by default)

### Frontend Config

**config.ts:**
- API base URL: `http://localhost:8080/api`
- Sprint duration: 60 minutes
- Min ad view duration: 15 seconds

**Environment Variables:**
- `EXPO_PUBLIC_API_URL` - API URL

---

## 📊 Monitoring

### Prometheus Metrics

**Endpoints:**
- `/actuator/metrics` - All metrics
- `/actuator/prometheus` - Prometheus format

**Metrics:**
- HTTP requests
- Database connections
- JVM metrics
- Custom business metrics

### Grafana Dashboards

**Access:**
- URL: http://localhost:3001
- User: admin
- Password: admin

**Dashboards:**
- System metrics
- Application metrics
- Database metrics

---

## 🐛 Debugging

### Backend Logs

```bash
# Docker logs
docker-compose logs -f backend

# Application logs
tail -f backend/logs/application.log
```

**Log Levels:**
- DEBUG: `com.cursorraffle`
- INFO: Root
- SQL: `org.hibernate.SQL`

### Frontend Debugging

**Expo Dev Tools:**
- Open http://localhost:19000
- React Native Debugger
- Network inspector

**Console Logs:**
- Browser console (web)
- React Native Debugger
- Expo Go app logs

---

## ✅ Test Endpoints

### Health Check

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost:8081
```

### API Test

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test","surname":"User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get current sprint
curl http://localhost:8080/api/sprint/current \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Özet

**Backend:**
- Spring Boot REST API
- PostgreSQL database
- JWT authentication
- S3/MinIO storage
- Spring Events (async)
- Prometheus metrics

**Frontend:**
- React Native (Expo)
- Expo Router navigation
- Zustand state management
- TanStack Query
- Axios API client

**Flow:**
1. User registers/logs in
2. Sprint system tracks time periods
3. User watches ads during active sprint
4. System awards raffle tickets
5. Sprint ends → Raffle drawn
6. Winners announced

**Storage:**
- S3/MinIO for ad files
- CDN optional (disabled for MVP)
- Spring Events for async processing

---

## 📝 Notlar

- Backend port: 8080 (not 3000 as in some docs)
- Frontend uses mock data for now (TODO comments)
- CDN disabled by default (MVP için)
- Kafka removed, using Spring Events instead
- MinIO console: http://localhost:9001 (minioadmin/minioadmin123)


