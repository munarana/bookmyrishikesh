"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin, Search, Calendar, Users, Star, ArrowRight,
  CheckCircle, Sparkles, TrendingUp, Heart, Shield,
  Clock, Globe, ChevronDown, PlayCircle, Quote
} from "lucide-react";

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const step = target / (duration / 16);
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, target);
          setCount(Math.floor(cur));
          if (cur >= target) clearInterval(t);
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

const CATEGORIES = [
  { label: "200-Hr TTC", icon: "🧘", q: "TTC", color: "from-emerald-500/20 to-emerald-600/10" },
  { label: "Retreat", icon: "🌿", q: "Retreat", color: "from-amber-500/20 to-amber-600/10" },
  { label: "Ayurveda", icon: "🌸", q: "Ayurveda", color: "from-rose-500/20 to-rose-600/10" },
  { label: "Meditation", icon: "☮️", q: "Meditation", color: "from-violet-500/20 to-violet-600/10" },
  { label: "Pranayama", icon: "💨", q: "Pranayama", color: "from-sky-500/20 to-sky-600/10" },
  { label: "Hatha Yoga", icon: "🌅", q: "Hatha", color: "from-orange-500/20 to-orange-600/10" },
];

const SCHOOLS = [
  {
    name: "200-Hour Hatha & Ashtanga Vinyasa TTC",
    school: "Satvic Yoga Academy",
    slug: "satvic-yoga-academy",
    location: "Laxman Jhula",
    rating: 5.0,
    reviews: 245,
    price: 1200,
    tag: "Best Seller",
    tagColor: "bg-amber-400 text-amber-900",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    style: "Hatha · Ashtanga",
    duration: "25 Days",
    dates: "Oct 1 - Oct 25, 2026",
  },
  {
    name: "7-Day Authentic Himalayan Yoga Retreat",
    school: "Anand Prakash Ashram",
    slug: "anand-prakash",
    location: "Tapovan",
    rating: 4.9,
    reviews: 178,
    price: 350,
    tag: "Top Rated",
    tagColor: "bg-emerald-400 text-emerald-900",
    img: "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=800&auto=format&fit=crop",
    style: "Akhanda Yoga",
    duration: "7 Days",
    dates: "Flexible Dates Available",
  },
  {
    name: "14-Day Iyengar Yoga Intensive Course",
    school: "Himalayan Iyengar",
    slug: "himalayan-iyengar",
    location: "Ram Jhula",
    rating: 4.8,
    reviews: 132,
    price: 650,
    tag: "Certified",
    tagColor: "bg-sky-400 text-sky-900",
    img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=800&auto=format&fit=crop",
    style: "Iyengar · Therapy",
    duration: "14 Days",
    dates: "Nov 5 - Nov 18, 2026",
  },
  {
    name: "300-Hour Advanced Kundalini TTC",
    school: "Rishikesh Yog Peeth",
    slug: "rishikesh-yog-peeth",
    location: "Upper Tapovan",
    rating: 4.9,
    reviews: 412,
    price: 1500,
    tag: "Advanced",
    tagColor: "bg-purple-400 text-purple-900",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop",
    style: "Kundalini · Vinyasa",
    duration: "30 Days",
    dates: "Sep 1 - Sep 30, 2026",
  },
  {
    name: "10-Day Ayurveda & Detox Retreat",
    school: "Arogya Ayurvedic Centre",
    slug: "arogya-ayurveda",
    location: "Swargashram",
    rating: 4.7,
    reviews: 89,
    price: 850,
    tag: "Wellness",
    tagColor: "bg-rose-400 text-rose-900",
    img: "https://images.unsplash.com/photo-1545389336-eaeecece96fe?q=80&w=800&auto=format&fit=crop",
    style: "Ayurveda · Detox",
    duration: "10 Days",
    dates: "Weekly Departures",
  },
  {
    name: "5-Day Silent Meditation Retreat",
    school: "Osho Ganga Dham",
    slug: "osho-ganga-dham",
    location: "Brahmpuri",
    rating: 4.8,
    reviews: 215,
    price: 250,
    tag: "Spiritual",
    tagColor: "bg-blue-400 text-blue-900",
    img: "https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?q=80&w=800&auto=format&fit=crop",
    style: "Vipassana · Active Meditation",
    duration: "5 Days",
    dates: "Oct 12 - Oct 16, 2026",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    country: "🇬🇧 United Kingdom",
    text: "This platform made finding my 200-hour TTC so easy. I booked within a day and the school was absolutely breathtaking. Truly life-changing.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    course: "200-Hr TTC at Satvic Yoga",
  },
  {
    name: "Marco Ferretti",
    country: "🇮🇹 Italy",
    text: "I was nervous booking from abroad but the verified badges and detailed profiles gave me total confidence. The ashram exceeded every expectation.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    course: "7-Day Retreat at Anand Prakash",
  },
  {
    name: "Yuki Tanaka",
    country: "🇯🇵 Japan",
    text: "The morning pranayama sessions by the Ganges were transcendent. Booking was seamless and the team was available for every question I had.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
    course: "14-Day Pranayama at Himalayan Iyengar",
  },
];

