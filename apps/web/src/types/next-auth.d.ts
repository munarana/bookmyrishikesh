import type { DefaultSession } from "next-auth";
import "next-auth";
import type { Role } from "@repo/database";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    schoolId?: string;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      schoolId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    schoolId?: string;
  }
}
