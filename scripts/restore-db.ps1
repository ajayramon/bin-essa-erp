# ==============================================================================
# BIN ESSA ERP — POSTGRESQL RESTORATION SCRIPT (POWERSHELL)
# ==============================================================================
param (
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$ContainerName = "bin_essa_postgres",
    [string]$DbUser = "bin_essa_admin",
    [string]$DbName = "bin_essa_erp_db"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupFile)) {
    Write-Host "ERROR: Backup file '$BackupFile' does not exist." -ForegroundColor Red
    exit 1
}

Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] Restoring database '$DbName' from '$BackupFile'..." -ForegroundColor Cyan

try {
    Get-Content $BackupFile | docker exec -i $ContainerName psql -U $DbUser -d $DbName
    Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] Database restoration completed successfully." -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Database restoration failed: $_" -ForegroundColor Red
    exit 1
}
