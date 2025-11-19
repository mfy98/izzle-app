#!/bin/bash

# Cron job wrapper for PostgreSQL backups
# Add to crontab: 0 2 * * * /path/to/cron-backup.sh

/backup/postgres-backup.sh backup >> /var/log/postgres-backup.log 2>&1