const HOW_IT_WORKS = [
  { step: "01", icon: <Search className="w-6 h-6" />, title: "Search & Filter", desc: "Browse 150+ verified ashrams by style, duration, price & dates." },
  { step: "02", icon: <Shield className="w-6 h-6" />, title: "Book Securely", desc: "Reserve with just a 20% deposit. Full refunds on cancellation." },
  { step: "03", icon: <Heart className="w-6 h-6" />, title: "Transform", desc: "Arrive, breathe, practice. Come back a different person." },
];

export default function Home() {
  const [searchType, setSearchType] = useState("Retreats");
  const [experience, setExperience] = useState("");
  const [dates, setDates] = useState("");
  const [savedIdx, setSavedIdx] = useState<number | null>(null);

  const stat1 = useCounter(12000);
  const stat2 = useCounter(150);
  const stat3 = useCounter(98);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBF4] overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2400&auto=format&fit=crop"
            alt="Yoga in Rishikesh at sunrise"
            fill priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Morning golden overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/30 via-primary/50 to-primary/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent" />
        </div>

        {/* Floating sun-ray blobs */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-300/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-orange-300/10 rounded-full blur-[80px] animate-pulse delay-700" />

        <div className="relative z-10 container px-4 mx-auto text-center">
          {/* Morning greeting badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-amber-300" />
            The Capital of Yoga · Rishikesh, India
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[88px] font-bold text-white leading-[1.05] tracking-tight drop-shadow-2xl mb-6">
            Your Transformation<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              Begins at Sunrise.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Discover 150+ verified ashrams, TTC programs &amp; wellness retreats
            exclusively in Rishikesh — the world's yoga capital.
          </p>

          {/* Search card */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl">
            {/* Tabs */}
            <div className="flex gap-1 mb-3">
              {["Retreats", "Teacher Training", "Ayurveda"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSearchType(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    searchType === t
                      ? "bg-white text-primary shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-white rounded-xl gap-3 group">
                <MapPin className="w-5 h-5 text-primary/40 group-focus-within:text-amber-500 transition-colors shrink-0" />
                <div className="w-full">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience</div>
                  <input
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    placeholder={`e.g. ${searchType === "Teacher Training" ? "200 Hour Hatha TTC" : "Yoga retreat for beginners"}`}
                    className="w-full bg-transparent outline-none text-sm text-primary placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center px-4 py-3 bg-white rounded-xl gap-3 group">
                <Calendar className="w-5 h-5 text-primary/40 group-focus-within:text-amber-500 transition-colors shrink-0" />
                <div className="w-full">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">When</div>
                  <input
                    type="month"
                    value={dates}
                    onChange={e => setDates(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-primary font-medium"
                  />
                </div>
              </div>
              <Link href={`/search${experience ? `?q=${encodeURIComponent(experience)}` : searchType === "Teacher Training" ? "?category=TTC" : searchType === "Ayurveda" ? "?category=Ayurveda" : ""}`}>
                <Button size="lg" className="w-full md:w-auto h-full px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-primary font-bold text-base shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] whitespace-nowrap">
                  <Search className="w-5 h-5 mr-2" /> Search Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["Beginner Friendly", "Free Cancellation", "Ganges View", "Yoga Alliance Certified", "All-inclusive"].map(tag => (
              <span key={tag} className="text-xs text-white/80 bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 text-xs animate-bounce">
          <ChevronDown className="w-5 h-5" />
          <span>Explore</span>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────── */}
      <section className="bg-primary py-5 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> 100% Verified Schools
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Shield className="w-4 h-4 text-amber-400" /> Secure Booking &amp; Payments
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 Average Rating
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Globe className="w-4 h-4 text-sky-400" /> Students from 80+ Countries
            </div>
            <div className="flex items-center gap-2 font-bold text-amber-300 italic">
              <TrendingUp className="w-4 h-4" /> #1 Platform for Rishikesh
            </div>
          </div>
        </div>
      </section>

      {/* ── ANIMATED STATS ────────────────────────────────────── */}
      <section className="py-16 bg-[#FFFBF4]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div ref={stat1.ref} className="space-y-2">
              <div className="text-5xl font-bold text-primary">{stat1.count.toLocaleString()}+</div>
              <div className="text-slate-500 font-medium">Students Certified</div>
              <div className="text-xs text-slate-400">From 80 countries worldwide</div>
            </div>
            <div ref={stat2.ref} className="space-y-2 border-x border-slate-200">
              <div className="text-5xl font-bold text-primary">{stat2.count}+</div>
              <div className="text-slate-500 font-medium">Verified Ashrams</div>
              <div className="text-xs text-slate-400">All personally vetted by our team</div>
            </div>
            <div ref={stat3.ref} className="space-y-2">
              <div className="text-5xl font-bold text-primary">{stat3.count}%</div>
              <div className="text-slate-500 font-medium">Satisfaction Rate</div>
              <div className="text-xs text-slate-400">Based on 12,000+ student reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BROWSE CATEGORIES ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-2">Explore by Type</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Find Your Practice</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.q}
                href={`/search?category=${cat.q}`}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${cat.color} border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="font-bold text-sm text-slate-700 group-hover:text-primary transition-colors text-center">{cat.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SCHOOLS ──────────────────────────────────── */}
      <section className="py-20 bg-[#FFFBF4]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-2">Hand-Picked</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Top Ashrams This Season</h2>
            </div>
            <Link href="/search" className="mt-4 md:mt-0">
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all">
                View All Schools <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SCHOOLS.map((school, idx) => (
              <Link key={idx} href={`/schools/${school.slug}`} className="group">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={school.img}
                      alt={school.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Tag */}
                    <span className={`absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${school.tagColor}`}>
                      {school.tag}
                    </span>
                    {/* Save button */}
                    <button
                      onClick={(e) => { e.preventDefault(); setSavedIdx(savedIdx === idx ? null : idx); }}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${savedIdx === idx ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                    </button>
                    {/* Duration badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {school.duration}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-primary text-lg leading-tight group-hover:text-amber-600 transition-colors line-clamp-2" title={school.name}>{school.name}</h3>
                        <p className="text-sm font-medium text-slate-600 mt-1">{school.school}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {school.location}, Rishikesh
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" /> {school.dates}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{school.style}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-sm text-slate-800">{school.rating}</span>
                        <span className="text-xs text-slate-400">({school.reviews})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">From</span>
                        <div className="font-bold text-primary">${school.price.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY USE YOGA IN RISHIKESH ──────────────────────────── */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-2">Our Promise</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Why book with YogaRishikesh?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Carefully Vetted Ashrams</h3>
                    <p className="text-slate-600 leading-relaxed">We personally visit and verify every single yoga school on our platform to ensure they meet our strict quality, hygiene, and authenticity standards.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Best Price Guarantee</h3>
                    <p className="text-slate-600 leading-relaxed">You will never pay more booking through us than booking directly. No hidden fees, no credit card surcharges.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Local Support & Guidance</h3>
                    <p className="text-slate-600 leading-relaxed">Our team is based right here in Rishikesh. From arranging airport transfers to emergency support, we are by your side.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=1200&auto=format&fit=crop" alt="Yoga by the Ganges" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex -space-x-2">
                    <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="User" width={32} height={32} className="rounded-full border-2 border-white" />
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="User" width={32} height={32} className="rounded-full border-2 border-white" />
                    <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="User" width={32} height={32} className="rounded-full border-2 border-white" />
                  </div>
                  <div className="text-sm font-bold text-primary">12k+ Bookings</div>
                </div>
                <p className="text-xs text-slate-500">Trusted by yogis worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=60" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-2">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-amber-400/20 group-hover:border-amber-400/40 transition-all">
                  <div className="text-amber-400">{s.icon}</div>
                </div>
                <div className="text-xs text-amber-400/60 font-bold mb-1">{s.step}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-2">Student Stories</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Lives Transformed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#FFFBF4] rounded-3xl p-7 border border-amber-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300">
                <Quote className="w-8 h-8 text-amber-300 mb-4" />
                <p className="text-slate-700 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-amber-200">
                    <Image src={t.img} alt={t.name} fill sizes="44px" className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-primary">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.country}</div>
                    <div className="text-xs text-amber-600 font-medium mt-0.5">{t.course}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-300/20 rounded-full blur-[80px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Are You A Yoga School?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
              List Your Ashram &amp; Reach<br />
              <span className="text-amber-500">12,000+ Students Worldwide</span>
            </h2>
            <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Join 150+ verified schools on the #1 platform for Rishikesh yoga bookings.
              Start for free — only pay when you get bookings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register/school">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                  Apply for Partnership <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="rounded-full border-primary text-primary hover:bg-primary/5 font-bold px-8">
                <PlayCircle className="w-5 h-5 mr-2" /> Watch How It Works
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> No Setup Fees</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> Only 10% Commission</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> Go Live in 48 Hours</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
