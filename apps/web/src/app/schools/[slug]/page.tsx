import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, CheckCircle, Navigation, MessagesSquare, Share, Heart, GraduationCap, Clock, Award, Coffee, Eye } from "lucide-react";

export default function SchoolProfilePage() {
  return (
    <div className="bg-white min-h-screen pt-20">
      
      {/* Title & Micro Navigation */}
      <div className="container mx-auto px-4 lg:px-8 pt-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-2">Satvic Yoga Academy</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center text-primary font-bold"><Star className="w-4 h-4 fill-accent text-accent mr-1"/> 5.0 <span className="font-normal underline ml-1 text-slate-500 cursor-pointer">245 reviews</span></div>
              <div className="flex items-center text-slate-500"><MapPin className="w-4 h-4 mr-1"/> Laxman Jhula, Rishikesh <span className="underline ml-1 cursor-pointer font-medium">Show map</span></div>
              <div className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"><CheckCircle className="w-3 h-3 mr-1"/> Super School</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="rounded-full shadow-sm border border-slate-200 h-9 px-4 text-xs font-bold hover:bg-slate-50"><Share className="w-4 h-4 mr-2"/> Share</Button>
            <Button variant="ghost" className="rounded-full shadow-sm border border-slate-200 h-9 px-4 text-xs font-bold hover:bg-slate-50"><Heart className="w-4 h-4 mr-2"/> Save</Button>
          </div>
        </div>
      </div>

      {/* Hero Gallery (Bento Box Collage) */}
      <div className="container mx-auto px-4 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[500px] rounded-3xl overflow-hidden relative group">
          {/* Main Huge Image */}
          <div className="md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
            <Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" alt="Gallery" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          {/* Top Right Images */}
          <div className="hidden md:block relative cursor-pointer overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800&auto=format&fit=crop" alt="Gallery" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden md:block relative cursor-pointer overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" alt="Gallery" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          {/* Bottom Right Images */}
          <div className="hidden md:block relative cursor-pointer overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop" alt="Gallery" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="hidden md:block relative cursor-pointer overflow-hidden">
             <Image src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop" alt="Gallery" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <Button variant="outline" className="hidden md:flex absolute bottom-6 right-6 z-20 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 font-bold rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:bg-white transition-all hover:scale-105" size="sm">
            <Eye className="w-4 h-4 mr-2" /> Show all photos
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-12 pb-24 relative items-start">
        {/* Left Main Content */}
        <div className="flex-1 w-full max-w-[800px]">
          
          <div className="flex justify-between items-start pb-6 border-b border-slate-200 mb-8">
            <div>
              <h2 className="text-2xl font-bold font-heading text-primary mb-1">Traditional Hatha & Ashtanga Vinyasa</h2>
              <p className="text-slate-600 font-medium">Yoga Alliance Certified • Deep Immersion</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden relative shrink-0 shadow-sm border border-slate-200">
               <Image src="https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?w=200&q=80&sig=0" alt="Founder" fill className="object-cover" />
            </div>
          </div>

          <div className="space-y-6 pb-8 border-b border-slate-200 mb-8">
            <div className="flex items-start gap-4">
              <Award className="w-6 h-6 text-slate-700 shrink-0 mt-0.5"/>
              <div>
                <h3 className="font-bold text-slate-900">Highly Rated Education</h3>
                <p className="text-sm text-slate-500">Graduates consisently rate the teaching quality as 5 stars.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-slate-700 shrink-0 mt-0.5"/>
              <div>
                <h3 className="font-bold text-slate-900">Perfect Location</h3>
                <p className="text-sm text-slate-500">100% of recent guests gave the location a 5-star rating.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Coffee className="w-6 h-6 text-slate-700 shrink-0 mt-0.5"/>
              <div>
                <h3 className="font-bold text-slate-900">Ayurvedic Meals Included</h3>
                <p className="text-sm text-slate-500">Three pure vegetarian sattvic meals daily are included in the price.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary mb-4 font-heading">About this Ashram</h2>
            <div className="text-slate-600 prose prose-slate max-w-none text-base leading-relaxed font-light">
              <p className="mb-4">
                Established deeply in the traditional roots of Yogic wisdom, Satvic Yoga Academy is nestled in the spiritual vibrance of Rishikesh, right beside the holy river Ganges. 
              </p>
              <p>
                Our 200 Hour Yoga Teacher Training Course in Rishikesh is a comprehensive immersion into the world of Yoga. We cover Hatha & Ashtanga Vinyasa methodology, profound philosophy, pranayama, and intensive anatomy sessions. Prepare for a transformational journey.
              </p>
            </div>
            <Button variant="link" className="px-0 font-bold underline mt-2 text-primary hover:text-accent font-heading text-lg">Show more &gt;</Button>
          </div>

          <div className="w-full h-[1px] bg-slate-200 mb-10"></div>

          {/* New Courses Section layout */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">Upcoming Immersions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "200-Hour TTC", dates: "June 1 - 25, 2024", type: "Certification", duration: "25 Days", price: "$1,200", status: "Filling Fast" },
                { title: "Detox Retreat", dates: "July 10 - 17, 2024", type: "Wellness", duration: "7 Days", price: "$650", status: "Available" }
              ].map((course, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow bg-white flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{course.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${course.status === 'Filling Fast' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-primary leading-tight mb-2 group-hover:text-amber-600 transition-colors">{course.title}</h3>
                  <div className="text-slate-500 text-sm mb-1 font-medium">{course.dates}</div>
                  <div className="text-slate-400 text-sm mb-6 pb-6 border-b border-slate-100">{course.duration}</div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="font-bold text-xl text-primary">{course.price}</div>
                    <Link href={`/booking/123`}>
                      <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold px-6 shadow-lg hover:scale-105 transition-transform">Book</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Sticky Booking Sidebar - The "Money" widget */}
        <div className="w-full lg:w-[350px] shrink-0 lg:sticky lg:top-32 relative z-20">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_20px_60px_rgb(0,0,0,0.1)]">
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-2xl font-bold font-heading line-through text-slate-400 mr-2">$1,450</span>
                <span className="text-3xl font-heading font-bold text-primary">$1,200</span>
                <span className="text-slate-500 font-normal text-sm"> / course</span>
              </div>
            </div>
            
            <div className="border border-slate-300 rounded-xl overflow-hidden mb-4 bg-white">
              <div className="flex border-b border-slate-300">
                <div className="flex-1 p-3 border-r border-slate-300">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Check-in</div>
                  <div className="text-sm font-medium">01 Jun 2024</div>
                </div>
                <div className="flex-1 p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Check-out</div>
                  <div className="text-sm font-medium">25 Jun 2024</div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 flex justify-between items-center cursor-pointer">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Guests</div>
                  <div className="text-sm font-medium">1 student</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <Link href="/booking/123" className="block mb-4">
              <Button size="lg" className="w-full rounded-xl bg-accent hover:bg-amber-400 text-primary font-bold text-lg shadow-lg shadow-amber-500/20 py-7 transition-transform hover:scale-[1.02]">
                Reserve Dates
              </Button>
            </Link>
            
            <p className="text-center text-xs text-slate-500 mb-6 font-medium">You won&apos;t be charged yet</p>

            <div className="space-y-4 mb-6 text-slate-600 font-light text-sm">
              <div className="flex justify-between">
                <span>Tuition Fee</span>
                <span>$800</span>
              </div>
              <div className="flex justify-between">
                <span>Accommodation <span className="text-xs ml-1 bg-slate-100 px-1 rounded">25 nights</span></span>
                <span>$400</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Early Bird Discount</span>
                <span>-$250</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 font-bold text-primary text-lg">
              <span>Total value</span>
              <span>$950</span>
            </div>

            {/* Support Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl border-slate-300 text-slate-700 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                <MessagesSquare className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </div>
          </div>

          <div className="mt-6 flex justify-center text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer pb-8">
            <span className="flex items-center"><Navigation className="w-3 h-3 mr-1" /> Report this listing</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline fallback for standard ChevronDown
function ChevronDown(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
}
