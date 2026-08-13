#!/usr/bin/env bash
# ==============================================================================
# BIN ESSA ERP — POSTGRESQL RESTORATION SCRIPT
# ==============================================================================
set -eo pipefail

BACKUP_FILE="$1"
CONTAINER_NAME="${CONTAINER_NAME:-bin_essa_postgres}"
DB_USER="${POSTGRES_USER:-bin_essa_admin}"
DB_NAME="${POSTGRES_DB:-bin_essa_erp_db}"

if [ -z "${BACKUP_FILE}" ]; then
    echo "Usage: ./restore-db.sh <path_to_backup_file.sql[.gz]>" >&2
    exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file '${BACKUP_FILE}' not found!" >&2
    exit 1
fi

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Restoring database '${DB_NAME}' from '${BACKUP_FILE}'..."

# Verify if backup is gzipped
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    gzip -dc "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}"
else
    docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}" < "${BACKUP_FILE}"
fi

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Restoration completed successfully."
