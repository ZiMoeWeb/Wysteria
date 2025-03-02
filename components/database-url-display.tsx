"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DatabaseUrlDisplay() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const constructUrl = () => {
    const user = process.env.POSTGRES_USER
    const password = process.env.POSTGRES_PASSWORD
    const host = process.env.POSTGRES_HOST
    const database = process.env.POSTGRES_DATABASE

    return `postgresql://${user}:${password}@${host}:5432/${database}`
  }

  const handleCopy = () => {
    const url = constructUrl()
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Database URL copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Database URL Constructor</CardTitle>
        <CardDescription>Your constructed PostgreSQL connection URL based on environment variables</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input readOnly value={constructUrl()} type="password" className="font-mono" />
          <Button onClick={handleCopy} variant="outline" className="flex-shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          This URL is constructed using your POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, and POSTGRES_DATABASE
          environment variables.
        </p>
      </CardContent>
    </Card>
  )
}

