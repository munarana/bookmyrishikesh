import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Globe, MapPin, MessageSquare, Star } from "lucide-react";
import { getHomepageData } from "@/lib/queries/public-listings";

export const dynamic = "force-dynamic";

function formatDate(date?: Date) {
  if (!date) return "Flexible dates available";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function HomePage() {
  const { featuredCourses, featuredSchools, stats } = await getHomepageData();

  return (
    <div className="min-h-screen bg-[#f7f3ea]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2200&auto=format&fit=crop"
            alt="Yoga in Rishikesh"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-emerald-950/60 to-amber-900/50" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-24 text-white">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
              <Globe className="h-3.5 w-3.5 text-amber-300" />
              Live Rishikesh Yoga Marketplace
            </p>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
              Book approved yoga schools, TTCs, and retreats from one live platform.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
              Compare live course dates, room types, and direct enquiries from verified schools in Rishikesh.
              Every public card below is coming from the same realtime database your admins manage.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-amber-400 text-slate-900 hover:bg-amber-300">
                <Link href="/search">Explore Live Courses</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10">
                <Link href="/register/school">Register Your School</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-10 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-4xl font-bold text-slate-900">{stats.approvedSchoolCount}</div>
          <div className="mt-2 text-sm font-medium text-slate-500">Approved schools live now</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-4xl font-bold text-slate-900">{stats.publishedCourseCount}</div>
          <div className="mt-2 text-sm font-medium text-slate-500">Published courses and retreats</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-4xl font-bold text-slate-900">{stats.inquiryCount}</div>
          <div className="mt-2 text-sm font-medium text-slate-500">Live student enquiries in the system</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Featured Courses</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900">Teacher trainings and retreats live right now</h2>
          </div>
          <Link href="/search" className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline">
            View all courses
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {featuredCourses.map((course) => {
            const nextDate = course.courseDates[0];
            const heroImage = course.school.coverPhoto || course.school.gallery[0] || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop";

            return (
              <Link
                key={course.id}
                href={`/schools/${course.school.slug}`}
                className="group overflow-hidden rounded-[28px] bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-64">
                  <Image src={heroImage} alt={course.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900">
                    {course.category.replaceAll("_", " ")}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/70">{course.school.name}</div>
                    <h3 className="mt-2 text-2xl font-bold leading-tight">{course.name}</h3>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {course.school.address || "Rishikesh, India"}
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{course.description}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(nextDate?.startDate)}
                      </div>
                      <div className="text-xs uppercase tracking-[0.15em] text-slate-400">{course.durationDays} days</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">From</div>
                      <div className="text-2xl font-bold text-slate-900">${Math.round(course.priceUSD)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Approved Schools</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900">Profiles that super admin has already approved</h2>
          </div>
          <Link href="/schools" className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline">
            Browse all schools
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {featuredSchools.map((school) => (
            <Link
              key={school.id}
              href={`/schools/${school.slug}`}
              className="overflow-hidden rounded-[28px] bg-[#133b33] text-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56">
                <Image
                  src={school.coverPhoto || school.gallery[0] || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop"}
                  alt={school.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#133b33] to-transparent" />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{school.name}</h3>
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                    {school.avgRating.toFixed(1)}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/80">{school.tagline || school.description}</p>
                <div className="flex flex-wrap gap-2">
                  {school.styles.slice(0, 3).map((style) => (
                    <span key={style} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
                      {style}
                    </span>
                  ))}
                </div>
                <div className="space-y-2 border-t border-white/10 pt-4 text-sm text-white/75">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    {school.courses.length} highlighted programs
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-amber-300" />
                    Direct enquiries enabled
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
