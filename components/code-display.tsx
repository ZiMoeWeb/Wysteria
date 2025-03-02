"use client"

import type React from "react"
import { useEffect, useRef } from "react"

let Prism: typeof import("prismjs")

interface CodeDisplayProps {
  code: string
  language: string
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, language }) => {
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const loadPrism = async () => {
      try {
        Prism = (await import("prismjs")).default
        await import("prismjs/components/prism-swift")
        await import("prismjs/components/prism-objectivec")
        await import("prismjs/themes/prism-tomorrow.css")

        if (preRef.current) {
          Prism.highlightElement(preRef.current)
        }
      } catch (error) {
        console.error("Error loading Prism:", error)
      }
    }

    loadPrism()
  }, [])

  return (
    <div className="overflow-auto max-h-[500px] rounded-lg">
      <pre ref={preRef} className="bg-muted p-4 m-0 text-sm overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default CodeDisplay

