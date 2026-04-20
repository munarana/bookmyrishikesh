import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma, Role } from "@repo/database";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role");
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "10", 10);

    const where = role && role !== "ALL" ? { role: role as Role } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          image: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
