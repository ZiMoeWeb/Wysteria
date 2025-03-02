import { getServerSession } from "next-auth/next"
import { authOptions } from "../[...nextauth]/route"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    return NextResponse.json({
      authenticated: !!session,
      session,
    })
  } catch (error) {
    console.error("Auth test error:", error)
    return NextResponse.json(
      {
        error: "Failed to check authentication",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

