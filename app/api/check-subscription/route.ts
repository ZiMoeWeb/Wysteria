import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ status: "unauthenticated" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json({ status: "user_not_found" }, { status: 404 })
    }

    return NextResponse.json({
      status: user.subscription?.status || "free",
    })
  } catch (error) {
    console.error("Error checking subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

