import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";

export async function PUT(req: Request, props: { params: Promise<{ courseId: string; dateId: string }> }) {
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

    const body = await req.json();
    const { capacity, priceModifier, isActive } = body;

    const dateToUpdate = await prisma.courseDate.findUnique({
      where: { id: params.dateId, courseId: params.courseId },
      include: {
        _count: { select: { bookings: true } }
      }
    });

    if (!dateToUpdate) {
      return NextResponse.json({ error: "Date not found" }, { status: 404 });
    }

    if (capacity !== undefined && parseInt(capacity) < dateToUpdate._count.bookings) {
       return NextResponse.json({ error: `Capacity cannot be less than current bookings (${dateToUpdate._count.bookings})` }, { status: 400 });
    }

    const updatedDate = await prisma.courseDate.update({
      where: { id: params.dateId },
      data: {
        capacity: capacity !== undefined ? parseInt(capacity) : dateToUpdate.capacity,
        priceModifier: priceModifier !== undefined ? parseFloat(priceModifier) : dateToUpdate.priceModifier,
        isActive: isActive !== undefined ? isActive : dateToUpdate.isActive,
      }
    });

    return NextResponse.json(updatedDate);
  } catch (error) {
    console.error("Error updating course date:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ courseId: string; dateId: string }> }) {
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

    const dateToDelete = await prisma.courseDate.findUnique({
      where: { id: params.dateId, courseId: params.courseId },
      include: {
        _count: { select: { bookings: true } }
      }
    });

    if (!dateToDelete) {
      return NextResponse.json({ error: "Date not found" }, { status: 404 });
    }

    if (dateToDelete._count.bookings > 0) {
      return NextResponse.json({ error: "Cannot delete date with active bookings" }, { status: 400 });
    }

    await prisma.courseDate.delete({
      where: { id: params.dateId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course date:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
