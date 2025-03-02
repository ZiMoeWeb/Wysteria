"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WysteriaLogo } from "@/components/wysteria-logo"
import { Github, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/generator'
  const [isLoading, setIsLoading] = useState(false)

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.'
      case 'AccessDenied':
        return 'You do not have permission to sign in.'
      case 'OAuthSignin':
        return 'Could not sign in with GitHub. Please try again.'
      case 'Callback':
        return 'There was a problem with the authentication callback. Please try again.'
      case 'OAuthCallback':
        return 'There was a problem with the GitHub callback. Please try again.'
      case 'OAuthCreateAccount':
        return 'Could not create a GitHub account. Please try again.'
      case 'EmailSignin':
        return 'The email sign in link is invalid or has expired.'
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.'
      case 'CodeDeployment':
        return 'The authentication service is temporarily unavailable. Please try again.'
      default:
        return 'An error occurred during sign in. Please try again.'
    }
  }

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      const result = await signIn("github", {
        callbackUrl,
        redirect: true,
      })
      
      if (result?.error) {
        console.error("Sign in error:", result.error)
      }
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <WysteriaLogo />
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Wysteria.ai</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Sign in to start generating iOS apps
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {getErrorMessage(error)}
            </AlertDescription>
          </Alert>
        )}

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
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Sign in with GitHub
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}