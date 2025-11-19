FROM postgres:16-alpine

# Install backup utilities
RUN apk add --no-cache bash curl

# Copy backup scripts
COPY postgres-backup.sh /backup/postgres-backup.sh
COPY postgres-restore.sh /backup/postgres-restore.sh
COPY cron-backup.sh /backup/cron-backup.sh

RUN chmod +x /backup/*.sh

# Create backup directories
RUN mkdir -p /backups/basebackups /backups/wal_archive

# Setup PostgreSQL for WAL archiving
RUN echo "archive_mode = on" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "archive_command = '/backup/postgres-backup.sh archive %p'" >> /usr/local/share/postgresql/postgresql.conf.sample

WORKDIR /backup

CMD ["/backup/postgres-backup.sh", "backup"]

