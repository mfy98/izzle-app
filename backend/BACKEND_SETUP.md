# Backend Setup Guide

## Tamamlanan Özellikler

### ✅ Entity Layer
- User, Advertiser, Ad, Sprint, Raffle, Prize, Winner, RaffleTicket
- BaseEntity with audit fields
- Enum types (UserRole, AdType, SprintStatus, RaffleStatus)

### ✅ Repository Layer
- Tüm entity'ler için JPA repositories
- Custom queries (active sprints, active ads, vb.)

### ✅ Security
- JWT authentication
- Spring Security configuration
- Password encryption (BCrypt)
- CORS configuration

### ✅ Service Layer
- AuthService (register, login)
- SprintService (current/next sprint)
- AdService (ad viewing, ticket awarding)
- RaffleService (raffle management)

### ✅ Controller Layer
- AuthController
- SprintController
- AdController
- RaffleController

### ✅ Exception Handling
- Global exception handler
- Custom exceptions
- Validation error handling

## Kurulum

1. PostgreSQL veritabanını oluşturun:
```sql
CREATE DATABASE cursor_raffle;
```

2. `application.yml` dosyasındaki database bilgilerini güncelleyin

3. JWT secret key'i değiştirin (en az 32 karakter)

4. Maven dependencies yükleyin:
```bash
cd backend
mvn clean install
```

5. Uygulamayı çalıştırın:
```bash
mvn spring-boot:run
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Sprint
- `GET /api/sprint/current` - Aktif sprint
- `GET /api/sprint/next` - Sonraki sprint

### Ads
- `GET /api/ads/active` - Aktif reklamlar
- `GET /api/ads/banners` - Banner reklamlar
- `GET /api/ads/cover` - Cover reklam
- `POST /api/ads/view` - Reklam izleme kaydı

### Raffle
- `GET /api/raffle/active` - Aktif çekilişler
- `GET /api/raffle/pending` - Bekleyen çekilişler
- `GET /api/raffle/winners` - Kazananlar

## Notlar

- Backend port: 3000
- Frontend'in `config.ts` dosyasında API URL'i güncelleyin:
  - `apiBaseUrl: 'http://localhost:3000/api'`

## Eksik Özellikler (İleride Eklenebilir)

- [ ] Admin panel endpoints
- [ ] Advertiser management endpoints
- [ ] File upload (logo, video)
- [ ] Raffle drawing algorithm
- [ ] Multiplier update logic (after raffle)
- [ ] Email notifications
- [ ] WebSocket for real-time updates

