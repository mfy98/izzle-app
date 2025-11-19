# Backup & Recovery Guide

## PostgreSQL Backup Strategy

### Full Backup (Base Backup)
- **Frequency**: Daily at 2:00 AM
- **Retention**: 7 days or last 5 backups
- **Location**: `/backups/basebackups/`
- **Method**: `pg_basebackup`

### WAL Archiving (Point-In-Time Recovery)
- **Mode**: Continuous WAL archiving
- **Location**: `/backups/wal_archive/`
- **Compression**: After 1 hour
- **Purpose**: Enable PITR to any point in time

## Backup Commands

### Manual Backup
```bash
docker-compose exec postgres-backup /backup/postgres-backup.sh backup
```

### List Backups
```bash
docker-compose exec postgres-backup /backup/postgres-restore.sh list
```

### Point-In-Time Recovery
```bash
# Restore to specific time
docker-compose exec postgres-backup /backup/postgres-restore.sh restore 20240115_020000 "2024-01-15 10:30:00"

# Restore to latest
docker-compose exec postgres-backup /backup/postgres-restore.sh restore 20240115_020000
```

## Recovery Scenarios

### 1. Full Database Restore
```bash
# Stop application
docker-compose stop backend frontend

# Restore from backup
docker-compose exec postgres-backup /backup/postgres-restore.sh restore <backup_date>

# Start PostgreSQL
docker-compose start postgres

# Verify and start application
docker-compose start backend frontend
```

### 2. Point-In-Time Recovery
```bash
# Stop application
docker-compose stop backend frontend

# Restore to specific time
docker-compose exec postgres-backup /backup/postgres-restore.sh restore <backup_date> "2024-01-15 14:30:00"

# PostgreSQL will automatically recover using WAL files
```

## Backup Verification

```bash
# Check backup integrity
docker-compose exec postgres-backup ls -lh /backups/basebackups/

# Check WAL archive
docker-compose exec postgres-backup ls -lh /backups/wal_archive/

# Verify backup contains data
docker-compose exec postgres-backup tar -tzf /backups/basebackups/basebackup_*/base.tar.gz | head -20
```

## Backup Storage

### Local Storage
- Default: Docker volumes
- Persistent across container restarts

### External Storage (Recommended for Production)
1. **S3/MinIO**: Upload backups to object storage
2. **NFS**: Network file system
3. **Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob

### S3 Integration Example
```bash
# Add to postgres-backup.sh
aws s3 cp "${backup_path}" s3://your-bucket/backups/${DATE}/ --recursive
aws s3 cp "${WAL_ARCHIVE_DIR}" s3://your-bucket/wal-archive/ --recursive
```

## Monitoring Backups

```bash
# Check backup logs
docker-compose logs postgres-backup

# Check backup size
docker-compose exec postgres-backup du -sh /backups/basebackups/*

# Check disk usage
docker-compose exec postgres-backup df -h
```

## Best Practices

1. **Test Restores Regularly**: Monthly restore tests
2. **Offsite Backups**: Copy to external storage
3. **Backup Encryption**: Encrypt sensitive backups
4. **Monitoring**: Alert on backup failures
5. **Documentation**: Keep recovery procedures documented

