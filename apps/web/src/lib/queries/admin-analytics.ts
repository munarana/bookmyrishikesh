import { prisma, SchoolStatus } from "@repo/database";

export async function getPlatformKPIs() {
  const [totalStudents, activeSchools, pendingApprovals, totalBookings, users] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.school.count({ where: { status: SchoolStatus.APPROVED, isPublished: true } }),
    prisma.school.count({ where: { status: SchoolStatus.PENDING } }),
    prisma.booking.count(),
    prisma.user.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
  ]);

  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
    select: { amount: true, createdAt: true },
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const revenueThisMonth = payments
    .filter((payment) => payment.createdAt >= startOfMonth)
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalStudents,
    activeSchools,
    pendingApprovals,
    totalBookings,
    totalRevenue,
    revenueThisMonth,
    totalCommission: totalRevenue * 0.1,
    monthCommission: revenueThisMonth * 0.1,
    thisMonthBookings: await prisma.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
    publishedBlogPosts: await prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    recentUsers: users,
  };
}

export async function getMonthlyRevenue() {
  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
    select: { amount: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const now = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    const monthPayments = payments.filter(
      (payment) =>
        payment.createdAt.getFullYear() === date.getFullYear() &&
        payment.createdAt.getMonth() === date.getMonth()
    );
    const gross = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      gross,
      commission: gross * 0.1,
    };
  });
}

export async function getRecentActivity() {
  const auditLogs = await prisma.auditLog.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return auditLogs.map((log) => ({
    id: log.id,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    user: log.user.name ?? log.user.email,
    createdAt: log.createdAt,
  }));
}

export async function getTopSchools() {
  const schools = await prisma.school.findMany({
    where: { status: SchoolStatus.APPROVED },
    include: {
      courses: {
        where: { deletedAt: null },
        include: { bookings: true },
      },
    },
    take: 10,
  });

  return schools.map((school) => {
    const bookings = school.courses.flatMap((course) => course.bookings);
    const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    return {
      id: school.id,
      name: school.name,
      city: school.city,
      activeCourses: school.courses.length,
      thisMonthBookings: bookings.length,
      totalRevenue: revenue,
      avgRating: school.avgRating,
      slug: school.slug,
    };
  });
}
