const { execSync } = require('child_process');

// Load env
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const url = process.env.DATABASE_URL;
console.log('DB URL:', url ? url.replace(/:([^@]+)@/, ':****@') : 'NOT SET');

// Test with pg directly
const { Client } = (() => {
  try { return require('pg'); } catch(e) { return null; }
})() || {};

if (!Client) {
  console.log('\n⚠️  pg module not found, testing via Prisma script...\n');
  
  // Write a small TS test
  const fs = require('fs');
  const testContent = `
import { prisma } from '../packages/database/index';
async function main() {
  try {
    const users = await prisma.user.count();
    console.log('✅ DB Connected! Users:', users);
    const schools = await prisma.school.count();
    console.log('✅ Schools:', schools);
    const bookings = await prisma.booking?.count?.() ?? 'N/A';
    console.log('✅ Bookings:', bookings);
  } catch(e) {
    console.error('❌ DB Error:', e.message.split('\\n')[0]);
  } finally {
    await prisma.$disconnect();
  }
}
main();
`;
  process.exit(0);
}

async function testDB() {
  const client = new Client({ connectionString: url });
  try {
    console.log('\n🔌 Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connected!');
    
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('\n📋 Tables found:', tables.rows.map(r => r.table_name).join(', '));
    
    // Count rows in each table
    for (const row of tables.rows) {
      const count = await client.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
      console.log(`   ${row.table_name}: ${count.rows[0].count} rows`);
    }
    
    console.log('\n✅ Database is fully operational!');
  } catch (e) {
    console.error('\n❌ Database connection FAILED:', e.message.split('\n')[0]);
    console.error('   This could be a Neon "cold start" or network issue.');
    console.error('   The database URL may need updating or Neon project may be paused.');
  } finally {
    await client.end().catch(() => {});
  }
}

testDB();
