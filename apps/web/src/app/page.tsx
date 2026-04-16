import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Calendar, Users, Star, ArrowRight, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Immersive Cinematic Hero */}
      <section className="relative w-full h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Deep, rich imagery with elegant gradients instead of harsh flat colors */}
        <div className="absolute inset-0 bg-primary/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Yoga in Rishikesh"
          fill
          className="object-cover scale-105 animate-[kenburns_20s_ease-out_forwards]"
          priority
        />
        
        <div className="relative z-20 container px-4 mx-auto text-center translate-y-[-10%]">
          <span className="inline-block py-1 px-4 border border-white/30 rounded-full text-white/90 text-xs tracking-[0.2em] uppercase font-bold mb-6 backdrop-blur-md bg-white/10">
            The Capital of Yoga
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-medium text-white tracking-tight drop-shadow-2xl mb-6">
            Find Your <span className="text-accent italic font-serif">Center.</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/80 font-light max-w-2xl mx-auto mb-12 drop-shadow-md">
            Discover verified, world-class ashrams and transformative TTC programs exclusively in Rishikesh, India.
          </p>
          
          {/* Glassmorphism Floating Search Bar */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex w-full items-center px-4 py-3 bg-white/95 rounded-xl md:rounded-full hover:shadow-inner transition-all group cursor-text">
              <MapPin className="w-5 h-5 text-primary/50 group-hover:text-amber-500 transition-colors mr-3" />
              <div className="text-left w-full">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Experience</div>
                <input type="text" placeholder="e.g. 200 Hour TTC, Hatha..." className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400 font-medium text-primary" />
              </div>
            </div>
            
            <div className="flex-1 flex w-full items-center px-4 py-3 bg-white/95 rounded-xl md:rounded-full hover:shadow-inner transition-all group cursor-text">
              <Calendar className="w-5 h-5 text-primary/50 group-hover:text-amber-500 transition-colors mr-3" />
              <div className="text-left w-full">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dates</div>
                <input type="text" placeholder="Add dates" className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400 font-medium text-primary" />
              </div>
            </div>
            
            <Link href="/search" className="w-full md:w-auto shrink-0">
              <Button size="lg" className="w-full md:w-auto h-16 md:h-full px-8 rounded-xl md:rounded-full bg-accent hover:bg-amber-400 text-primary font-bold text-lg shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]">
                <Search className="w-5 h-5 md:mr-2" />
                <span className="md:hidden lg:inline">Search Path</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-primary text-primary-foreground py-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-80 font-medium text-sm md:text-base">
            <div className="flex items-center gap-2"><Star className="w-5 h-5 text-accent fill-accent"/> 4.9/5 Average Rating</div>
            <div className="flex items-center gap-2"><Users className="w-5 h-5"/> 12,000+ Students Graduated</div>
            <div className="hidden md:flex items-center gap-2"><MapPin className="w-5 h-5"/> 150+ Verified Ashrams</div>
            <div className="flex items-center gap-2 font-bold italic tracking-wide text-accent">#1 Platform for Rishikesh</div>
          </div>
        </div>
      </section>

      {/* Exquisite Curated Categories */}
      <section className="py-24 bg-[#FAF9F5]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-widest uppercase text-accent mb-2">Curated Experiences</h2>
              <h3 className="text-4xl md:text-5xl font-heading font-bold text-primary">Begin Your Journey.</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "200-Hour TTC", desc: "Foundation Certification", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" },
              { title: "Wellness Retreats", desc: "Digital Detox & Spa", img: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80" },
              { title: "Ayurveda", desc: "Ancient Healing", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80" },
              { title: "Meditation", desc: "Silent Vipassana", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80" },
            ].map((cat) => (
              <Link href={`/search?category=${cat.title.toLowerCase()}`} key={cat.title} className="group block">
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg shadow-black/5">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <Image src={cat.img} alt={cat.title} fill className="object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{cat.desc}</p>
                    <h4 className="text-2xl font-heading font-medium text-white">{cat.title}</h4>
                  </div>
                  <div className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Spotlight / Bento Box Layout for Top Schools */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-accent mb-2">The Platinum Collection</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Legendary Schools</h3>
            <p className="text-lg text-slate-500 font-light">We handpick only the highest rated, most serene sanctuaries in Rishikesh so you never have to guess.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[600px]">
             {/* Left Massive Featured Card */}
            <Link href="/schools/satvic-yoga-academy" className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl group flex flex-col justify-end">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              <Image src="https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?w=1200&q=80" alt="Satvic Yoga" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" />
              
              <div className="relative z-20 p-8 md:p-12">
                <div className="flex gap-2 mb-4">
                  <span className="bg-emerald-500/20 text-emerald-300 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">Verified</span>
                  <span className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" /> 5.0 (200+)</span>
                </div>
                <h4 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 leading-tight">Satvic Yoga Academy</h4>
                <p className="text-white/80 font-light max-w-md hidden md:block mb-6">Experience profound awakening in their legendary 200-Hour immersion alongside the majestic Ganges.</p>
                <div className="inline-flex items-center gap-2 text-accent font-bold group-hover:text-white transition-colors">
                  Explore Ashram <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Right Stacked Cards */}
            <div className="lg:col-span-5 flex flex-col gap-8 h-full">
              <Link href="/schools/anand-prakash" className="flex-1 relative rounded-3xl overflow-hidden shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <Image src="https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800&q=80" alt="Anand Prakash" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                  <h4 className="text-2xl font-heading font-bold text-white mb-1">Anand Prakash</h4>
                  <p className="text-white/70 text-sm">Deep Akhanda Yoga Tradition</p>
                </div>
              </Link>
              
              <Link href="/schools/himalayan-iyengar" className="flex-1 relative rounded-3xl overflow-hidden shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <Image src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=80" alt="Iyengar Center" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                  <h4 className="text-2xl font-heading font-bold text-white mb-1">Himalayan Iyengar</h4>
                  <p className="text-white/70 text-sm">Precision, alignment, therapy.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Editorial Banner */}
      <section className="py-24 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10 blur-sm">
          <Image src="https://images.unsplash.com/photo-1534063854199-6e3e57d6052f?w=1600&q=80" alt="Texture" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <PlayCircle className="w-16 h-16 text-accent mx-auto mb-6 hover:scale-110 cursor-pointer transition-transform" />
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">See why Rishikesh is calling you.</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">Take a breathtaking 2-minute cinematic journey through the foothills of the Himalayas where thousands find their purpose every year.</p>
          <Button className="rounded-full bg-white text-primary hover:bg-slate-100 font-bold px-8">Watch Documentary</Button>
        </div>
      </section>
    </div>
  );
}
