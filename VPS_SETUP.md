# 🚀 VPS Kurulum Rehberi

## 📋 VPS Kullanmanın Avantajları

1. ✅ **Public IP**: Her yerden erişilebilir
2. ✅ **HTTPS Desteği**: Let's Encrypt ile ücretsiz SSL
3. ✅ **Expo Go Uyumlu**: Fiziksel cihazda sorunsuz çalışır
4. ✅ **Production Ready**: Aynı altyapıyı production'da kullanabilirsiniz

---

## 🔧 VPS Kurulum Adımları

### 1. VPS Satın Alma

Önerilen VPS sağlayıcıları:
- **DigitalOcean**: $6/ay (1GB RAM, 1 vCPU)
- **Linode**: $5/ay (1GB RAM, 1 vCPU)
- **Vultr**: $6/ay (1GB RAM, 1 vCPU)
- **Hetzner**: €4.15/ay (2GB RAM, 1 vCPU) - En uygun

Minimum gereksinimler:
- 1GB RAM
- 1 vCPU
- 20GB SSD
- Ubuntu 22.04 LTS

### 2. VPS'e Bağlanma

```bash
ssh root@YOUR_VPS_IP
```

### 3. Sistem Güncelleme

```bash
apt update && apt upgrade -y
```

### 4. Java 17 Kurulumu

```bash
apt install -y openjdk-17-jdk
java -version  # Kontrol et
```

### 5. Maven Kurulumu

```bash
apt install -y maven
mvn -version  # Kontrol et
```

### 6. PostgreSQL Kurulumu

```bash
apt install -y postgresql postgresql-contrib

# PostgreSQL'i başlat
systemctl start postgresql
systemctl enable postgresql

# Veritabanı oluştur
sudo -u postgres psql
```

PostgreSQL içinde:
```sql
CREATE DATABASE cursorraffle;
CREATE USER postgres WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cursorraffle TO postgres;
\q
```

### 7. Backend'i VPS'e Kopyalama

**Seçenek 1: Git ile**
```bash
cd /opt
git clone YOUR_REPO_URL
cd cursor-raffle/backend
```

**Seçenek 2: SCP ile (lokal bilgisayardan)**
```bash
# Lokal bilgisayarınızda
scp -r backend root@YOUR_VPS_IP:/opt/cursor-raffle/
```

### 8. Backend Konfigürasyonu

`backend/src/main/resources/application.properties` dosyasını düzenleyin:

```properties
spring.r2dbc.url=r2dbc:postgresql://localhost:5432/cursorraffle
spring.r2dbc.username=postgres
spring.r2dbc.password=your_secure_password
```

### 9. Firewall Ayarları

```bash
# UFW firewall kurulumu
apt install -y ufw

# Portları aç
ufw allow 22/tcp    # SSH
ufw allow 8080/tcp  # Backend
ufw enable
ufw status
```

### 10. Backend'i Çalıştırma

**Development (test için):**
```bash
cd /opt/cursor-raffle/backend
mvn spring-boot:run
```

**Production (arka planda):**
```bash
cd /opt/cursor-raffle/backend
nohup mvn spring-boot:run > backend.log 2>&1 &
```

**Systemd Service (önerilen):**
```bash
# /etc/systemd/system/cursor-raffle-backend.service dosyası oluştur
sudo nano /etc/systemd/system/cursor-raffle-backend.service
```

İçeriği:
```ini
[Unit]
Description=Cursor Raffle Backend
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/cursor-raffle/backend
ExecStart=/usr/bin/mvn spring-boot:run
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Servisi başlat:
```bash
systemctl daemon-reload
systemctl enable cursor-raffle-backend
systemctl start cursor-raffle-backend
systemctl status cursor-raffle-backend
```

---

## 📱 Frontend Konfigürasyonu

### 1. Config Dosyasını Güncelleme

`src/constants/config.ts` dosyasında:

```typescript
const VPS_IP = 'YOUR_VPS_IP_HERE'; // VPS IP'nizi buraya yazın
const USE_VPS = true; // VPS kullanmak için true yapın
```

### 2. Environment Variable Kullanımı (Önerilen)

`.env` dosyası oluşturun:
```bash
EXPO_PUBLIC_API_URL=http://YOUR_VPS_IP:8080/api
```

Veya `app.json` içinde:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://YOUR_VPS_IP:8080/api"
    }
  }
}
```

---

## 🔒 HTTPS Kurulumu (Önerilen)

### Let's Encrypt ile Ücretsiz SSL

```bash
# Certbot kurulumu
apt install -y certbot

# Nginx kurulumu (reverse proxy için)
apt install -y nginx

# Nginx konfigürasyonu
nano /etc/nginx/sites-available/cursor-raffle
```

Nginx config:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/cursor-raffle /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# SSL sertifikası al
certbot --nginx -d YOUR_DOMAIN_OR_IP
```

HTTPS kullanımı için config'i güncelleyin:
```typescript
const apiUrl = 'https://YOUR_DOMAIN_OR_IP/api';
```

---

## ✅ Test Etme

### Backend Test

```bash
# VPS'te
curl http://localhost:8080/api/time/stream

# Lokal bilgisayardan
curl http://YOUR_VPS_IP:8080/api/time/stream
```

### Frontend Test

1. Config'i VPS IP'si ile güncelleyin
2. Metro bundler'ı yeniden başlatın
3. Expo Go'da uygulamayı test edin

---

## 🐛 Sorun Giderme

### Backend'e Erişilemiyor

1. **Firewall kontrolü:**
   ```bash
   ufw status
   ufw allow 8080/tcp
   ```

2. **Backend çalışıyor mu:**
   ```bash
   systemctl status cursor-raffle-backend
   netstat -tlnp | grep 8080
   ```

3. **VPS sağlayıcısının firewall'u:**
   - DigitalOcean: Networking > Firewalls
   - Vultr: Settings > Firewall
   - Hetzner: Firewalls sekmesi

### Database Bağlantı Hatası

```bash
# PostgreSQL çalışıyor mu?
systemctl status postgresql

# Bağlantı testi
sudo -u postgres psql -d cursorraffle
```

### Port Zaten Kullanımda

```bash
# Hangi process 8080 portunu kullanıyor?
lsof -i :8080
# veya
netstat -tlnp | grep 8080
```

---

## 📊 Monitoring

### Backend Logları

```bash
# Systemd service logları
journalctl -u cursor-raffle-backend -f

# Manuel log dosyası
tail -f /opt/cursor-raffle/backend/backend.log
```

### Resource Kullanımı

```bash
# CPU ve RAM kullanımı
htop
# veya
top

# Disk kullanımı
df -h
```

---

## 🚀 Production İpuçları

1. **PM2 veya Systemd kullanın** - Otomatik restart
2. **Nginx reverse proxy** - SSL ve load balancing
3. **Database backup** - Düzenli yedekleme
4. **Monitoring** - Uptime ve performance tracking
5. **Log rotation** - Log dosyalarını düzenli temizleme

---

## 💰 Maliyet Tahmini

- **VPS**: $5-10/ay
- **Domain**: $10-15/yıl (opsiyonel)
- **SSL**: Ücretsiz (Let's Encrypt)
- **Toplam**: ~$5-10/ay

---

## 📝 Notlar

- VPS IP'si değişmez (static IP)
- HTTPS kullanmak production için önerilir
- Database backup'ları düzenli alın
- Firewall kurallarını dikkatli yapılandırın

