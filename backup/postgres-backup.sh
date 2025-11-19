#!/bin/bash

# PostgreSQL Backup Script with PITR Support
# This script performs full backup and manages WAL archiving

set -euo pipefail

# Configuration
BACKUP_DIR="/backups"
WAL_ARCHIVE_DIR="/backups/wal_archive"
BASEBACKUP_DIR="${BACKUP_DIR}/basebackups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7
RETENTION_BACKUPS=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create directories if they don't exist
mkdir -p "${BASEBACKUP_DIR}"
mkdir -p "${WAL_ARCHIVE_DIR}"

# Full Base Backup
perform_basebackup() {
    log "Starting base backup..."
    
    local backup_path="${BASEBACKUP_DIR}/basebackup_${DATE}"
    
    # Perform base backup
    pg_basebackup \
        -h localhost \
        -U postgres \
        -D "${backup_path}" \
        -Ft \
        -z \
        -P \
        -W \
        -v
    
    if [ $? -eq 0 ]; then
        log "Base backup completed successfully: ${backup_path}"
        
        # Create recovery file
        cat > "${backup_path}/recovery.conf" << EOF
restore_command = 'cp ${WAL_ARCHIVE_DIR}/%f %p'
recovery_target_time = ''
recovery_target_timeline = 'latest'
EOF
        
        echo "${DATE}" > "${backup_path}/BACKUP_DATE.txt"
        echo "Base backup created at ${DATE}" >> "${backup_path}/BACKUP_INFO.txt"
        
        return 0
    else
        error "Base backup failed!"
        return 1
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    # Remove backups older than retention days
    find "${BASEBACKUP_DIR}" -type d -name "basebackup_*" -mtime +${RETENTION_DAYS} -exec rm -rf {} + 2>/dev/null || true
    
    # Keep only last N backups
    local backup_count=$(find "${BASEBACKUP_DIR}" -type d -name "basebackup_*" | wc -l)
    if [ "${backup_count}" -gt "${RETENTION_BACKUPS}" ]; then
        log "Found ${backup_count} backups, keeping last ${RETENTION_BACKUPS}"
        find "${BASEBACKUP_DIR}" -type d -name "basebackup_*" -printf '%T@ %p\n' | \
            sort -n | \
            head -n -${RETENTION_BACKUPS} | \
            cut -d' ' -f2- | \
            xargs rm -rf 2>/dev/null || true
    fi
    
    log "Cleanup completed"
}

# WAL Archiving Setup (called by PostgreSQL)
archive_wal() {
    local wal_file=$1
    local archive_file="${WAL_ARCHIVE_DIR}/$(basename ${wal_file})"
    
    # Copy WAL file to archive
    cp "${wal_file}" "${archive_file}" 2>/dev/null || return 1
    
    # Compress after 1 hour
    if [ -f "${archive_file}" ] && [ ! -f "${archive_file}.gz" ]; then
        (sleep 3600 && gzip "${archive_file}") &
    fi
    
    return 0
}

# Point-in-Time Recovery
restore_from_backup() {
    local backup_date=$1
    local target_time=${2:-""}
    
    log "Starting PITR restoration..."
    
    local backup_path=$(find "${BASEBACKUP_DIR}" -name "basebackup_${backup_date}*" -type d | head -n 1)
    
    if [ -z "${backup_path}" ]; then
        error "Backup not found for date: ${backup_date}"
        return 1
    fi
    
    log "Using backup: ${backup_path}"
    
    # Stop PostgreSQL (if running)
    # pg_ctl stop -D /var/lib/postgresql/data
    
    # Restore base backup
    # pg_basebackup restore logic here
    
    # Configure recovery
    if [ -n "${target_time}" ]; then
        echo "recovery_target_time = '${target_time}'" >> "${backup_path}/recovery.conf"
    fi
    
    log "PITR configuration ready"
    return 0
}

# Main execution
main() {
    case "${1:-backup}" in
        backup)
            perform_basebackup
            cleanup_old_backups
            ;;
        cleanup)
            cleanup_old_backups
            ;;
        restore)
            restore_from_backup "${2}" "${3:-}"
            ;;
        archive)
            archive_wal "${2}"
            ;;
        *)
            echo "Usage: $0 {backup|cleanup|restore <date> [target_time]|archive <wal_file>}"
            exit 1
            ;;
    esac
}

main "$@"

