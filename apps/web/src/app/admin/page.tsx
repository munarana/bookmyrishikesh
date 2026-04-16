import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, CheckCircle, Search, Shield, Globe, Tag, Activity, Settings, TrendingUp, Calendar, DollarSign } from "lucide-react";
import Image from "next/image";
import { getAdminStats, getPendingSchools } from "@/lib/actions/school-actions";

export default async function SuperAdminDashboard() {
  const statsResult = await getAdminStats();
  const schoolsResult = await getPendingSchools();
  
  const stats = (statsResult.success && statsResult.data) ? statsResult.data : {
    totalRevenue: 0,
    commission: 0,
    totalBookings: 0,
    activeSchools: 0,
    pendingApprovals: 0
  };

  const pendingSchools = (schoolsResult.success && schoolsResult.data) ? schoolsResult.data.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row mt-16 font-sans">
      {/* Super Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-auto md:min-h-[calc(100vh-64px)] shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" /> SuperAdmin
          </h2>
          <p className="text-xs text-slate-500 mt-1">Platform Control Center</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-slate-800 text-white font-medium">
            <Activity className="w-4 h-4" /> Platform Analytics
          </Link>
          <Link href="/admin/approvals" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white">
            <CheckCircle className="w-4 h-4" /> School Approvals 
            {stats.pendingApprovals > 0 && (
              <span className="ml-auto bg-accent text-slate-900 text-[10px] px-1.5 rounded-full font-bold">
                {stats.pendingApprovals}
              </span>
            )}
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white">
            <Users className="w-4 h-4" /> User Management
          </Link>
          <Link href="/admin/payouts" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white">
            <TrendingUp className="w-4 h-4" /> Commission & Payouts
          </Link>
          <Link href="/admin/promo" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white">
            <Tag className="w-4 h-4" /> Promo Codes
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white">
            <FileText className="w-4 h-4" /> Blog CMS
          </Link>
          <Link href="/admin/homepage" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white">
            <Globe className="w-4 h-4" /> Homepage Content
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white">
            <Settings className="w-4 h-4" /> SEO & Config
          </Link>
        </div>
      </aside>

      {/* Main Content Areas */}
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Platform Overview</h1>
          <p className="text-slate-500 text-sm">Real-time metrics across YogaRishikesh.</p>
        </div>

        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-4 flex items-center gap-1">+14% vs last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Platform Commission</p>
                  <h3 className="text-3xl font-bold text-slate-900">${stats.commission.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg"><TrendingUp className="w-5 h-5 text-amber-600" /></div>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-4 flex items-center gap-1">+14% vs last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Bookings</p>
                  <h3 className="text-3xl font-bold text-slate-900">1,248</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-4 flex items-center gap-1">+5% vs last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Active Schools</p>
                  <h3 className="text-3xl font-bold text-slate-900">{stats.activeSchools}</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg"><Users className="w-5 h-5 text-purple-600" /></div>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-4 flex items-center gap-1">
                {stats.pendingApprovals} Pending Approvals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Required & Top Schools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm bg-white rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Pending School Applications</CardTitle>
                <CardDescription>Review and approve new partners to join the platform.</CardDescription>
              </div>
              <Link href="/admin/approvals">
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingSchools.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No pending applications.</p>
                ) : (
                  pendingSchools.map((school) => (
                    <div key={school.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600">
                          {school.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{school.name}</div>
                          <div className="text-xs text-slate-500">{school.owner?.name || 'New User'} • {school.address || 'Rishikesh'}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/approvals`}>
                          <Button variant="outline" size="sm" className="text-xs h-8">Review</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Schools (This Month)</CardTitle>
              <CardDescription>Schools generating the most bookings and revenue.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                {[
                  { name: "Satvic Yoga Academy", rev: "$12,450", bookings: 16 },
                  { name: "Anand Prakash Ashram", rev: "$9,200", bookings: 12 },
                  { name: "Rishikul Yogshala", rev: "$8,800", bookings: 10 }
                ].map((school, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-slate-400 w-4">{idx + 1}</div>
                      <div className="font-medium text-sm text-slate-900">{school.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-slate-900">{school.rev}</div>
                      <div className="text-xs text-slate-500">{school.bookings} bookings</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}

