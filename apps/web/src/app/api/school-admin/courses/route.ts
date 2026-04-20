import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const school = await prisma.school.findFirst({
      where: { ownerId: (session.user as any).id },
      select: { id: true }
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const courses = await prisma.course.findMany({
      where: { schoolId: school.id },
      include: {
        courseDates: {
          include: {
            _count: { select: { bookings: true } }
          },
          where: {
            startDate: { gte: new Date() }
          },
          orderBy: {
            startDate: 'asc'
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      name, 
      category, 
      style, 
      level, 
      durationDays, 
      priceINR, 
      priceUSD, 
      description,
      includedItems,
      highlights,
      excludes,
      roomTypes,
      isPublished
    } = body;

    const school = await prisma.school.findFirst({
      where: { ownerId: (session.user as any).id },
      select: { id: true, name: true }
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Basic slug generation
    let slug = slugify(name || "course");
    
    // Check for slug uniqueness
    const existingCourse = await prisma.course.findUnique({ where: { slug } });
    if (existingCourse) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const course = await prisma.course.create({
      data: {
        schoolId: school.id,
        name: name || "",
        slug,
        category: category || "TTC_200HR",
        style: style || "Hatha",
        level: level || "ALL_LEVELS",
        durationDays: durationDays ? parseInt(String(durationDays)) : 0,
        priceINR: priceINR ? parseFloat(String(priceINR)) : 0,
        priceUSD: priceUSD ? parseFloat(String(priceUSD)) : 0,
        description: description ?? "",
        includedItems: Array.isArray(includedItems) ? includedItems : [],
        highlights: Array.isArray(highlights) ? highlights : [],
        excludes: Array.isArray(excludes) ? excludes : [],
        roomTypes: roomTypes ?? [],
        isPublished: isPublished === true,
      }
    });

    return NextResponse.json(course);
  } catch (error: any) {
    console.error("Error creating course:", error);
    const message = error?.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
