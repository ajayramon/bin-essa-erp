#!/usr/bin/env bash
# ==============================================================================
# BIN ESSA ERP — AUTOMATED POSTGRESQL BACKUP SCRIPT
# ==============================================================================
set -eo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="bin_essa_erp_backup_${TIMESTAMP}.sql.gz"
CONTAINER_NAME="${CONTAINER_NAME:-bin_essa_postgres}"
DB_USER="${POSTGRES_USER:-bin_essa_admin}"
DB_NAME="${POSTGRES_DB:-bin_essa_erp_db}"

mkdir -p "${BACKUP_DIR}"

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting automated database backup for ${DB_NAME}..."

# Execute pg_dump inside the container and compress with gzip
if docker exec "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "${BACKUP_DIR}/${BACKUP_FILENAME}"; then
    BACKUP_SIZE=$(ls -lh "${BACKUP_DIR}/${BACKUP_FILENAME}" | awk '{print $5}')
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Backup successfully created: ${BACKUP_DIR}/${BACKUP_FILENAME} (${BACKUP_SIZE})"
else
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: Database backup failed!" >&2
    rm -f "${BACKUP_DIR}/${BACKUP_FILENAME}"
    exit 1
fi

# Verify archive integrity
if gzip -t "${BACKUP_DIR}/${BACKUP_FILENAME}"; then
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Archive integrity verified: OK"
else
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: Backup archive failed integrity verification!" >&2
    exit 1
fi

# Purge backups older than RETENTION_DAYS
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "bin_essa_erp_backup_*.sql.gz" -mtime +"${RETENTION_DAYS}" -exec rm -f {} \;

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Backup routine completed successfully."
