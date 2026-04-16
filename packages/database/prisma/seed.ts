import { PrismaClient, Role, CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create an owner
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rishikeshyoga.com' },
    update: {},
    create: {
      email: 'admin@rishikeshyoga.com',
      name: 'Rishikesh Admin',
      role: Role.SUPER_ADMIN,
    },
  });

  const schoolOwner = await prisma.user.upsert({
    where: { email: 'owner@satvicyoga.com' },
    update: {},
    create: {
      email: 'owner@satvicyoga.com',
      name: 'Satvic Owner',
      role: Role.SCHOOL_ADMIN,
    },
  });

  // Create a school
  const school = await prisma.school.upsert({
    where: { slug: 'satvic-yoga-academy' },
    update: {},
    create: {
      slug: 'satvic-yoga-academy',
      name: 'Satvic Yoga Academy',
      description: 'A traditional yoga school in the heart of Rishikesh focusing on authentic Hatha and Ashtanga lineage.',
      establishedYear: 2010,
      address: 'Tapovan, Rishikesh, Uttarakhand 249192',
      verified: true,
      ownerId: schoolOwner.id,
      coverPhoto: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      courses: {
        create: [
          {
            name: '200-Hour Hatha Yoga TTC',
            slug: '200h-hatha-ttc-satvic',
            description: 'Comprehensive 24-day yoga teacher training course aligned with Yoga Alliance standards.',
            category: 'TTC',
            style: 'Hatha',
            level: CourseLevel.INTERMEDIATE,
            durationDays: 24,
            priceINR: 65000,
            priceUSD: 800,
            includedItems: ['Accommodation', '3 Vegetarian Meals', 'Course Material', 'Yoga Mat'],
            courseDates: {
              create: [
                {
                  startDate: new Date('2024-06-01'),
                  endDate: new Date('2024-06-25'),
                  capacity: 20,
                },
                {
                  startDate: new Date('2024-07-01'),
                  endDate: new Date('2024-07-25'),
                  capacity: 20,
                }
              ]
            }
          },
          {
            name: '7-Day Spiritual Retreat',
            slug: '7-day-spiritual-retreat',
            description: 'A rejuvenating week-long retreat focusing on meditation, light asanas, and spiritual discourse.',
            category: 'Retreat',
            style: 'Restorative',
            level: CourseLevel.BEGINNER,
            durationDays: 7,
            priceINR: 25000,
            priceUSD: 300,
            includedItems: ['Accommodation', 'Meals', 'Excursions', 'Ayurvedic Massage'],
            courseDates: {
              create: [
                {
                  startDate: new Date('2024-06-10'),
                  endDate: new Date('2024-06-17'),
                  capacity: 15,
                }
              ]
            }
          }
        ]
      }
    },
  });

  console.log(`Created school: ${school.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
