import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Super admin routes — only SUPER_ADMIN allowed
    if (path.startsWith("/admin")) {
      if (token?.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // School admin routes — only SCHOOL_ADMIN allowed
    if (path.startsWith("/school-admin")) {
      if (token?.role !== "SCHOOL_ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Dashboard — only STUDENT allowed
    if (path.startsWith("/dashboard")) {
      if (token?.role !== "STUDENT") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (path.startsWith("/booking")) {
      if (!token) {
        return NextResponse.redirect(new URL(`/login?callbackUrl=${path}`, req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // must be logged in
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/school-admin/:path*", "/dashboard/:path*", "/booking/:path*"],
};
