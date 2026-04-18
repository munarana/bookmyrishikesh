const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'breath@himalaya.com' }
  });
  console.log('User found:', user ? 'Yes' : 'No');
  if (user) {
    console.log('Role:', user.role);
    console.log('Has password:', !!user.password);
  }
  
  const schools = await prisma.school.findMany({
    where: { ownerId: user?.id }
  });
  console.log('Schools found:', schools.length);
  if (schools.length > 0) {
    console.log('School Status:', schools[0].status);
  }
}

check();
