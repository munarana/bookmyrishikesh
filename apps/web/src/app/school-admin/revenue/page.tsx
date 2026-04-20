import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@repo/database";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function SchoolAdminRevenuePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SCHOOL_ADMIN") {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      courseDate: {
        course: {
          school: {
            ownerId: session.user.id,
          },
        },
      },
    },
    include: {
      courseDate: { include: { course: true } },
    },
  });

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const completedBookings = bookings.filter((booking) =>
    booking.status === "DEPOSIT_PAID" || booking.status === "CONFIRMED" || booking.status === "COMPLETED"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary">Revenue</h1>
        <p className="text-sm text-muted-foreground mt-2">Track the revenue generated from student bookings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
            <CardDescription className="text-sm text-muted-foreground">Revenue from all bookings</CardDescription>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bookings.length}</div>
            <CardDescription className="text-sm text-muted-foreground">Total booking records</CardDescription>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedBookings}</div>
            <CardDescription className="text-sm text-muted-foreground">Bookings with payment progress</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No booking revenue is available yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-semibold">{booking.courseDate.course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.courseDate.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">${booking.totalPrice.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{booking.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
