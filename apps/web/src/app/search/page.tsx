import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Star } from "lucide-react";
import { getPublishedCourses } from "@/lib/queries/public-listings";

export const dynamic = "force-dynamic";

function formatDate(date?: Date) {
  if (!date) return "Flexible dates";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function prettyCategory(category: string) {
  if (category.startsWith("TTC_")) {
    return category.replace("TTC_", "").replace("HR", " Hour TTC");
  }
  return category.replaceAll("_", " ");
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string }>;
}) {
  const params = (await searchParams) || {};
  const courses = await getPublishedCourses({
    q: params.q,
    category: params.category,
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <section className="bg-gradient-to-br from-slate-950 via-[#133b33] to-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Realtime Search</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Explore live TTCs and yoga retreats in Rishikesh</h1>
          <p className="mt-4 max-w-3xl text-white/75">
            These cards are generated from the live database. School approval, course publication, next available dates,
            and room prices all flow into this page automatically.
          </p>
          <form method="GET" className="mt-8 grid gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur md:grid-cols-[2fr_1fr_auto]">
            <input
              type="text"
              name="q"
              defaultValue={params.q}
              placeholder="Search by school, style, or course"
              className="h-12 rounded-2xl border border-white/20 bg-white px-4 text-sm text-slate-900 outline-none"
            />
            <select
              name="category"
              defaultValue={params.category || ""}
              className="h-12 rounded-2xl border border-white/20 bg-white px-4 text-sm text-slate-900 outline-none"
            >
              <option value="">All categories</option>
              <option value="Teacher Training">Teacher Training</option>
              <option value="RETREAT">Retreats</option>
              <option value="TTC_100HR">100 Hour TTC</option>
              <option value="TTC_200HR">200 Hour TTC</option>
              <option value="TTC_300HR">300 Hour TTC</option>
              <option value="TTC_500HR">500 Hour TTC</option>
            </select>
            <button className="h-12 rounded-2xl bg-amber-400 px-6 font-semibold text-slate-900 transition hover:bg-amber-300">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 text-sm font-medium text-slate-500">
          Showing <span className="font-bold text-slate-900">{courses.length}</span> live results
        </div>

        <div className="space-y-6">
          {courses.map((course) => {
            const leadImage =
              course.school.coverPhoto ||
              course.school.gallery[0] ||
              "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop";
            const nextDate = course.courseDates[0];
            const minRoomAddon = (
              course.roomTypes as Array<{ type: string; priceAddon: number }>
            ).reduce((lowest, room) => Math.min(lowest, room.priceAddon), Infinity);
            const startingPrice = course.priceUSD + (Number.isFinite(minRoomAddon) ? minRoomAddon : 0);

            return (
              <div
                key={course.id}
                className="grid gap-5 overflow-hidden rounded-[28px] bg-white p-4 shadow-sm md:grid-cols-[320px_1fr]"
              >
                <div className="relative min-h-[260px] overflow-hidden rounded-[24px]">
                  <Image src={leadImage} alt={course.name} fill className="object-cover" />
                </div>

                <div className="flex flex-col justify-between gap-5 p-2">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                          {prettyCategory(course.category)}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                          {course.style}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {course.school.avgRating.toFixed(1)}
                      </div>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold text-slate-900">{course.name}</h2>
                    <div className="mt-2 text-lg font-medium text-slate-600">{course.school.name}</div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {course.school.address || "Rishikesh, India"}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(nextDate?.startDate)}
                      </span>
                      <span>{course.durationDays} days</span>
                    </div>
                    <p className="mt-4 line-clamp-3 max-w-3xl text-sm leading-relaxed text-slate-600">{course.description}</p>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {course.highlights.slice(0, 3).map((highlight) => (
                        <span key={highlight} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {highlight}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-[0.15em] text-slate-400">Starting from</div>
                        <div className="text-3xl font-bold text-slate-900">${Math.round(startingPrice)}</div>
                      </div>
                      <Link
                        href={`/schools/${course.school.slug}`}
                        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        View School
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
