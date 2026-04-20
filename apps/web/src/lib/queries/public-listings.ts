import { prisma, SchoolStatus } from "@repo/database";

export async function getHomepageData() {
  const [featuredCourses, featuredSchools, approvedSchoolCount, publishedCourseCount, inquiryCount] =
    await Promise.all([
      prisma.course.findMany({
        where: {
          isPublished: true,
          deletedAt: null,
          school: {
            status: SchoolStatus.APPROVED,
            isPublished: true,
          },
        },
        include: {
          school: true,
          courseDates: {
            where: { isActive: true, startDate: { gte: new Date() } },
            orderBy: { startDate: "asc" },
            take: 1,
          },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: 6,
      }),
      prisma.school.findMany({
        where: {
          status: SchoolStatus.APPROVED,
          isPublished: true,
        },
        include: {
          courses: {
            where: { isPublished: true, deletedAt: null },
            include: {
              courseDates: {
                where: { isActive: true, startDate: { gte: new Date() } },
                orderBy: { startDate: "asc" },
                take: 1,
              },
            },
            orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
            take: 2,
          },
        },
        orderBy: [{ isFeatured: "desc" }, { totalReviews: "desc" }],
        take: 3,
      }),
      prisma.school.count({ where: { status: SchoolStatus.APPROVED, isPublished: true } }),
      prisma.course.count({
        where: {
          isPublished: true,
          deletedAt: null,
          school: { status: SchoolStatus.APPROVED, isPublished: true },
        },
      }),
      prisma.inquiry.count(),
    ]);

  return {
    featuredCourses,
    featuredSchools,
    stats: {
      approvedSchoolCount,
      publishedCourseCount,
      inquiryCount,
    },
  };
}

export async function getPublishedCourses(filters?: { q?: string; category?: string }) {
  const q = filters?.q?.trim();
  const category = filters?.category?.trim();

  return prisma.course.findMany({
    where: {
      isPublished: true,
      deletedAt: null,
      school: {
        status: SchoolStatus.APPROVED,
        isPublished: true,
      },
      ...(category && category !== "ALL"
        ? category === "Teacher Training"
          ? { category: { startsWith: "TTC_" } }
          : { category }
        : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { style: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { school: { name: { contains: q, mode: "insensitive" } } },
              { school: { address: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      school: true,
      courseDates: {
        where: {
          isActive: true,
          startDate: { gte: new Date() },
        },
        orderBy: { startDate: "asc" },
        take: 3,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getSchoolProfile(slug: string) {
  return prisma.school.findFirst({
    where: {
      slug,
      status: SchoolStatus.APPROVED,
      isPublished: true,
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      courses: {
        where: {
          isPublished: true,
          deletedAt: null,
        },
        include: {
          courseDates: {
            where: { isActive: true, startDate: { gte: new Date() } },
            orderBy: { startDate: "asc" },
            take: 3,
          },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      },
      inquiries: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      _count: {
        select: {
          courses: true,
          inquiries: true,
        },
      },
    },
  });
}
