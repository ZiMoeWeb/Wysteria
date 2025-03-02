import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Here you would typically:
      // 1. Store the subscription status in your database
      // 2. Create a session token or cookie
      // 3. Return any necessary user/subscription data

      return NextResponse.json({
        success: true,
        customerId: session.customer,
        subscriptionId: session.subscription,
      })
    }

    return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
  } catch (error) {
    console.error("Error verifying subscription:", error)
    return NextResponse.json({ error: "Error verifying subscription" }, { status: 500 })
  }
}

