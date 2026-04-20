import bcrypt from "bcryptjs";
import { Role } from "@repo/database";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess, validateBody } from "@/lib/api-helpers";
import { registerSchema } from "@/lib/schemas/auth.schema";
import { generateSlug } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = validateBody(registerSchema, body);

    if (parsed.error || !parsed.data) {
      return apiError("Invalid registration details", 400);
    }

    const {
      name,
      email,
      password,
      role,
      schoolName,
      phone,
      nationality,
      address,
      website,
      tagline,
      businessRegistrationNo,
      yogaCertificateUrl,
      personalIdUrl,
    } = parsed.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return apiError("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userRole = role === "SCHOOL_ADMIN" ? Role.SCHOOL_ADMIN : Role.STUDENT;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        phone,
        nationality,
        isActive: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (userRole === Role.SCHOOL_ADMIN) {
      await prisma.school.create({
        data: {
          ownerId: user.id,
          name: schoolName || `${name}'s School`,
          slug: generateSlug(schoolName || `${name}-school`),
          tagline: tagline || "Application under review by the YogaRishikesh admin team.",
          description: `${schoolName || name}'s yoga school profile is under review. The team will verify documents, location details, and program quality before publishing.`,
          status: "PENDING",
          email,
          phone,
          address,
          website,
          businessRegistrationNo,
          yogaCertificateUrl,
          personalIdUrl,
          isPublished: false,
          applicationNotes: "Submitted through school registration form and awaiting super admin review.",
        },
      });
    }

    return apiSuccess(user, 201);
  } catch (error) {
    console.error("Registration error:", error);
    return apiError("Failed to register account", 500);
  }
}
