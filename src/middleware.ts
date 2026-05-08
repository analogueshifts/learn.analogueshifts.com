import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect specific routes based on user role
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect Trainer routes
    if (path.startsWith("/trainer") && token?.role !== "Trainer" && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protect Admin routes
    if (path.startsWith("/admin") && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if the user is authorized (has a token).
      // The middleware function above will handle role-specific logic.
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/trainer/:path*", "/admin/:path*"],
};
