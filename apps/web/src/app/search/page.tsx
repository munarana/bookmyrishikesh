import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, Star, SlidersHorizontal, ChevronRight, ChevronLeft, Heart } from "lucide-react";

export default function SearchPage() {
  const mockSchools = [
    {
      id: 1,
      name: "Satvic Yoga Academy",
      slug: "satvic-yoga-academy",
      location: "Laxman Jhula, Rishikesh",
      courses: "200-Hour TTC • 7 Days Retreat",
      price: "$1,200",
      rating: 5.0,
      reviews: 245,
      images: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
      ],
      badges: ["Guest Favorite", "Yoga Alliance"],
    },
    {
      id: 2,
      name: "Anand Prakash Ashram",
      slug: "anand-prakash",
      location: "Tapovan, Rishikesh",
      courses: "Akhanda Yoga • Drop-in Classes",
      price: "$850",
      rating: 4.8,
      reviews: 132,
      images: [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
      ],
      badges: ["Authentic Ashram"],
    },
    {
      id: 3,
      name: "Himalayan Iyengar Center",
      slug: "himalayan-iyengar",
      location: "Ram Jhula, Rishikesh",
      courses: "Iyengar Therapy • Advanced Alignment",
      price: "$950",
      rating: 4.9,
      reviews: 88,
      images: [
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800&auto=format&fit=crop",
      ],
      badges: [],
    },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden pt-16">
      {/* Top utility bar */}
      <div className="h-16 border-b border-border bg-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex gap-4 items-center">
          <Button variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-all text-sm h-10 border-slate-300">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" className="rounded-full border-slate-200 text-slate-600 h-10">Dates</Button>
            <Button variant="outline" className="rounded-full border-slate-200 text-slate-600 h-10">Price</Button>
            <Button variant="outline" className="rounded-full border-slate-200 text-slate-600 h-10">Yoga Style</Button>
            <Button variant="outline" className="rounded-full border-slate-200 text-slate-600 h-10">Room Type</Button>
          </div>
        </div>
        <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
          Showing 42 Yoga Retreats
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Side: Scrollable Listing Cards */}
        <div className="w-full lg:w-[60%] xl:w-[50%] h-full overflow-y-auto px-4 md:px-6 py-6 pb-32">
          
          <h1 className="text-2xl font-bold font-heading text-primary mb-6">Explore Rishikesh Retreats</h1>

          <div className="space-y-8">
            {mockSchools.map((school) => (
              <div key={school.id} className="group flex flex-col md:flex-row gap-5 pb-8 border-b border-slate-100 last:border-0 relative">
                
                {/* Image Gallery (Airbnb style) */}
                <div className="relative w-full md:w-72 h-64 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                  <Image 
                    src={school.images[0]} 
                    alt={school.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  {school.badges[0] && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-lg border border-slate-200/50">
                      {school.badges[0]}
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-white hover:bg-white/20 hover:text-white rounded-full bg-black/10 backdrop-blur-sm">
                    <Heart className="w-5 h-5 drop-shadow-md" />
                  </Button>
                  
                  {/* Fake Carousel Controls */}
                  <div className="absolute inset-y-0 left-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/80 rounded-full p-1 shadow-md cursor-pointer hover:bg-white"><ChevronLeft className="w-4 h-4 text-primary" /></div>
                  </div>
                  <div className="absolute inset-y-0 right-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/80 rounded-full p-1 shadow-md cursor-pointer hover:bg-white"><ChevronRight className="w-4 h-4 text-primary" /></div>
                  </div>
                  
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>
                    <span className="w-2 h-2 rounded-full bg-white/50 shadow-sm"></span>
                    <span className="w-2 h-2 rounded-full bg-white/50 shadow-sm"></span>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm text-slate-500">{school.location}</p>
                    <div className="flex items-center gap-1 text-sm font-bold text-primary">
                      <Star className="w-4 h-4 fill-primary" /> {school.rating.toFixed(1)} <span className="text-slate-400 font-normal">({school.reviews})</span>
                    </div>
                  </div>
                  
                  <Link href={`/schools/${school.slug}`}>
                    <h3 className="text-xl font-heading font-bold text-primary mb-2 hover:text-accent transition-colors">{school.name}</h3>
                  </Link>
                  
                  <div className="w-10 h-[1px] bg-slate-200 mb-3"></div>
                  
                  <p className="text-sm text-slate-600 mb-4">{school.courses}</p>
                  
                  <div className="flex gap-2 flex-wrap mb-4 mt-auto">
                    {school.badges.slice(1).map(b => (
                      <span key={b} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{b}</span>
                    ))}
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">Wi-Fi</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">Meals Included</span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="font-bold text-lg text-primary">{school.price} <span className="text-sm font-normal text-slate-500">total</span></div>
                    <Link href={`/schools/${school.slug}`} className="text-accent hover:text-amber-500 font-bold text-sm hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Map (Hidden on Mobile) */}
        <div className="hidden lg:block lg:w-[40%] xl:w-[50%] h-full relative bg-slate-100 border-l border-slate-200">
          <div className="absolute inset-0 z-0">
             {/* Fake Map Rendering */}
            <Image 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
              alt="Map View" 
              fill 
              className="object-cover opacity-70 sepia-[0.3]"
            />
          </div>
          
          {/* Map Interactive Pins */}
          <div className="absolute top-[30%] left-[40%] z-10 transition-transform hover:scale-110 cursor-pointer group">
            <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-200 font-bold text-sm text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-primary group-hover:border-accent">
              $1,200
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white group-hover:border-t-accent absolute left-1/2 -bottom-[8px] -translate-x-1/2 drop-shadow-md"></div>
          </div>
          <div className="absolute top-[50%] left-[60%] z-10 transition-transform hover:scale-110 cursor-pointer group">
            <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-200 font-bold text-sm text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-primary group-hover:border-accent">
              $850
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white group-hover:border-t-accent absolute left-1/2 -bottom-[8px] -translate-x-1/2 drop-shadow-md"></div>
          </div>
          
          {/* Mobile Map Button Handle */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex lg:hidden">
            <Button className="rounded-full bg-primary text-white shadow-xl px-6 h-12 font-bold focus:ring-4 focus:ring-primary/20">
              <MapPin className="w-5 h-5 mr-2" /> Show Map
            </Button>
          </div>
        </div>
      </div>
{/* Mobile Map Toggle Placed outside for standard z-indexing */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex lg:hidden">
         <Button className="rounded-full bg-slate-900 border border-slate-800 text-white shadow-[0_8px_30px_rgb(0,0,0,0.3)] px-6 h-12 font-bold">
            Map View
          </Button>
      </div>
    </div>
  );
}
