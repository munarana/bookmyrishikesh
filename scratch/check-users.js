const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { PrismaClient } = require(path.join(__dirname, '../packages/database/dist/index.js'));
const prisma = new PrismaClient();

async function main() {
  console.log('\n========================================');
  console.log('  CHECKING ALL USERS IN DATABASE');
  console.log('========================================\n');
  
  const users = await prisma.user.findMany({
    select: { email: true, role: true, name: true, password: true }
  });
  
  console.log(`Found ${users.length} users:\n`);
  users.forEach(u => {
    console.log(`  Email: ${u.email}`);
    console.log(`  Name:  ${u.name}`);
    console.log(`  Role:  ${u.role}`);
    console.log(`  Has Password: ${!!u.password}`);
    console.log('  ---');
  });

  console.log('\n📋 ADMIN CREDENTIALS TO USE:');
  const admins = users.filter(u => u.role === 'SUPER_ADMIN');
  admins.forEach(a => {
    console.log(`  Email: ${a.email}`);
    console.log(`  Password: admin123 (from seed)`);
  });
  
  const schoolAdmins = users.filter(u => u.role === 'SCHOOL_ADMIN');
  console.log(`\n🏫 SCHOOL ADMIN CREDENTIALS:`);
  schoolAdmins.slice(0, 3).forEach(a => {
    console.log(`  Email: ${a.email}`);
    console.log(`  Password: owner123 (from seed)`);
  });

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); });
