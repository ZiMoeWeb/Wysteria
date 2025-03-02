"use client"

import { CardFooter } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const tiers = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for trying out Wysteria.ai",
    features: ["1 app generation", "Preview generated code", "Basic iOS templates", "Community support"],
    priceId: "free",
  },
  {
    name: "Basic",
    price: 17,
    description: "Perfect for indie developers and small projects",
    features: [
      "Up to 50 code generations per month",
      "Download generated code",
      "Basic iOS app templates",
      "SwiftUI components",
      "Email support",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
  },
  {
    name: "Pro",
    price: 30,
    description: "Ideal for professional developers and growing teams",
    features: [
      "Up to 200 code generations per month",
      "Advanced iOS app templates",
      "Custom SwiftUI components",
      "Priority email support",
      "Code optimization suggestions",
      "UI/UX best practices",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    popular: true,
  },
  {
    name: "Expert",
    price: 60,
    description: "For enterprises and large-scale applications",
    features: [
      "Unlimited code generations",
      "Enterprise iOS app templates",
      "Custom architecture patterns",
      "24/7 priority support",
      "Advanced code optimization",
      "Custom UI/UX consulting",
      "CI/CD integration guides",
      "Team collaboration features",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_EXPERT_PRICE_ID,
  },
]

export function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubscribe = async (priceId: string | undefined, tierName: string) => {
    if (priceId === "free") {
      router.push("/generator")
      return
    }

    if (!priceId) {
      toast({
        title: "Configuration Error",
        description: "Price ID is not configured. Please contact support.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(tierName)

      // Create checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      if (!data.sessionId) {
        throw new Error("No checkout session ID received")
      }

      // Initialize Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) {
        throw new Error("Failed to load Stripe")
      }

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process subscription",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={`flex flex-col justify-between border-purple-500/20 ${
            tier.popular ? "relative border-purple-500 shadow-purple-500/50 shadow-lg" : ""
          }`}
        >
          {tier.popular && (
            <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 px-3 py-2 text-center text-sm font-medium text-white">
              Most Popular
            </div>
          )}

          <div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">{tier.name}</CardTitle>
              <CardDescription className="min-h-[50px] text-base leading-relaxed">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">${tier.price}</span>
                <span className="text-base text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2.5 text-sm leading-relaxed">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>
          <CardFooter>
            <Button
              size="lg"
              className={`w-full ${
                tier.popular
                  ? "bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500"
                  : "bg-purple-500/20 hover:bg-purple-500/30"
              }`}
              onClick={() => handleSubscribe(tier.priceId, tier.name)}
              disabled={loading === tier.name}
            >
              {loading === tier.name ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Subscribe to ${tier.name}`
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
