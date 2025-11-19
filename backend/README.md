# Cursor Raffle Backend

Spring Boot 3.2 + Java 21 + PostgreSQL backend API for Cursor Raffle application.

## Tech Stack

- **Java 21**
- **Spring Boot 3.2.0**
- **PostgreSQL**
- **Spring Security + JWT**
- **Spring Data JPA**
- **Lombok**
- **MapStruct**

## Setup

### Prerequisites

1. Java 21
2. Maven 3.8+
3. PostgreSQL 12+

### Database Setup

```sql
CREATE DATABASE cursor_raffle;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE cursor_raffle TO postgres;
```

### Configuration

Update `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/cursor_raffle
    username: your_username
    password: your_password
  
  security:
    jwt:
      secret: your-secret-key-minimum-32-characters
```

### Run

```bash
mvn spring-boot:run
```

API will be available at: `http://localhost:3000/api`

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Sprint
- `GET /api/sprint/current` - Get current sprint
- `GET /api/sprint/next` - Get next sprint

### Ads
- `GET /api/ads/active` - Get active ads
- `POST /api/ads/view` - Record ad view

### Raffle
- `GET /api/raffle/active` - Get active raffles
- `GET /api/raffle/winners` - Get winners

## Project Structure

```
src/main/java/com/cursorraffle/
├── entity/          # JPA entities
├── repository/      # JPA repositories
├── service/         # Business logic
├── controller/     # REST controllers
├── dto/            # Data Transfer Objects
├── config/         # Configuration classes
├── security/       # Security & JWT
└── exception/      # Exception handling
```

## Notes

- JWT secret should be at least 32 characters
- Change database credentials in application.yml
- CORS is configured for Expo dev servers

