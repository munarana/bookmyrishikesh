import { prisma } from "@repo/database";

export async function getSchoolStats(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      courses: {
        where: { deletedAt: null },
        include: {
          bookings: true,
          courseDates: true,
        },
      },
    },
  });

  if (!school) return null;

  const bookings = school.courses.flatMap((course) => course.bookings);
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  return {
    totalBookings: bookings.length,
    thisMonthRevenue: bookings
      .filter((booking) => booking.createdAt >= startOfMonth)
      .reduce((sum, booking) => sum + booking.totalPrice, 0),
    activeCourses: school.courses.filter((course) => course.isPublished).length,
    upcomingDates: school.courses.reduce((sum, course) => sum + course.courseDates.length, 0),
    avgRating: school.avgRating,
    totalRevenue,
  };
}

export async function getSchoolMonthlyBookings(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      courses: {
        include: {
          bookings: true,
        },
      },
    },
  });

  if (!school) return [];

  const bookings = school.courses.flatMap((course) => course.bookings);
  const now = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const monthBookings = bookings.filter(
      (booking) =>
        booking.createdAt.getFullYear() === date.getFullYear() &&
        booking.createdAt.getMonth() === date.getMonth()
    );

    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      bookings: monthBookings.length,
      revenue: monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
    };
  });
}
