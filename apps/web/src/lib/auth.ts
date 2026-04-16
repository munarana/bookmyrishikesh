import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// We don't import Prisma directly if not needed, or we import from @repo/database
// Setting up a basic skeleton for NextAuth to avoid initial build errors.

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // In a real scenario, compare with Prisma DB User
        // Since we are mocking the initial setup, return mock user
        if (credentials.email === "admin@rishikeshyoga.com" && credentials.password === "admin") {
          return { id: "1", name: "Admin", email: "admin@rishikeshyoga.com", role: "SUPER_ADMIN" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
