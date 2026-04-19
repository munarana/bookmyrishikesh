import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";
import { slugify } from "@/lib/utils";

export async function PUT(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = params.courseId;

  try {
    const school = await prisma.school.findFirst({
      where: { ownerId: (session.user as any).id },
      select: { id: true }
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Verify course belongs to this school
    const existingCourse = await prisma.course.findFirst({
      where: { id: courseId, schoolId: school.id }
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 403 });
    }

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

    let slug = existingCourse.slug;
    // Only update slug if name changed significantly (optional, but requested by prompt is usually title -> slug)
    // For safety, let's keep the old slug unless we explicitly want to change it.
    
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        name: name !== undefined ? name : existingCourse.name,
        category: category !== undefined ? category : existingCourse.category,
        style: style !== undefined ? style : existingCourse.style,
        level: level !== undefined ? level : existingCourse.level,
        durationDays: durationDays !== undefined ? (durationDays ? parseInt(durationDays) : 0) : existingCourse.durationDays,
        priceINR: priceINR !== undefined ? (priceINR ? parseFloat(priceINR) : 0) : existingCourse.priceINR,
        priceUSD: priceUSD !== undefined ? (priceUSD ? parseFloat(priceUSD) : 0) : existingCourse.priceUSD,
        description: description !== undefined ? description : existingCourse.description,
        includedItems: includedItems !== undefined ? includedItems : existingCourse.includedItems,
        highlights: highlights !== undefined ? highlights : existingCourse.highlights,
        excludes: excludes !== undefined ? excludes : existingCourse.excludes,
        roomTypes: roomTypes !== undefined ? roomTypes : existingCourse.roomTypes,
        isPublished: isPublished !== undefined ? isPublished : existingCourse.isPublished,
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("Error updating course:", error);
    const message = error?.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = params.courseId;

  try {
    const school = await prisma.school.findFirst({
      where: { ownerId: (session.user as any).id },
      select: { id: true }
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, schoolId: school.id },
      include: {
        courseDates: {
          include: {
            bookings: {
              where: {
                status: {
                  in: ["CONFIRMED", "DEPOSIT_PAID", "FULL_PAID"]
                }
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 403 });
    }

    // Check for active bookings
    const hasActiveBookings = course.courseDates.some(date => date.bookings.length > 0);

    if (hasActiveBookings) {
      return NextResponse.json(
        { error: "This course has active bookings and cannot be deleted. Unpublish it instead." }, 
        { status: 400 }
      );
    }

    // Soft delete: set isPublished to false (as requested by prompt for "soft approach")
    // If the user wants a hard delete later, we can change this to prisma.course.delete
    await prisma.course.update({
      where: { id: courseId },
      data: { isPublished: false }
    });

    return NextResponse.json({ success: true, message: "Course unpublished successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
