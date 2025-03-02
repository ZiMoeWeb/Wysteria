"use client"
import type React from "react"

interface CodeDisplayFallbackProps {
  code: string
  language: string
}

const CodeDisplayFallback: React.FC<CodeDisplayFallbackProps> = ({ code, language }) => {
  return (
    <div className="overflow-auto max-h-[500px] rounded-lg">
      <div className="px-4 py-2 bg-muted text-sm font-mono border-b border-purple-500/20">{language}</div>
      <pre className="bg-muted p-4 m-0 text-sm overflow-x-auto font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeDisplayFallback

