"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, GraduationCap, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function SchoolRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: "",
    ownerName: "",
    email: "",
    password: "",
    address: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "SCHOOL_ADMIN" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
      // Wait 3 seconds then redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 shadow-2xl border-t-4 border-t-emerald-500">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold font-heading mb-4">Application Submitted!</h2>
          <p className="text-slate-600 mb-8">
            Thank you for applying to partner with YogaRishikesh. Your application is now being reviewed by our team.
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg text-emerald-800 text-sm mb-8">
            Check your email for further instructions on completing your profile.
          </div>
          <Button asChild className="w-full h-12 text-lg font-bold">
            <Link href="/login">Go to Login <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <Image 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop"
          alt="Yoga Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary">YogaRishikesh<span className="text-accent">.</span></h1>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 mt-4">Partner with Us</h2>
          <p className="text-slate-600 mt-2">Join the world&apos;s leading platform for Rishikesh yoga schools.</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur overflow-hidden">
          <div className="h-2 bg-accent w-full" />
          <CardHeader>
            <div className="flex items-center gap-3 mb-2 text-accent">
               <GraduationCap className="w-6 h-6" />
               <span className="font-bold uppercase tracking-widest text-xs">School Application</span>
            </div>
            <CardTitle className="text-3xl font-bold font-heading">Apply for Partnership</CardTitle>
            <CardDescription>Fill out the details below to register your school. All applications are manually verified.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input 
                    id="schoolName" 
                    placeholder="e.g. Satvic Yoga Academy" 
                    required 
                    value={formData.schoolName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner/Manager Name</Label>
                  <Input 
                    id="ownerName" 
                    placeholder="e.g. Swami Sivananda" 
                    required 
                    value={formData.ownerName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@yourschool.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Login Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Min 8 characters" 
                    required 
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">School Address in Rishikesh</Label>
                <Textarea 
                  id="address" 
                  placeholder="e.g. Tapovan, Badrinath Road, Near Laxman Jhula..." 
                  required 
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input 
                  id="website" 
                  type="url" 
                  placeholder="https://www.yourschool.com" 
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500 leading-relaxed">
                  By submitting this application, you agree to our <Link href="#" className="text-primary hover:underline">Partner Terms of Service</Link> and understand that YogaRishikesh charges a fixed commission on every successful booking facilitated through the platform.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 text-xl shadow-lg"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Submit Partnership Application"}
              </Button>
              <p className="text-sm text-slate-600 text-center">Already a partner? <Link href="/login" className="text-primary font-bold hover:underline">Log in to portal</Link></p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
