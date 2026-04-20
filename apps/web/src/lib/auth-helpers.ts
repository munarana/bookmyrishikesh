import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Role } from "@repo/database";
import { authOptions } from "@/lib/auth";

export async function getOptionalSession() {
  return getServerSession(authOptions);
}

export async function requireRole(role: Role) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== role) {
    redirect("/unauthorized");
  }

  return session;
}

export async function requireAnyRole(...roles: Role[]) {
  const session = await getServerSession(authOptions);

  if (!session || !roles.includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return session;
}
