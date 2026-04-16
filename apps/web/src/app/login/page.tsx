import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, User, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <Image 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop"
          alt="Yoga Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary">YogaRishikesh<span className="text-accent">.</span></h1>
          </Link>
          <p className="text-slate-600 mt-2">Welcome back to your spiritual journey.</p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-white/50 backdrop-blur border border-slate-200">
            <TabsTrigger value="student" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"><User className="w-4 h-4 mr-2"/> Student</TabsTrigger>
            <TabsTrigger value="school" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"><GraduationCap className="w-4 h-4 mr-2"/> School Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student">
            <Card className="border-none shadow-xl bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-bold font-heading">Student Login</CardTitle>
                <CardDescription>Log in to view your bookings and certificates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="s-email">Email</Label>
                  <Input id="s-email" type="email" placeholder="yogi@example.com" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="s-password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                  </div>
                  <Input id="s-password" type="password" required />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-lg">Sign In</Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or continue with</span></div>
                </div>
                
                <Button variant="outline" className="w-full h-12 text-slate-700 bg-white border-slate-300 hover:bg-slate-50">
                  <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png" alt="Google" className="w-5 h-5 mr-2" />
                  Sign in with Google
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-slate-100 mt-4 pt-6">
                <p className="text-sm text-slate-600">Don&apos;t have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up</Link></p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="school">
            <Card className="border-none shadow-xl bg-white/95 backdrop-blur border-t-4 border-t-accent">
              <CardHeader>
                <CardTitle className="text-2xl font-bold font-heading">School Admin Portal</CardTitle>
                <CardDescription>Manage your yoga school, courses, and incoming bookings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-start gap-3 mb-4">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">For security reasons, schools cannot log in using Google OAuth. Please use your registered partner email.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="a-email">Partner Email</Label>
                  <Input id="a-email" type="email" placeholder="admin@ashram.com" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="a-password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
                  </div>
                  <Input id="a-password" type="password" required />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-primary font-bold h-12 text-lg">Access Portal</Button>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-slate-100 mt-4 pt-6">
                <p className="text-sm text-slate-600 flex flex-col items-center">
                  Want to list your school? 
                  <Link href="/register/school" className="text-primary font-bold hover:underline mt-1">Apply for Partnership</Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center text-xs text-slate-500 hover:text-slate-700 transition-colors">
          <Link href="/admin/login" className="flex items-center justify-center gap-1 opacity-60 hover:opacity-100">
            <ShieldAlert className="w-3 h-3" /> SuperAdmin Login Area
          </Link>
        </div>
      </div>
    </div>
  );
}
