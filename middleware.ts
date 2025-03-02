import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Protect /generator route
  if (request.nextUrl.pathname === "/generator") {
    if (!token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", "/generator")
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/generator"],
}

