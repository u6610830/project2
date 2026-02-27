import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - No Token" },
      { status: 401 }
    );
  }

  try {
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized - Invalid Token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/profile/:path*"],
};