import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass all static files from the middleware
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|ico|json)$/)) {
    return NextResponse.next();
  }

  const unProtectedRoutes = [
    "/",
    "/login",
    "/signup",
    "/faq",
    "/contactus",
    "/verifyemail",
    "/alumnidetails",
    "/emailverificationalert",
    "/api/auth/verifyemail",
    "/api/auth/login",
    "/api/auth/signup",
    "/api/contactus",
  ];

  if (unProtectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
