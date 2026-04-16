import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Calendar as CalendarIcon, MessageSquare, Image as ImageIcon, DollarSign, Settings, LogOut } from "lucide-react";

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row mt-16">
      {/* Sidebar sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-border shrink-0 flex flex-col h-auto md:min-h-[calc(100vh-64px)]">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading font-bold text-lg text-primary truncate">Satvic Yoga Academy</h2>
          <p className="text-xs text-muted-foreground mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/school-admin" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-primary/5 text-primary font-medium">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/school-admin/courses" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground">
            <BookOpen className="w-4 h-4" /> Course Manager
          </Link>
          <Link href="/school-admin/calendar" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground">
            <CalendarIcon className="w-4 h-4" /> Availability
          </Link>
          <Link href="/school-admin/bookings" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground">
            <Users className="w-4 h-4" /> Bookings
          </Link>
          <Link href="/school-admin/enquiries" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground">
            <MessageSquare className="w-4 h-4" /> Enquiries <span className="ml-auto bg-accent text-primary text-[10px] px-1.5 rounded-full font-bold">3</span>
          </Link>
          <Link href="/school-admin/gallery" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground">
            <ImageIcon className="w-4 h-4" /> Photos & Videos
          </Link>
          <Link href="/school-admin/revenue" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground">
            <DollarSign className="w-4 h-4" /> Revenue
          </Link>
        </nav>
        <div className="p-4 border-t border-border space-y-1">
          <Link href="/school-admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <button className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
