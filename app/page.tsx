"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WysteriaLogo } from "@/components/wysteria-logo"
import { Github } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <WysteriaLogo />
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Wysteria.ai</h1>
          <p className="text-base leading-relaxed text-muted-foreground">Sign in to start generating iOS apps</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold tracking-tight">Sign In</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => signIn("github", { callbackUrl: "/generator" })}
            >
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}