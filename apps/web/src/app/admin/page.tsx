import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Activity,
  CheckCircle,
  Users,
  TrendingUp,
  Tag,
  FileText,
  Globe,
  Settings,
  LogOut,
  IndianRupee,
  Calendar,
  Building2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { KPICard } from "@/components/admin/KPICard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { SchoolsTable } from "@/components/admin/SchoolsTable";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { getAnalyticsData, getUsersData } from "@/lib/actions/admin-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  const [analyticsResult, usersResult] = await Promise.all([
    getAnalyticsData(),
    getUsersData("all", undefined, 50, 0),
  ]);
  const analytics = analyticsResult.success ? analyticsResult.data : null;
  const allUsers = usersResult.success ? usersResult.data.users : [];

  const kpis = analytics?.kpis || {
    totalRevenue: 0,
    revenueThisMonth: 0,
    totalCommission: 0,
    monthCommission: 0,
    activeSchools: 0,
    pendingApprovals: 0,
    totalBookings: 0,
    thisMonthBookings: 0,
    totalStudents: 0,
    publishedBlogPosts: 0,
  };

  const activities =
    analytics?.activities.map((activity) => ({
      ...activity,
      type: activity.type,
      timestamp: new Date(activity.timestamp),
    })) || [];
  const schools = analytics?.topSchools || [];
  const monthlyRevenue = analytics?.monthlyRevenue || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row mt-16 font-sans">
      {/* Super Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-auto md:min-h-[calc(100vh-64px)] shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" /> SuperAdmin
          </h2>
          <p className="text-xs text-slate-500 mt-1">Platform Control Center</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-slate-800 text-white font-medium"
          >
            <Activity className="w-4 h-4" /> Platform Analytics
          </Link>
          <Link
            href="/admin/approvals"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> School Approvals
            {kpis.pendingApprovals > 0 && (
              <span className="ml-auto bg-orange-500 text-slate-900 text-[10px] px-1.5 rounded-full font-bold">
                {kpis.pendingApprovals}
              </span>
            )}
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Users className="w-4 h-4" /> User Management
          </Link>
          <Link
            href="/admin/payouts"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <TrendingUp className="w-4 h-4" /> Commission & Payouts
          </Link>
          <Link
            href="/admin/promo"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Tag className="w-4 h-4" /> Promo Codes
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" /> Blog CMS
          </Link>
          <Link
            href="/admin/homepage"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Globe className="w-4 h-4" /> Homepage Content
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" /> SEO & Config
          </Link>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Platform Overview</h1>
            <p className="text-slate-500 text-sm mt-2">Real-time metrics across YogaRishikesh</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Last updated: <span className="font-medium text-slate-900">just now</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <KPICard
            title="Total Revenue"
            value={kpis.totalRevenue}
            icon={<IndianRupee className="w-5 h-5" />}
            color="emerald"
            format="currency"
            changePercent={12.4}
          />
          <KPICard
            title="Revenue This Month"
            value={kpis.revenueThisMonth}
            icon={<TrendingUp className="w-5 h-5" />}
            color="amber"
            format="currency"
            changePercent={8.1}
          />
          <KPICard
            title="Active Schools"
            value={kpis.activeSchools}
            icon={<Building2 className="w-5 h-5" />}
            color="blue"
            changePercent={5.2}
          />
          <KPICard
            title="Pending Approvals"
            value={kpis.pendingApprovals}
            icon={<Clock className="w-5 h-5" />}
            color="orange"
          />
          <KPICard
            title="Total Bookings"
            value={kpis.totalBookings}
            icon={<Calendar className="w-5 h-5" />}
            color="purple"
            changePercent={3.8}
          />
          <KPICard
            title="Total Students"
            value={kpis.totalStudents}
            icon={<Users className="w-5 h-5" />}
            color="orange"
            changePercent={6.5}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RevenueChart data={monthlyRevenue} />
          <ActivityFeed activities={activities} />
        </div>

        {/* Schools Table */}
        <div className="mb-8">
          <SchoolsTable schools={schools} />
        </div>

        {/* Platform Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">24.8%</div>
              <p className="text-xs text-slate-500 mt-2">
                Inquiries → Bookings
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Avg Review Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">4.8★</div>
              <p className="text-xs text-slate-500 mt-2">
                From {200} reviews
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {kpis.publishedBlogPosts}
              </div>
              <Link href="/admin/blog" className="text-xs text-orange-500 font-medium hover:underline block mt-2">
                Manage Blog →
              </Link>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Homepage Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">6</div>
              <Link href="/admin/homepage" className="text-xs text-orange-500 font-medium hover:underline block mt-2">
                Edit Homepage →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* User Management Tabs */}
        <div>
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="admins">School Admins</TabsTrigger>
              <TabsTrigger value="all">All Users</TabsTrigger>
            </TabsList>
            <TabsContent value="students">
              <UserManagementTable
                users={allUsers.filter((u) => u.role === "STUDENT")}
              />
            </TabsContent>
            <TabsContent value="admins">
              <UserManagementTable
                users={allUsers.filter((u) => u.role === "SCHOOL_ADMIN")}
              />
            </TabsContent>
            <TabsContent value="all">
              <UserManagementTable users={allUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
