import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const [users, subscriptions, generations] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count(),
      prisma.generation.count(),
    ])

    return NextResponse.json({
      users,
      subscriptions,
      generations,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Failed to fetch database stats" }, { status: 500 })
  }
}

