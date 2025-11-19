# Docker Setup Guide

## Docker Compose Kullanımı

### Tüm Servisleri Başlatma
```bash
docker-compose up -d
```

### Development Mode (Hot Reload)
```bash
docker-compose -f docker-compose.dev.yml up
```

### Servisleri Durdurma
```bash
docker-compose down
```

### Servisleri Durdurup Volumes'ları Silme
```bash
docker-compose down -v
```

### Logları Görüntüleme
```bash
# Tüm servisler
docker-compose logs -f

# Sadece backend
docker-compose logs -f backend

# Sadece frontend
docker-compose logs -f frontend
```

## Servisler

### PostgreSQL
- **Port**: 5432
- **Database**: cursor_raffle
- **User**: postgres
- **Password**: 1234
- **Volume**: postgres_data (kalıcı veri)

### Backend (Spring Boot)
- **Port**: 8080
- **Health Check**: http://localhost:8080/actuator/health
- **API**: http://localhost:8080/api
- **Build**: Multi-stage Maven build
- **Runtime**: Java 21 JRE Alpine

### Frontend (Expo)
- **Port**: 8081 (Expo web)
- **Port**: 19000 (Metro bundler)
- **Port**: 19001 (Expo DevTools)
- **Build**: Node.js 20 Alpine
- **Hot Reload**: Enabled in dev mode

## Environment Variables

Backend environment variables docker-compose.yml içinde tanımlı. Değiştirmek için:

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/cursor_raffle
  SPRING_DATASOURCE_USERNAME: postgres
  SPRING_DATASOURCE_PASSWORD: your_password
```

## Development Workflow

### 1. İlk Kurulum
```bash
# Clone repository
git clone <repo-url>
cd CursorRaffle

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 2. Backend Geliştirme
```bash
# Backend logs
docker-compose logs -f backend

# Backend shell
docker-compose exec backend sh

# Rebuild backend
docker-compose build backend
docker-compose up -d backend
```

### 3. Frontend Geliştirme
```bash
# Frontend logs
docker-compose logs -f frontend

# Frontend shell
docker-compose exec frontend sh

# Install new packages
docker-compose exec frontend npm install <package>
```

### 4. Database İşlemleri
```bash
# PostgreSQL shell
docker-compose exec postgres psql -U postgres -d cursor_raffle

# Backup
docker-compose exec postgres pg_dump -U postgres cursor_raffle > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres cursor_raffle < backup.sql
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# Kill process or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild
docker-compose build --no-cache <service-name>
docker-compose up -d <service-name>
```

### Database Connection Issues
```bash
# Check if postgres is healthy
docker-compose ps

# Check postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Frontend Can't Connect to Backend
- Backend'in `http://localhost:8080/api` adresinde çalıştığını kontrol edin
- Frontend environment variable'ını kontrol edin: `EXPO_PUBLIC_API_URL`
- Network ayarlarını kontrol edin: `cursor-raffle-network`

## Production Deployment

Production için:
1. Environment variables'ları `.env` dosyasına taşıyın
2. Secrets'ları Docker secrets veya environment variables ile yönetin
3. Health checks'i aktif tutun
4. Resource limits ekleyin
5. Reverse proxy (nginx) kullanın

