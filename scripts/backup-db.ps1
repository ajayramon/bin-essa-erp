# ==============================================================================
# BIN ESSA ERP — AUTOMATED POSTGRESQL BACKUP SCRIPT (POWERSHELL)
# ==============================================================================
param (
    [string]$BackupDir = ".\backups",
    [int]$RetentionDays = 30,
    [string]$ContainerName = "bin_essa_postgres",
    [string]$DbUser = "bin_essa_admin",
    [string]$DbName = "bin_essa_erp_db"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$SqlFile = Join-Path $BackupDir "bin_essa_erp_backup_$Timestamp.sql"
$GzFile = "$SqlFile.gz"

Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] Starting database backup for $DbName..." -ForegroundColor Cyan

try {
    # Dump plain SQL from container
    docker exec $ContainerName pg_dump -U $DbUser $DbName > $SqlFile

    if ((Get-Item $SqlFile).Length -eq 0) {
        throw "Generated backup file is empty."
    }

    Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] Backup created: $SqlFile" -ForegroundColor Green

    # Rotate old backups
    $CutoffDate = (Get-Date).AddDays(-$RetentionDays)
    Get-ChildItem -Path $BackupDir -Filter "bin_essa_erp_backup_*.sql*" | Where-Object { $_.LastWriteTime -lt $CutoffDate } | ForEach-Object {
        Write-Host "Purging expired backup: $($_.FullName)" -ForegroundColor Yellow
        Remove-Item $_.FullName -Force
    }

    Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] Backup routine completed successfully." -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Backup failed: $_" -ForegroundColor Red
    if (Test-Path $SqlFile) { Remove-Item $SqlFile -Force }
    exit 1
}
