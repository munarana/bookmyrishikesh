import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SchoolAdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SCHOOL_ADMIN") {
    redirect("/login");
  }

  const school = await prisma.school.findFirst({
    where: { ownerId: session.user.id },
    select: {
      name: true,
      status: true,
      phone: true,
      address: true,
      virtualTourUrl: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">School Settings</h1>
        <p className="text-slate-500 mt-2">
          Review the key details your team will manage here as the full settings flow expands.
        </p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Current Profile Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-700">
          <div>
            <span className="font-semibold text-slate-900">School name:</span>{" "}
            {school?.name ?? "No school profile found"}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Approval status:</span>{" "}
            {school?.status ?? "Unknown"}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Phone:</span>{" "}
            {school?.phone ?? "Not added yet"}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Address:</span>{" "}
            {school?.address ?? "Not added yet"}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Virtual tour:</span>{" "}
            {school?.virtualTourUrl ?? "Not added yet"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
