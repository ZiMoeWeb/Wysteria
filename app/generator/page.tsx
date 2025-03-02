"use client"

import { useState, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Send, Sparkles } from "lucide-react"
import dynamic from "next/dynamic"
import CodeDisplayFallback from "@/components/code-display-fallback"
import ErrorBoundary from "@/components/error-boundary"
import { WysteriaLogo } from "@/components/wysteria-logo"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

const CodeDisplay = dynamic(() => import("@/components/code-display"), {
  ssr: false,
  loading: ({ code, language }) => <CodeDisplayFallback code={code} language={language} />,
})

export default function GeneratorPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)

    // Verify subscription on component mount
    const verifySubscription = async () => {
      const sessionId = new URLSearchParams(window.location.search).get("session_id")

      if (!sessionId) {
        toast({
          title: "Access Denied",
          description: "Please subscribe to access the generator.",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      try {
        const response = await fetch("/api/stripe/verify-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          throw new Error("Subscription verification failed")
        }
      } catch (error) {
        toast({
          title: "Access Denied",
          description: "Unable to verify subscription. Please try again.",
          variant: "destructive",
        })
        router.push("/")
      }
    }

    verifySubscription()
  }, [router, toast])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Welcome to Wysteria.ai! I'm your iOS development expert. Describe the app you want to build, and I'll generate professional Swift code for you. Be specific about features, UI, and functionality.",
      },
    ],
  })

  // Extract code blocks from messages
  const extractedCode = messages
    .filter((message) => message.role === "assistant")
    .flatMap((message) => {
      const codeBlocks: { language: string; code: string; filename?: string }[] = []
      const regex = /```(swift|objective-c)(?:\s+(\S+\.swift|\S+\.m|\S+\.h))?\n([\s\S]*?)```/g

      let match
      while ((match = regex.exec(message.content)) !== null) {
        codeBlocks.push({
          language: match[1],
          filename: match[2] || `AppCode${codeBlocks.length + 1}.swift`,
          code: match[3].trim(),
        })
      }

      return codeBlocks
    })

  const handleCopyCode = (code: string, filename: string) => {
    navigator.clipboard.writeText(code)
    setCopiedFile(filename)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  const handleDownloadCode = async (code: string, filename: string) => {
    try {
      // Check subscription status
      const response = await fetch("/api/check-subscription")
      const { status } = await response.json()

      if (status === "free") {
        toast({
          title: "Subscription Required",
          description: "Please upgrade to download generated code.",
          variant: "destructive",
          action: (
            <Link href="/#pricing">
              <Button variant="outline">View Plans</Button>
            </Link>
          ),
        })
        return
      }

      // Proceed with download if paid subscription
      const blob = new Blob([code], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process download",
        variant: "destructive",
      })
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <WysteriaLogo />
          <h2 className="text-2xl font-bold text-center">iOS Code Generator</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="code">Generated Code</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4">
            <Card className="w-full border-purple-500/20">
              <CardHeader>
                <CardTitle>Chat with Wysteria</CardTitle>
                <CardDescription>
                  Describe your iOS app, and I'll generate professional Swift code for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted border border-purple-500/20"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {message.content.replace(
                            /```(swift|objective-c)(?:\s+(\S+\.swift|\S+\.m|\S+\.h))?\n([\s\S]*?)```/g,
                            (_, lang, filename, code) => `[Code block: ${filename || lang}]`,
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Describe your iOS app requirements..."
                    className="flex-1 bg-muted border-purple-500/20 focus-visible:ring-purple-500"
                  />
                  <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </>
                    )}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <Card className="w-full border-purple-500/20">
              <CardHeader>
                <CardTitle>Generated iOS Code</CardTitle>
                <CardDescription>
                  {extractedCode.length > 0
                    ? `${extractedCode.length} file(s) generated. You can copy or download each file.`
                    : "No code has been generated yet. Start a conversation to generate code."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {extractedCode.length > 0 ? (
                  <div className="space-y-6">
                    {extractedCode.map((codeBlock, index) => (
                      <div key={index} className="border border-purple-500/20 rounded-lg overflow-hidden">
                        <div className="bg-muted p-3 flex justify-between items-center border-b border-purple-500/20">
                          <div className="font-mono text-sm flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                            {codeBlock.filename}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyCode(codeBlock.code, codeBlock.filename || "")}
                              className="border-purple-500/20 hover:bg-purple-500/10"
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              {copiedFile === codeBlock.filename ? "Copied!" : "Copy"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadCode(codeBlock.code, codeBlock.filename || "AppCode.swift")}
                              className="border-purple-500/20 hover:bg-purple-500/10"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <ErrorBoundary
                          fallback={<CodeDisplayFallback code={codeBlock.code} language={codeBlock.language} />}
                        >
                          <CodeDisplay code={codeBlock.code} language={codeBlock.language} />
                        </ErrorBoundary>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="h-12 w-12 text-purple-400 mb-4" />
                    <h3 className="text-lg font-medium">No Code Generated Yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      Describe your iOS app in the chat tab, and I'll generate Swift code based on your requirements.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-purple-500/20 hover:bg-purple-500/10"
                      onClick={() => setActiveTab("chat")}
                    >
                      Go to Chat
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

