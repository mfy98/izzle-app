# Quick Start Guide

## 🚀 Hızlı Başlangıç

### Docker ile (Önerilen)

```bash
# Tüm servisleri başlat (Backend + Frontend + PostgreSQL)
docker-compose up -d

# Logları izle
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

**Erişim:**
- Backend API: http://localhost:8080/api
- Frontend: http://localhost:8081
- PostgreSQL: localhost:5432

### Manuel Kurulum

#### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend
```bash
npm install
npm start
```

## 📝 Test Çalıştırma

```bash
# Tüm testler
npm test

# Coverage raporu
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🐳 Docker Komutları

```bash
# Tüm servisleri başlat
docker-compose up -d

# Sadece backend rebuild
docker-compose build backend
docker-compose up -d backend

# Database backup
docker-compose exec postgres pg_dump -U postgres cursor_raffle > backup.sql

# Logları izle
docker-compose logs -f backend
```

## 📱 Frontend Geliştirme

```bash
npm start              # Expo dev server
npm run android        # Android emulator
npm run ios           # iOS simulator
```

## 🔧 Backend Geliştirme

```bash
cd backend
mvn spring-boot:run   # Backend başlat
mvn test             # Test çalıştır
```

## 📊 API Test

Backend başladıktan sonra:
- Health Check: http://localhost:8080/actuator/health
- API Docs: http://localhost:8080/api

## 🐛 Troubleshooting

### Port çakışması
```bash
# Portları kontrol et
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# Docker compose portlarını değiştir
```

### Database bağlantı hatası
```bash
# PostgreSQL'in çalıştığını kontrol et
docker-compose ps postgres

# Logları kontrol et
docker-compose logs postgres
```

