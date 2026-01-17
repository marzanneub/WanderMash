import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SECRET);

export async function middleware(request: NextRequest) {
  const email = request.cookies.get("email")?.value;
  const path = request.nextUrl.pathname;

  if ((path.startsWith("/password-recovery") || path.startsWith("/verification")) && !email) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  else if(path.startsWith("/password-recovery") || path.startsWith("/verification"))
  {
    return NextResponse.next();
  }

  const user = request.cookies.get("user")?.value;
  if (user && (path.startsWith("/login") || path.startsWith("/registration"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!user) {
    if (path.startsWith("/login") || path.startsWith("/registration")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(user, secret);
    const role = payload.role as string;

    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (path.startsWith("/generalUser") && role !== "generalUser") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (path.startsWith("/hotel") && role !== "hotel") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (path.startsWith("/restaurant") && role !== "restaurant") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    
    if (path.startsWith("/tourismManager") && role !== "tourismManager") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/login", "/registration", "/password-recovery", "/verification", "/admin/:path*", "/generalUser/:path*", "/hotel/:path*", "/restaurant/:path*", "/tourismManager/:path*"],
};