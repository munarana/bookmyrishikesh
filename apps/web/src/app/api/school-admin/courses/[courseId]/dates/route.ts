import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";

export async function GET(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const course = await prisma.course.findFirst({
      where: {
        id: params.courseId,
        school: { ownerId: (session.user as any).id }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 403 });
    }

    const dates = await prisma.courseDate.findMany({
      where: { courseId: params.courseId },
      include: {
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json(dates);
  } catch (error) {
    console.error("Error fetching course dates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { startDate, endDate, capacity, priceModifier } = body;

    if (!startDate || !endDate || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    const course = await prisma.course.findFirst({
      where: {
        id: params.courseId,
        school: { ownerId: (session.user as any).id }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 403 });
    }

    const courseDate = await prisma.courseDate.create({
      data: {
        courseId: params.courseId,
        startDate: start,
        endDate: end,
        capacity: parseInt(capacity),
        priceModifier: priceModifier ? parseFloat(priceModifier) : 1.0,
        isActive: true,
      }
    });

    return NextResponse.json(courseDate);
  } catch (error) {
    console.error("Error creating course date:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
