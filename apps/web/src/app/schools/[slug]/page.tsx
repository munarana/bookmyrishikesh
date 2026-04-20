import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InquiryForm } from "@/components/InquiryForm";
import { getSchoolProfile } from "@/lib/queries/public-listings";
import { Calendar, CheckCircle, Globe, Mail, MapPin, MessageSquare, Phone, Star } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(date?: Date) {
  if (!date) return "Flexible dates available";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SchoolProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = await getSchoolProfile(slug);

  if (!school) {
    notFound();
  }

  const gallery = [school.coverPhoto, ...school.gallery].filter(Boolean) as string[];
  const enquiryCourses = school.courses.map((course) => ({
    id: course.id,
    name: course.name,
    firstDate: course.courseDates[0]?.startDate
      ? new Date(course.courseDates[0].startDate).toISOString().slice(0, 10)
      : undefined,
  }));

  return (
    <div className="min-h-screen bg-[#faf7f0] pt-20">
      <div className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Approved School</Badge>
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {school.avgRating.toFixed(1)} ({school.totalReviews} reviews)
                </div>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">{school.name}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{school.tagline || school.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {school.address || "Rishikesh, India"}
                </span>
                {school.website ? (
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={school.website} target="_blank" rel="noreferrer" className="hover:underline">
                      Visit website
                    </a>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-2">
              {gallery.slice(0, 5).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`relative min-h-[220px] overflow-hidden rounded-[24px] ${
                    index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <Image src={image} alt={`${school.name} gallery ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            <section className="rounded-[32px] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">About this school</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{school.description}</p>

              <div className="mt-8 grid gap-8 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Styles</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.styles.map((style) => (
                      <span key={style} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Amenities</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.amenities.map((amenity) => (
                      <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Certifications</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.certifications.map((item) => (
                      <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] bg-white p-8 shadow-sm">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Live courses and retreats</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Published by the school admin and visible here only after approval.
                  </p>
                </div>
                <div className="text-sm text-slate-500">{school.courses.length} programs</div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {school.courses.map((course) => (
                  <div key={course.id} className="rounded-[24px] border border-slate-200 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          {course.category.replaceAll("_", " ")}
                        </div>
                        <h3 className="mt-2 text-xl font-bold text-slate-900">{course.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">From</div>
                        <div className="text-2xl font-bold text-slate-900">${Math.round(course.priceUSD)}</div>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{course.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.highlights.slice(0, 3).map((highlight) => (
                        <span key={highlight} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Next start: {formatDate(course.courseDates[0]?.startDate)}
                      </div>
                      <div>{course.durationDays} days</div>
                      <div>{course.style}</div>
                    </div>

                    <div className="mt-5">
                      <Link href={`/booking/${course.id}`}>
                        <Button className="w-full">Book / View Dates</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[32px] bg-[#133b33] p-7 text-white shadow-sm">
              <h2 className="text-2xl font-bold">School contact</h2>
              <div className="mt-5 space-y-3 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-300" />
                  {school.email || school.owner?.email}
                </div>
                {school.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-300" />
                    {school.phone}
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-300" />
                  {school._count.inquiries} enquiries logged so far
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-white/10 p-5">
                <h3 className="text-lg font-semibold">Why students trust this listing</h3>
                <div className="mt-4 space-y-3 text-sm text-white/80">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-300" />
                    Super admin approved the school profile and owner documents.
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-300" />
                    Published courses, pricing, and upcoming dates are database-driven.
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-300" />
                    Student enquiries land directly in the school-admin inbox.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Send a live enquiry</h2>
              <p className="mt-2 text-sm text-slate-500">
                This form writes straight into the realtime database and appears in the school-admin enquiries page.
              </p>
              <div className="mt-6">
                <InquiryForm schoolId={school.id} courseOptions={enquiryCourses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
