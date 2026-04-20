import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, ChevronLeft, Plus, Percent, Calendar, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PromoCodesPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Mock promo codes data (in a real app, this would come from database)
  const promoCodes = [
    {
      id: '1',
      code: 'YOGA2024',
      discountType: 'percentage',
      discountValue: 15,
      usageLimit: 100,
      usedCount: 23,
      expiresAt: new Date('2024-12-31'),
      isActive: true,
      description: '15% off all courses',
    },
    {
      id: '2',
      code: 'WELCOME10',
      discountType: 'fixed',
      discountValue: 100,
      usageLimit: 50,
      usedCount: 12,
      expiresAt: new Date('2024-06-30'),
      isActive: true,
      description: '$100 off first booking',
    },
    {
      id: '3',
      code: 'SEASON20',
      discountType: 'percentage',
      discountValue: 20,
      usageLimit: 200,
      usedCount: 45,
      expiresAt: new Date('2024-08-31'),
      isActive: false,
      description: '20% off summer courses',
    },
  ];

  const activePromos = promoCodes.filter(p => p.isActive);
  const totalDiscountGiven = promoCodes.reduce((acc, promo) => {
    if (promo.discountType === 'percentage') {
      return acc + (promo.usedCount * (promo.discountValue / 100) * 1000); // Assuming average booking of $1000
    } else {
      return acc + (promo.usedCount * promo.discountValue);
    }
  }, 0);

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
            Marketing Tools
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-slate-800 text-white font-medium">
            <Tag className="w-4 h-4" /> Promo Codes
            <span className="ml-auto bg-accent text-slate-900 text-[10px] px-1.5 rounded-full font-bold">
              {activePromos.length}
            </span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Promo Codes</h1>
            <p className="text-slate-500 text-sm">Manage discount codes and marketing campaigns.</p>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Create Promo Code
          </Button>
        </div>

        {/* Promo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Active Promo Codes</p>
                  <h3 className="text-3xl font-bold text-slate-900">{activePromos.length}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg"><Tag className="w-5 h-5 text-green-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Usage</p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {promoCodes.reduce((acc, p) => acc + p.usedCount, 0)}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Discount Given</p>
                  <h3 className="text-3xl font-bold text-slate-900">${totalDiscountGiven.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg"><Percent className="w-5 h-5 text-purple-600" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promo Codes List */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle>All Promo Codes</CardTitle>
            <CardDescription>Manage discount codes and track their performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promoCodes.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <Tag className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 font-mono">{promo.code}</h4>
                      <p className="text-sm text-slate-500">{promo.description}</p>
                      <p className="text-xs text-slate-400">
                        Used {promo.usedCount} of {promo.usageLimit} times
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {promo.discountType === 'percentage'
                          ? `${promo.discountValue}% off`
                          : `$${promo.discountValue} off`
                        }
                      </div>
                      <div className="text-xs text-slate-500">
                        Expires {promo.expiresAt.toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={promo.isActive ? 'default' : 'secondary'}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </Badge>
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