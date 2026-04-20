import { NextResponse } from "next/server";
import { prisma } from "@repo/database";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const contact = await prisma.contactMessage.create({
      data: { name, email, message },
    });
    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
