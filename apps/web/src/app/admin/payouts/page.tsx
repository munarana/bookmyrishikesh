import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, ChevronLeft, CreditCard, Calendar, Users } from "lucide-react";
import { prisma } from "@repo/database";

export const dynamic = "force-dynamic";

export default async function PayoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Get all schools with their revenue data
  const schools = await prisma.school.findMany({
    where: {
      status: 'APPROVED',
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      courses: {
        include: {
          courseDates: {
            include: {
              bookings: true,
            },
          },
        },
      },
    },
  });

  // Calculate payout data
  const payoutData = schools.map(school => {
    const totalBookings = school.courses.reduce((acc, course) => 
      acc + course.courseDates.reduce((dateAcc, date) => dateAcc + date.bookings.length, 0), 0
    );
    const totalRevenue = school.courses.reduce((acc, course) =>
      acc + course.courseDates.reduce((dateAcc, date) =>
        dateAcc + date.bookings.reduce((bookingAcc, booking) => bookingAcc + (booking.totalPrice || 0), 0), 0
      ), 0
    );
    const commission = totalRevenue * (school.commissionRate / 100);
    const payoutAmount = totalRevenue - commission;

    return {
      id: school.id,
      name: school.name,
      owner: school.owner,
      totalBookings,
      totalRevenue,
      commission,
      payoutAmount,
      commissionRate: school.commissionRate,
    };
  });

  const totalPlatformRevenue = payoutData.reduce((acc, school) => acc + school.totalRevenue, 0);
  const totalCommission = payoutData.reduce((acc, school) => acc + school.commission, 0);
  const totalPayouts = payoutData.reduce((acc, school) => acc + school.payoutAmount, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row mt-16 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-auto md:min-h-[calc(100vh-64px)] shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="hover:text-white transition-colors">
            <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <ChevronLeft className="w-5 h-5 text-accent" /> Back to Dashboard
            </h2>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Financial Management
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-slate-800 text-white font-medium">
            <TrendingUp className="w-4 h-4" /> Commission & Payouts
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Commission & Payouts</h1>
          <p className="text-slate-500 text-sm">Manage platform commissions and school payouts.</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Platform Revenue</p>
                  <h3 className="text-3xl font-bold text-slate-900">${totalPlatformRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Platform Commission</p>
                  <h3 className="text-3xl font-bold text-slate-900">${totalCommission.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg"><CreditCard className="w-5 h-5 text-blue-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total School Payouts</p>
                  <h3 className="text-3xl font-bold text-slate-900">${totalPayouts.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-600" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* School Payouts Table */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle>School Payout Summary</CardTitle>
            <CardDescription>Commission breakdown and payout amounts for each approved school.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payoutData.map((school) => (
                <div key={school.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{school.name}</h4>
                      <p className="text-sm text-slate-500">{school.owner.name} ({school.owner.email})</p>
                      <p className="text-xs text-slate-400">
                        {school.totalBookings} bookings • {school.commissionRate}% commission
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Revenue: ${school.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-red-600">Commission: ${school.commission.toLocaleString()}</div>
                    <div className="text-lg font-bold text-green-600">Payout: ${school.payoutAmount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}