import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";

export async function PUT(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SCHOOL_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const school = await prisma.school.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const existingCourse = await prisma.course.findFirst({
      where: { id: params.courseId, schoolId: school.id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const updatedCourse = await prisma.course.update({
      where: { id: params.courseId },
      data: {
        name: body.name ?? existingCourse.name,
        category: body.category ?? existingCourse.category,
        style: body.style ?? existingCourse.style,
        level: body.level ?? existingCourse.level,
        durationDays: body.durationDays !== undefined ? Number(body.durationDays) : existingCourse.durationDays,
        priceINR: body.priceINR !== undefined ? Number(body.priceINR) : existingCourse.priceINR,
        priceUSD: body.priceUSD !== undefined ? Number(body.priceUSD) : existingCourse.priceUSD,
        description: body.description ?? existingCourse.description,
        includedItems: body.includedItems ?? existingCourse.includedItems,
        highlights: body.highlights ?? existingCourse.highlights,
        excludes: body.excludes ?? existingCourse.excludes,
        roomTypes: body.roomTypes ?? existingCourse.roomTypes,
        isPublished: body.isPublished ?? existingCourse.isPublished,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SCHOOL_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const school = await prisma.school.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const course = await prisma.course.findFirst({
      where: { id: params.courseId, schoolId: school.id },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 403 });
    }

    const activeBookings = await prisma.booking.count({
      where: {
        courseId: params.courseId,
        status: {
          in: ["PENDING", "DEPOSIT_PAID", "CONFIRMED", "COMPLETED"],
        },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: "This course has active bookings and cannot be deleted. Unpublish it instead." },
        { status: 400 }
      );
    }

    await prisma.course.update({
      where: { id: params.courseId },
      data: { isPublished: false, deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Course unpublished successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
