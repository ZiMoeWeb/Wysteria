import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to count users as a simple test
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: "Database connection successful! 🎉",
      userCount,
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

