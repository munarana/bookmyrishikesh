const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function run() {
  console.log('=== DATABASE HEALTH CHECK ===\n');
  
  // Check all users
  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true, password: true }
  });
  console.log('Total users:', users.length);
  users.forEach(u => {
    console.log(' -', u.role, '|', u.email, '|', u.name, '| has password:', !!u.password);
  });
  
  // Verify passwords
  console.log('\n=== PASSWORD VERIFICATION ===');
  const toCheck = [
    { email: 'student@example.com', pass: 'student123' },
    { email: 'owner@satvicyoga.com', pass: 'owner123' },
    { email: 'admin@rishikeshyoga.com', pass: 'admin123' },
  ];
  for (const { email, pass } of toCheck) {
    const u = await prisma.user.findUnique({ where: { email } });
    if (u && u.password) {
      const match = await bcrypt.compare(pass, u.password);
      console.log(email + ' / ' + pass + ' ->', match ? '✓ CORRECT' : '✗ WRONG HASH');
    } else {
      console.log(email, '-> USER NOT FOUND');
    }
  }
  
  // Check schools
  console.log('\n=== SCHOOLS ===');
  const schools = await prisma.school.findMany({
    select: { name: true, slug: true, status: true, ownerId: true }
  });
  console.log('Total schools:', schools.length);
  schools.forEach(s => {
    console.log(' -', s.name, '| status:', s.status, '| slug:', s.slug);
  });
  
  // Check courses
  console.log('\n=== COURSES ===');
  const courses = await prisma.course.findMany({
    select: { name: true, category: true, priceUSD: true }
  });
  console.log('Total courses:', courses.length);
  courses.forEach(c => {
    console.log(' -', c.name, '|', c.category, '| $' + c.priceUSD);
  });

  // Check course dates
  console.log('\n=== COURSE DATES ===');
  const dates = await prisma.courseDate.count();
  console.log('Total course dates:', dates);

  console.log('\n=== ALL CHECKS COMPLETE ===');
  await prisma.$disconnect();
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
