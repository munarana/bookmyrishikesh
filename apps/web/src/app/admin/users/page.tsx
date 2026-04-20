import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";
import { Users, Shield, ChevronLeft, UserCheck, UserX, User } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    include: {
      school: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const userStats = {
    total: users.length,
    superAdmins: users.filter((user) => user.role === "SUPER_ADMIN").length,
    schoolAdmins: users.filter((user) => user.role === "SCHOOL_ADMIN").length,
    students: users.filter((user) => user.role === "STUDENT").length,
    pendingStudents: users.filter((user) => user.role === "STUDENT" && !user.isActive).length,
  };

  async function updateUserActive(formData: FormData) {
    "use server";
    const userId = String(formData.get("userId") || "");
    const isActive = String(formData.get("isActive") || "") === "true";
    if (!userId) return;

    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row mt-16 font-sans">
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
            User Management
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-slate-800 text-white font-medium">
            <Users className="w-4 h-4" /> All Users
            <span className="ml-auto bg-accent text-slate-900 text-[10px] px-1.5 rounded-full font-bold">
              {users.length}
            </span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-500 text-sm">Manage platform users and their roles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
                  <h3 className="text-3xl font-bold text-slate-900">{userStats.total}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Super Admins</p>
                  <h3 className="text-3xl font-bold text-slate-900">{userStats.superAdmins}</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">School Admins</p>
                  <h3 className="text-3xl font-bold text-slate-900">{userStats.schoolAdmins}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Students</p>
                  <h3 className="text-3xl font-bold text-slate-900">{userStats.students}</h3>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <UserX className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Pending Students</p>
                  <h3 className="text-3xl font-bold text-slate-900">{userStats.pendingStudents}</h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle>All Platform Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{user.name}</h4>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      {user.school ? (
                        <p className="text-xs text-slate-400">Owns: {user.school.name}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.role === "SUPER_ADMIN" ? "default" : user.role === "SCHOOL_ADMIN" ? "secondary" : "outline"}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Pending"}
                    </Badge>
                    {user.role !== "SUPER_ADMIN" ? (
                      <form action={updateUserActive}>
                        <input type="hidden" name="userId" value={user.id} />
                        <input type="hidden" name="isActive" value={String(!user.isActive)} />
                        <button className="text-xs font-semibold text-primary hover:underline" type="submit">
                          {user.isActive ? "Suspend" : "Approve"}
                        </button>
                      </form>
                    ) : null}
                    <span className="text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</span>
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
