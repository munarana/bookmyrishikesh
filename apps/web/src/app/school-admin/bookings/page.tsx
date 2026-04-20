import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, Wallet } from "lucide-react";

export default async function SchoolAdminBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      courseDate: {
        course: {
          school: {
            ownerId: (session.user as any).id,
          },
        },
      },
    },
    include: {
      user: true,
      courseDate: {
        include: {
          course: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-2">View all bookings for your school courses.</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/school-admin/courses">Manage Courses</Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Card className="border-border shadow-sm">
          <CardContent className="text-center py-16">
            <Users className="mx-auto mb-4 h-10 w-10 text-slate-300" />
            <h2 className="font-semibold text-slate-700 mb-2">No bookings yet</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">Once your courses are live, student bookings will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-border shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold">{booking.courseDate.course.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{booking.user.name || booking.user.email}</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <div className="font-semibold text-slate-800">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</div>
                  <div>{new Date(booking.courseDate.startDate).toLocaleDateString()}</div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span>{new Date(booking.courseDate.startDate).toLocaleDateString()} - {new Date(booking.courseDate.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span>${booking.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span>Status:</span>
                  <span className="font-semibold text-slate-800">{booking.status}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
