import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Clock, BookOpen } from "lucide-react";

export default async function SchoolAdminAvailabilityPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    redirect("/login");
  }

  const school = await prisma.school.findFirst({
    where: { ownerId: (session.user as any).id },
    include: {
      courses: {
        include: {
          courseDates: true,
        },
      },
    },
  });

  if (!school) {
    redirect("/school-admin");
  }

  const availability = school.courses.flatMap((course) =>
    course.courseDates.map((date) => ({
      courseName: course.name,
      startDate: date.startDate,
      endDate: date.endDate,
      capacity: date.capacity,
      isActive: date.isActive,
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Availability</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage course availability and upcoming session dates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {availability.length > 0 ? (
          availability.map((item, index) => (
            <Card key={index} className="border-border shadow-sm">
              <CardHeader className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-semibold">{item.courseName}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Status</div>
                  <div className={`mt-1 text-sm font-semibold ${item.isActive ? "text-emerald-600" : "text-slate-500"}`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-3 text-sm text-slate-700">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span>{item.capacity} seats available</span>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-border shadow-sm">
            <CardContent className="text-center py-16">
              <CalendarDays className="mx-auto mb-4 h-10 w-10 text-slate-300" />
              <h2 className="font-semibold text-slate-700 mb-2">No availability has been added yet</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">Create course dates in the course manager to start accepting bookings and track availability here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
