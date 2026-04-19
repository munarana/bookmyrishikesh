const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { PrismaClient } = require(path.join(__dirname, '../packages/database/dist/index.js'));
const prisma = new PrismaClient();

async function main() {
  console.log('\n======================================');
  console.log('  DATABASE CONNECTION TEST');
  console.log('======================================\n');
  
  try {
    console.log('Connecting to Neon PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Connected!\n');

    const userCount = await prisma.user.count();
    console.log('👤 Users:', userCount);

    const schoolCount = await prisma.school.count();
    console.log('🏫 Schools:', schoolCount);

    if (schoolCount > 0) {
      const schools = await prisma.school.findMany({ take: 5, select: { name: true, status: true, email: true } });
      schools.forEach(s => console.log(`   - ${s.name} [${s.status}] <${s.email}>`));
    }

    const pendingCount = await prisma.school.count({ where: { status: 'PENDING' } });
    console.log('⏳ Pending approvals:', pendingCount);

    // Check for bookings table
    try {
      const bookingCount = await prisma.booking.count();
      console.log('📅 Bookings:', bookingCount);
    } catch(e) {
      console.log('📅 Bookings table: not found or no data');
    }

    // Check users
    if (userCount > 0) {
      const users = await prisma.user.findMany({ take: 5, select: { email: true, role: true } });
      console.log('\n👥 Sample users:');
      users.forEach(u => console.log(`   - ${u.email} [${u.role}]`));
    }

    console.log('\n✅ DATABASE IS FULLY WORKING!\n');
  } catch(e) {
    console.error('❌ DATABASE ERROR:', e.message.split('\n')[0]);
    console.error('\nThe Neon database may be paused or the connection string needs updating.');
    console.error('Visit https://console.neon.tech to check the database status.\n');
  } finally {
    await prisma.$disconnect();
  }
}

main();
