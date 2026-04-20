import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Phone, CalendarDays, Users, Globe2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function SchoolAdminEnquiriesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    redirect("/login");
  }

  const school = await prisma.school.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, name: true },
  });

  if (!school) {
    redirect("/school-admin");
  }

  const enquiries = await prisma.inquiry.findMany({
    where: { schoolId: school.id },
    include: {
      course: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary">Enquiries Inbox</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Live questions from prospective students appear here as soon as they submit from your school page.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Incoming Enquiries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <MessageSquare className="mx-auto mb-4 h-10 w-10 text-slate-300" />
              <h2 className="font-semibold text-slate-700 mb-2">No enquiries yet</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Once students submit the enquiry form from your public school page, they will show up here automatically.
              </p>
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{enquiry.name}</h3>
                      <Badge variant="secondary">{enquiry.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" /> {enquiry.email}
                      </div>
                      {enquiry.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" /> {enquiry.phone}
                        </div>
                      ) : null}
                      {enquiry.country ? (
                        <div className="flex items-center gap-2">
                          <Globe2 className="w-4 h-4 text-slate-400" /> {enquiry.country}
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" /> {enquiry.guests} guest{enquiry.guests > 1 ? "s" : ""}
                      </div>
                      {enquiry.desiredDate ? (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                          Preferred: {new Date(enquiry.desiredDate).toLocaleDateString()}
                        </div>
                      ) : null}
                      {enquiry.course?.name ? (
                        <div className="text-sm text-slate-500">Course: {enquiry.course.name}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    {new Date(enquiry.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  {enquiry.message}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
