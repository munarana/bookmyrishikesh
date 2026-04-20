require('dotenv').config({ path: 'apps/web/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    where: { role: 'SCHOOL_ADMIN' },
    select: { id: true, email: true, name: true, role: true }
  });
  console.log('\n=== SCHOOL_ADMIN Users ===');
  console.table(users);

  const schools = await prisma.school.findMany({
    select: { id: true, name: true, ownerId: true, status: true }
  });
  console.log('\n=== Schools ===');
  console.table(schools);

  // Cross-reference
  console.log('\n=== Ownership Match ===');
  for (const user of users) {
    const school = schools.find(s => s.ownerId === user.id);
    if (school) {
      console.log(`✅ ${user.email} → ${school.name} (${school.status})`);
    } else {
      console.log(`❌ ${user.email} → NO SCHOOL LINKED`);
    }
  }

  await prisma.$disconnect();
}

check().catch(e => { console.error(e.message); prisma.$disconnect(); });
