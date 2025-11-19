#!/bin/bash

# PostgreSQL Point-In-Time Recovery Script

set -euo pipefail

BACKUP_DIR="/backups"
BASEBACKUP_DIR="${BACKUP_DIR}/basebackups"
WAL_ARCHIVE_DIR="${BACKUP_DIR}/wal_archive"
PGDATA="/var/lib/postgresql/data"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[ERROR] $1" >&2
    exit 1
}

# Restore from backup
restore_basebackup() {
    local backup_date=$1
    local target_time=${2:-""}
    
    log "Starting PITR restoration..."
    
    # Find backup
    local backup_path=$(find "${BASEBACKUP_DIR}" -name "basebackup_${backup_date}*" -type d | head -n 1)
    
    if [ -z "${backup_path}" ]; then
        error "Backup not found for date: ${backup_date}"
    fi
    
    log "Found backup: ${backup_path}"
    
    # Stop PostgreSQL
    log "Stopping PostgreSQL..."
    pg_ctl stop -D "${PGDATA}" -m fast || true
    
    # Backup current data directory
    if [ -d "${PGDATA}" ]; then
        log "Backing up current data directory..."
        mv "${PGDATA}" "${PGDATA}.old.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Restore base backup
    log "Restoring base backup..."
    mkdir -p "${PGDATA}"
    
    # Extract base backup
    if [ -f "${backup_path}/base.tar.gz" ]; then
        tar -xzf "${backup_path}/base.tar.gz" -C "${PGDATA}"
    fi
    
    # Configure recovery
    cat > "${PGDATA}/postgresql.conf" << EOF
# PITR Configuration
archive_mode = on
archive_command = 'test ! -f ${WAL_ARCHIVE_DIR}/%f && cp %p ${WAL_ARCHIVE_DIR}/%f'
restore_command = 'cp ${WAL_ARCHIVE_DIR}/%f %p'
recovery_target_time = '${target_time:-latest}'
recovery_target_timeline = 'latest'
EOF
    
    # Create recovery signal file
    touch "${PGDATA}/recovery.signal"
    
    log "Restoration complete. Start PostgreSQL to begin recovery."
    log "Target time: ${target_time:-latest}"
}

# List available backups
list_backups() {
    log "Available backups:"
    find "${BASEBACKUP_DIR}" -type d -name "basebackup_*" -printf '%T@ %f\n' | \
        sort -n | \
        while read timestamp name; do
            date_str=$(date -d "@${timestamp}" +"%Y-%m-%d %H:%M:%S")
            echo "  ${name} (${date_str})"
        done
}

main() {
    case "${1:-list}" in
        restore)
            if [ -z "${2:-}" ]; then
                error "Usage: $0 restore <backup_date> [target_time]"
            fi
            restore_basebackup "${2}" "${3:-}"
            ;;
        list)
            list_backups
            ;;
        *)
            echo "Usage: $0 {restore <backup_date> [target_time]|list}"
            exit 1
            ;;
    esac
}

main "$@"

