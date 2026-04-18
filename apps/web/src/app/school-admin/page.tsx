import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, BookOpen, Star, ArrowUpRight, Plus, MapPin, CheckCircle, Clock, ShieldAlert } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SchoolAdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    redirect("/login");
  }

  // Fetch school for the logged in owner
  const school = await prisma.school.findFirst({
    where: { ownerId: (session.user as any).id },
    include: {
      courses: true,
      _count: {
        select: { courses: true }
      }
    }
  });

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <ShieldAlert className="w-16 h-16 text-amber-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">No School Profile Found</h2>
        <p className="text-slate-600 max-w-md mb-8">
          It looks like you haven&apos;t set up your school profile yet. 
          Please contact support if you believe this is an error.
        </p>
        <Button asChild className="h-12 px-8 font-bold text-lg">
          <Link href="/register/school">Apply to List School</Link>
        </Button>
      </div>
    );
  }

  const isPending = school.status === "PENDING";

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-3xl font-bold text-primary">{school.name}</h1>
            {isPending ? (
               <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                 <Clock className="w-3 h-3" /> Pending Review
               </span>
            ) : (
              <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" /> Active Partner
              </span>
            )}
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin className="w-3 h-3" /> {school.address || "Rishikesh, India"}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/schools/${school.slug}`}>View Public Profile</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> Create New Course
          </Button>
        </div>
      </div>

      {isPending && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
            <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-amber-900">Application Under Review</h4>
              <p className="text-sm text-amber-800">Your school profile is currently being verified by our team. Once approved, your courses will become visible to students world-wide.</p>
            </div>
            <Button size="sm" variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100">Contact Support</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to receive bookings</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Commission Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">Next payout: TBD</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{school._count.courses}</div>
            <p className="text-xs text-muted-foreground mt-1">Add your curriculum today</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platform Visibility</CardTitle>
            <Star className="h-4 w-4 text-accent fill-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isPending ? "Hidden" : "Live"}</div>
            <p className="text-xs text-muted-foreground mt-1">{isPending ? "Waiting for approval" : "Visible in search results"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
         <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mb-3" />
              <h5 className="font-bold text-slate-500">No Bookings Yet</h5>
              <p className="text-xs text-slate-400 max-w-[200px]">Once your school is approved and live, bookings will appear here.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Quick Setup Checklist</CardTitle>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">25% Done</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Create School Profile", done: true },
                { label: "Upload Verification Docs", done: false, link: "/school-admin/settings" },
                { label: "Add First Course", done: false, link: "/school-admin/courses" },
                { label: "Add Photos to Gallery", done: false, link: "/school-admin/gallery" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg group hover:border-primary transition-colors">
                  <div className="flex items-center gap-3">
                    {item.done ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                    )}
                    <span className={`text-sm ${item.done ? "text-slate-500 line-through" : "font-medium"}`}>{item.label}</span>
                  </div>
                  {!item.done && item.link && (
                    <Link href={item.link} className="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Start <Plus className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
