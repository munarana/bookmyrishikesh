import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, BookOpen, Star, ArrowUpRight } from "lucide-react";

export default function SchoolAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Overview</h1>
          <p className="text-muted-foreground">Welcome back. Here is what&apos;s happening with your school today.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">Create New Course</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1"><ArrowUpRight className="w-3 h-3 mr-1"/> +12% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (After Comm.)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1"><ArrowUpRight className="w-3 h-3 mr-1"/> +4% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">2 upcoming next week</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-accent fill-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground mt-1">Based on 120 reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
         <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Eleanor Pena", course: "200-Hour TTC", date: "June 1, 2024", status: "Deposit Paid" },
                { name: "Jerome Bell", course: "7-Day Retreat", date: "May 15, 2024", status: "Pending" },
                { name: "Cameron Williamson", course: "200-Hour TTC", date: "June 1, 2024", status: "Fully Paid" },
              ].map((booking, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-bold text-sm">{booking.name}</div>
                    <div className="text-xs text-muted-foreground">{booking.course} • Starts {booking.date}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded font-medium ${
                    booking.status === "Fully Paid" ? "bg-emerald-100 text-emerald-800" : 
                    booking.status === "Deposit Paid" ? "bg-amber-100 text-amber-800" :
                    "bg-slate-100 text-slate-800"
                  }`}>
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Bookings</Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Unanswered Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Jenkins", msg: "Hi, do you offer vegan meals during the TTC?", time: "2 hours ago" },
                { name: "Michael Chen", msg: "Can I bring my partner if they are not doing the course?", time: "5 hours ago" },
              ].map((enquiry, i) => (
                <div key={i} className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{enquiry.name}</span>
                    <span className="text-xs text-muted-foreground">{enquiry.time}</span>
                  </div>
                  <p className="text-sm text-foreground mb-3">{enquiry.msg}</p>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary w-full shadow-sm font-bold">Reply via WhatsApp</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
