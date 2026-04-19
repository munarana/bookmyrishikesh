import Link from "next/link";
import Image from "next/image";
import { prisma, SchoolStatus } from "@repo/database";
import { MapPin, Star, Users, BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yoga Schools in Rishikesh | YogaRishikesh",
  description:
    "Browse the best yoga teacher training schools, retreats, and ashrams in Rishikesh. Find your perfect yoga journey.",
};

async function getSchools(search?: string) {
  try {
    return await prisma.school.findMany({
      where: {
        status: SchoolStatus.APPROVED,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        courses: {
          select: { priceUSD: true, category: true, durationDays: true, name: true },
          take: 5,
        },
        _count: { select: { courses: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Error fetching schools:", e);
    return [];
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  TTC: "bg-purple-100 text-purple-800",
  Retreat: "bg-emerald-100 text-emerald-800",
  "Drop-in": "bg-blue-100 text-blue-800",
  Workshop: "bg-amber-100 text-amber-800",
};

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const search = searchParams?.search;
  const schools = await getSchools(search);

  const minPrice = (school: (typeof schools)[0]) => {
    if (!school.courses.length) return null;
    return Math.min(...school.courses.map((c) => c.priceUSD));
  };

  const categories = Array.from(
    new Set(schools.flatMap((s) => s.courses.map((c) => c.category)))
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Yoga Schools in Rishikesh
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Discover{" "}
            <span className="text-accent font-bold">{schools.length}+ verified schools</span>{" "}
            offering authentic teacher training, retreats & ashram stays.
          </p>

          {/* Search bar */}
          <form method="GET" action="/schools" className="max-w-xl mx-auto">
            <div className="relative flex">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search schools, styles, locations..."
                className="w-full pl-12 pr-4 py-4 rounded-l-2xl border-0 shadow-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-amber-400 text-slate-900 font-bold px-6 rounded-r-2xl transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          <span className="text-sm font-bold text-slate-600 mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-4 h-4" /> Filter:
          </span>
          <Link href="/schools">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition-colors ${
                !searchParams?.category
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
              }`}
            >
              All
            </span>
          </Link>
          {categories.map((cat) => (
            <Link key={cat} href={`/schools?category=${cat}`}>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition-colors ${
                  searchParams?.category === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </span>
            </Link>
          ))}
        </div>

        {/* Results count */}
        <p className="text-slate-500 text-sm mb-6">
          Showing{" "}
          <span className="font-bold text-slate-900">{schools.length}</span>{" "}
          schools
          {search && (
            <>
              {" "}
              for <span className="font-bold text-primary">"{search}"</span>
            </>
          )}
        </p>

        {/* Schools Grid */}
        {schools.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🧘</div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No schools found</h2>
            <p className="text-slate-500 mb-6">Try a different search or browse all schools.</p>
            <Link href="/schools">
              <Button variant="outline">Clear search</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school) => {
              const price = minPrice(school);
              const courseCategories = [...new Set(school.courses.map((c) => c.category))];

              return (
                <Link
                  key={school.id}
                  href={`/schools/${school.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-transparent hover:-translate-y-1">
                    {/* Cover image */}
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {school.coverPhoto ? (
                        <Image
                          src={school.coverPhoto}
                          alt={school.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-5xl">🏛️</span>
                        </div>
                      )}
                      {/* Category badges */}
                      <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                        {courseCategories.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              CATEGORY_COLORS[cat] || "bg-white text-slate-700"
                            }`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-1">
                        <h2 className="font-heading font-bold text-slate-900 text-lg leading-tight group-hover:text-primary transition-colors">
                          {school.name}
                        </h2>
                      </div>

                      {school.address && (
                        <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{school.address}</span>
                        </div>
                      )}

                      <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {school.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {school._count.courses} course{school._count.courses !== 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            5.0
                          </span>
                        </div>
                        {price !== null && (
                          <div className="text-right">
                            <span className="text-xs text-slate-400">from</span>
                            <span className="block font-bold text-primary text-base">
                              ${price.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
