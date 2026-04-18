"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Calendar, Heart, Award, User, Clock, MapPin, Download, Loader2 } from "lucide-react";
import Image from "next/image";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("past");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    
    // Check hash on mount to set initial tab
    const hash = window.location.hash.replace("#", "");
    if (["past", "saved", "certificates"].includes(hash)) {
      setActiveTab(hash);
    } else if (hash === "bookings") {
      setActiveTab("past");
    } else if (hash === "wishlist") {
      setActiveTab("saved");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;
  const userInitials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "U";

  const handleSidebarClick = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-2">My Journey</h1>
        <p className="text-muted-foreground mb-8">Manage your retreats, saved schools, and profile.</p>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar */}
          <Card className="w-full md:w-64 shrink-0 shadow-sm border-border sticky top-24">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-primary/5">
                <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xl">
                  {userInitials}
                </div>
                <div>
                  <div className="font-bold">{user?.name || "User"}</div>
                  <div className="text-xs text-muted-foreground">
                    {user?.role === "SUPER_ADMIN" ? "Administrator" : 
                     user?.role === "SCHOOL_ADMIN" ? "School Owner" : "Student"}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleSidebarClick("past")}
                className={`flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === "past" ? "bg-secondary text-primary font-medium" : "text-muted-foreground hover:bg-slate-100"}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Overview
              </button>
              <button 
                onClick={() => handleSidebarClick("past")}
                className={`flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === "past" ? "bg-secondary text-primary font-medium" : "text-muted-foreground hover:bg-slate-100"}`}
              >
                <Calendar className="w-4 h-4" /> My Bookings
              </button>
              <button 
                onClick={() => handleSidebarClick("saved")}
                className={`flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === "saved" ? "bg-secondary text-primary font-medium" : "text-muted-foreground hover:bg-slate-100"}`}
              >
                <Heart className="w-4 h-4" /> Saved Schools
              </button>
              <button 
                onClick={() => handleSidebarClick("certificates")}
                className={`flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === "certificates" ? "bg-secondary text-primary font-medium" : "text-muted-foreground hover:bg-slate-100"}`}
              >
                <Award className="w-4 h-4" /> Certificates
              </button>
              <button 
                onClick={() => handleSidebarClick("profile")}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-slate-100"
              >
                <User className="w-4 h-4" /> Profile Settings
              </button>
              
              <div className="pt-4 mt-4 border-t border-slate-100">
                 <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-50"
                 >
                    <Clock className="w-4 h-4" /> Sign Out
                 </button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Upcoming Booking Card */}
            <Card className="border-border shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full -z-10 blur-xl"></div>
              <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-center text-xl">
                  <span>Upcoming Journey</span>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">Confirmed</span>
                </CardTitle>
                <CardDescription>You are traveling in exactly 45 Days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-sm shrink-0">
                    <Image src="https://images.unsplash.com/photo-1545562083-a6007040df1e?w=400&q=80" alt="retreat" fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-heading font-bold text-xl mb-1">200-Hour Hatha Yoga TTC</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                      <MapPin className="w-3 h-3"/> Satvic Yoga Academy, Rishikesh
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-muted-foreground text-xs">Dates</div>
                        <div className="font-medium">June 1 - 25, 2024</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Room</div>
                        <div className="font-medium">Private Room</div>
                      </div>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <Button variant="outline" size="sm" className="rounded-full">View Details</Button>
                      <Button size="sm" className="rounded-full bg-primary text-white">Contact School</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6 space-x-6">
                <TabsTrigger value="past" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-2 text-base font-medium text-muted-foreground">Past Bookings</TabsTrigger>
                <TabsTrigger value="saved" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-2 text-base font-medium text-muted-foreground">Saved Schools</TabsTrigger>
                <TabsTrigger value="certificates" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-2 text-base font-medium text-muted-foreground">Certificates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="past" className="space-y-4">
                <Card className="border-border shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=200&q=80" alt="retreat" fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold mb-1">7-Day Spiritual Wellness Retreat</h4>
                      <div className="text-xs text-muted-foreground mb-1"><MapPin className="w-3 h-3 inline"/> Anand Prakash • March 2023</div>
                      <div className="text-xs font-bold text-emerald-700">Completed</div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">Leave Review</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fake saved school card */}
                <Card className="overflow-hidden border-border/50 shadow-sm">
                  <div className="relative h-40">
                    <Image src="https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?w=400&q=80" alt="school" fill className="object-cover" />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/50 hover:bg-white rounded-full text-accent"><Heart className="w-4 h-4 fill-accent" /></Button>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold font-heading mb-1">Himalayan Yoga Ashram</h4>
                    <p className="text-xs text-muted-foreground mb-4">Tapovan, Rishikesh • 4.8 Rating</p>
                    <Button variant="default" size="sm" className="w-full bg-accent text-primary font-bold hover:bg-accent/90" asChild>
                      <Link href="/schools/himalayan-yoga-ashram">View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certificates">
                <Card className="border-border shadow-sm border-dashed">
                  <CardContent className="p-8 flex flex-col justify-center items-center text-center">
                    <Award className="w-12 h-12 text-primary/20 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Yoga Alliance Certificate</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">Complete a TTC program to unlock your official Yoga Alliance recognizable certificate of completion.</p>
                    <Button variant="outline" disabled><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </div>
    </div>
  );
}
