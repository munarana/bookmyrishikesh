import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Registration request body:", { ...body, password: "[REDACTED]" });
    const { email, password, role, schoolName, ownerName, address, website } = body;

    if (!email || !password || typeof password !== "string") {
      console.error("Invalid registration data:", { email, hasPassword: !!password, passwordType: typeof password });
      return NextResponse.json(
        { message: "Email and password (as string) are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Generated hash for", email, ":", hashedPassword);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: ownerName || email.split("@")[0],
        role: role || "STUDENT",
      },
    });

    // If school admin, create school entry
    if (role === "SCHOOL_ADMIN") {
      const slug = schoolName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      
      await prisma.school.create({
        data: {
          name: schoolName,
          slug: `${slug}-${Math.random().toString(36).substring(2, 7)}`,
          ownerId: user.id,
          address: address,
          description: `Yoga school ${schoolName} in Rishikesh.`,
          status: "PENDING", // Wait for Super Admin approval
        },
      });
    }

    return NextResponse.json(
      { message: "Registration successful", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
