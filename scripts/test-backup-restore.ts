// ==============================================================================
// BIN ESSA ERP — BACKUP & RESTORE AUTOMATED VERIFICATION TEST
// ==============================================================================
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import pg from 'pg';

const DATABASE_URL =
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://bin_essa_admin:BinEssaSecurePass2026!@localhost:5432/bin_essa_erp_db?schema=public';

async function verifyBackupAndRestore() {
  console.log('\n======================================================');
  console.log('  BIN ESSA ERP — BACKUP & RESTORE INTEGRITY TEST');
  console.log('======================================================\n');

  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  const backupDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = Date.now();
  const testDumpFile = path.join(backupDir, `test_verification_${timestamp}.sql`);

  try {
    console.log('[1/5] Checking current database state & table metrics...');
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);
    const tableNames = tablesRes.rows.map((r: any) => r.table_name);
    console.log(`      Found ${tableNames.length} tables in PostgreSQL database.`);

    const userCountRes = await client.query('SELECT COUNT(*) FROM "User"');
    const initialUserCount = parseInt(userCountRes.rows[0].count, 10);
    console.log(`      Initial User count: ${initialUserCount}`);

    console.log('[2/5] Creating test snapshot dump via pg_dump...');
    execSync(`docker exec bin_essa_postgres pg_dump -U bin_essa_admin bin_essa_erp_db > "${testDumpFile}"`);
    const dumpStats = fs.statSync(testDumpFile);
    console.log(`      Snapshot successfully written (${(dumpStats.size / 1024).toFixed(2)} KB).`);

    console.log('[3/5] Inserting temporary canary record...');
    const canaryUsername = `canary_user_${timestamp}`;
    await client.query(`
      INSERT INTO "User" ("id", "username", "passwordHash", "fullName", "role", "createdAt", "updatedAt")
      VALUES ('canary-${timestamp}', '${canaryUsername}', 'hash', 'Canary Backup Test User', 'ADMIN', NOW(), NOW())
    `);
    const afterInsertCountRes = await client.query('SELECT COUNT(*) FROM "User"');
    console.log(`      User count with canary: ${afterInsertCountRes.rows[0].count}`);

    console.log('[4/5] Restoring database from snapshot dump...');
    // Release active client before restore
    client.release();
    await pool.end();

    execSync(`docker exec -i bin_essa_postgres psql -U bin_essa_admin -d bin_essa_erp_db < "${testDumpFile}"`);

    console.log('[5/5] Re-verifying database state post-restore...');
    const verifyPool = new pg.Pool({ connectionString: DATABASE_URL });
    const verifyClient = await verifyPool.connect();

    const postRestoreUserCountRes = await verifyClient.query('SELECT COUNT(*) FROM "User"');
    const postRestoreUserCount = parseInt(postRestoreUserCountRes.rows[0].count, 10);
    console.log(`      Post-restore User count: ${postRestoreUserCount}`);

    const canaryCheckRes = await verifyClient.query(`SELECT * FROM "User" WHERE "username" = '${canaryUsername}'`);
    if (canaryCheckRes.rows.length > 0) {
      throw new Error('Canary record still exists after restore! Restore failed.');
    }

    if (postRestoreUserCount !== initialUserCount) {
      throw new Error(`User count mismatch! Expected ${initialUserCount}, got ${postRestoreUserCount}`);
    }

    console.log('\n------------------------------------------------------');
    console.log('  SUCCESS: Database snapshot and restore verified 100%!');
    console.log('------------------------------------------------------\n');

    verifyClient.release();
    await verifyPool.end();
  } catch (error: any) {
    console.error('\nERROR during backup/restore verification:', error?.message || error);
    process.exit(1);
  } finally {
    if (fs.existsSync(testDumpFile)) {
      fs.unlinkSync(testDumpFile);
      console.log('Cleaned up temporary test snapshot.');
    }
  }
}

verifyBackupAndRestore();
