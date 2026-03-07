import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If logged in and trying to access auth pages or landing page
    if (
      token &&
      (pathname === "/" ||
        pathname.startsWith("/auth/signin") ||
        pathname.startsWith("/auth/login"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Protect dashboard routes
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/", // if not authenticated redirect here
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/login", "/"],
};
