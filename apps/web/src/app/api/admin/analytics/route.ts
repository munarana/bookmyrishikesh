import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { getMonthlyRevenue, getPlatformKPIs, getRecentActivity, getTopSchools } from "@/lib/queries/admin-analytics";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return apiError("Unauthorized", 401);
  }

  try {
    const [kpis, monthlyRevenue, activities, topSchools] = await Promise.all([
      getPlatformKPIs(),
      getMonthlyRevenue(),
      getRecentActivity(),
      getTopSchools(),
    ]);

    return apiSuccess({ kpis, monthlyRevenue, activities, topSchools });
  } catch (error) {
    console.error("Analytics error:", error);
    return apiError("Failed to fetch analytics", 500);
  }
}
