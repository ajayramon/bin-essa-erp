const fs = require('fs');
const path = require('path');

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match) {
        databaseUrl = match[1];
      }
    }
  } catch (e) {}
}

module.exports = {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl || 'postgresql://postgres.opashlypnhrhrwfyleep:bin-essa-erp@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
  },
};
