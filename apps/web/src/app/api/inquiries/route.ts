import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    const schoolId = String(body.schoolId || "");
    const courseId = body.courseId ? String(body.courseId) : null;
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!schoolId || !name || !email || !message) {
      return NextResponse.json({ error: "Missing required enquiry fields." }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        schoolId,
        courseId,
        userId: session?.user?.id,
        name,
        email,
        phone: body.phone ? String(body.phone) : null,
        country: body.country ? String(body.country) : null,
        message,
        guests: body.guests ? Number(body.guests) : 1,
        desiredDate: body.desiredDate ? new Date(String(body.desiredDate)) : null,
      },
    });

    return NextResponse.json({ success: true, inquiryId: inquiry.id }, { status: 201 });
  } catch (error) {
    console.error("Inquiry creation error:", error);
    return NextResponse.json({ error: "Failed to send enquiry." }, { status: 500 });
  }
}
