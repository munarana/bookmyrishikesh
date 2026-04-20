import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, ChevronLeft, Save, Globe, Mail, CreditCard, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Mock settings data (in a real app, this would come from database/environment)
  const settings = {
    site: {
      name: 'YogaRishikesh',
      domain: 'yogarishikesh.com',
      description: 'Premier platform for yoga teacher training in Rishikesh',
      defaultCommissionRate: 10,
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      fromEmail: 'noreply@yogarishikesh.com',
      supportEmail: 'support@yogarishikesh.com',
    },
    payments: {
      stripePublishableKey: 'pk_live_...',
      stripeSecretKey: 'sk_live_...',
      currency: 'USD',
      paymentMethods: ['card', 'bank_transfer'],
    },
    security: {
      enable2FA: true,
      sessionTimeout: 24, // hours
      passwordPolicy: 'strong',
      apiRateLimit: 1000, // requests per hour
    },
  };

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
            System Configuration
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-slate-800 text-white font-medium">
            <Settings className="w-4 h-4" /> SEO & Config
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">System Settings</h1>
            <p className="text-slate-500 text-sm">Configure platform-wide settings and preferences.</p>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Site Settings */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Site Configuration
            </CardTitle>
            <CardDescription>Basic site information and branding settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.site.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Domain</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.site.domain}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  rows={3}
                  defaultValue={settings.site.description}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Commission Rate (%)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.site.defaultCommissionRate}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>SMTP settings for sending emails.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Host</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.email.smtpHost}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Port</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.email.smtpPort}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.email.fromEmail}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.email.supportEmail}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Settings
            </CardTitle>
            <CardDescription>Configure payment processing and methods.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stripe Publishable Key</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.payments.stripePublishableKey}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stripe Secret Key</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.payments.stripeSecretKey}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md" defaultValue={settings.payments.currency}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Methods</label>
                <div className="space-y-2">
                  {['card', 'bank_transfer', 'paypal'].map(method => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        defaultChecked={settings.payments.paymentMethods.includes(method)}
                      />
                      {method.replace('_', ' ').toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure security policies and access controls.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Two-Factor Authentication</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md" defaultValue={settings.security.enable2FA ? 'enabled' : 'disabled'}>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (hours)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.security.sessionTimeout}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password Policy</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md" defaultValue={settings.security.passwordPolicy}>
                  <option value="basic">Basic</option>
                  <option value="strong">Strong</option>
                  <option value="complex">Complex</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">API Rate Limit (requests/hour)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  defaultValue={settings.security.apiRateLimit}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}