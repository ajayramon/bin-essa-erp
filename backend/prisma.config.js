const fs = require('fs');
const path = require('path');

let databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const directMatch = envContent.match(/DIRECT_DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      databaseUrl = (directMatch && directMatch[1]) || (match && match[1]);
    }
  } catch (e) {}
}

module.exports = {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl || 'postgresql://bin_essa_admin:BinEssaSecurePass2026!@postgres:5432/bin_essa_erp_db?schema=public',
  },
};


