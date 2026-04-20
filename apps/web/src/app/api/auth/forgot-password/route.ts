import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    const genericResponse = NextResponse.json({
      message: "If an account exists for that email, a reset link has been sent",
    });
    if (!user) {
      return genericResponse;
    }
    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });
    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@yogarishikesh.com',
      to: email,
      subject: "Reset your YogaRishikesh password",
      html: `<p>Click the link below to reset your password. This link is valid for 30 minutes.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    });
    return genericResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
