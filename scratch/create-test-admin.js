require('dotenv').config({ path: 'apps/web/.env' });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'test-admin@example.com';
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const hash = await bcrypt.hash('Password123!', 10);
    user = await prisma.user.create({ data: { email, password: hash, name: 'Test Admin', role: 'SCHOOL_ADMIN' } });
    console.log('Created user', user.id);
  } else {
    console.log('User already exists', user.id);
  }

  let school = await prisma.school.findFirst({ where: { ownerId: user.id } });
  if (!school) {
    school = await prisma.school.create({ data: { ownerId: user.id, slug: 'test-admin-school', name: 'Test Admin School', description: 'Test school for course manager debugging', status: 'APPROVED' } });
    console.log('Created school', school.id);
  } else {
    console.log('School already exists', school.id);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
