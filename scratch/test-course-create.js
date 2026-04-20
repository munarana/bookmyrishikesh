require('dotenv').config({ path: 'apps/web/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLevelEnum() {
  try {
    // Test with level as a string (as the API does)
    const school = await prisma.school.findFirst({ select: { id: true } });
    if (!school) { console.log('No school'); return; }

    const slug = `enum-test-${Date.now()}`;

    // This mirrors exactly what the API sends
    const course = await prisma.course.create({
      data: {
        schoolId: school.id,
        name: "Enum Test",
        slug,
        category: "TTC_200HR",
        style: "Hatha",
        level: "ALL_LEVELS",  // string enum value
        durationDays: 28,
        priceINR: 99000,
        priceUSD: 1200,
        description: "",
        includedItems: [],
        highlights: [],
        excludes: [],
        roomTypes: [{ type: "Shared Room", priceAddon: 0 }, { type: "Private Room", priceAddon: 150 }],
        isPublished: true,
      }
    });

    console.log('✅ Full payload test passed:', course.id);
    await prisma.course.delete({ where: { id: course.id } });

    // Test what happens when school is linked but searched by wrong field
    const allSchools = await prisma.school.findMany({ select: { id: true, ownerId: true, name: true } });
    console.log('\n=== Testing findFirst by ownerId ===');
    for (const s of allSchools.slice(0, 3)) {
      const found = await prisma.school.findFirst({ where: { ownerId: s.ownerId }, select: { id: true } });
      console.log(`Owner ${s.ownerId} → School found: ${!!found} (${s.name})`);
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLevelEnum();
