import { prisma, Role, SchoolStatus } from "@repo/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as SchoolStatus | null;
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    const schools = await prisma.school.findMany({
      where: {
        ...(status ? { status } : { status: SchoolStatus.APPROVED }),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        courses: {
          select: {
            id: true,
            name: true,
            category: true,
            priceUSD: true,
            durationDays: true,
          },
          take: 3,
        },
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, data: schools, count: schools.length });
  } catch (error) {
    console.error("Schools API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}
