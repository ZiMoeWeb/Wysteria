import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Set the runtime to edge for better performance
export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion using GPT-4
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are an iOS development expert working for Wysteria.ai. 
        Generate Swift code for iOS apps based on user requirements. 
        Always provide complete, working code with proper explanations.
        Use modern Swift practices and SwiftUI when applicable.
        Format code blocks with \`\`\`swift filename.swift
[code]
\`\`\`.`,
      },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 4000,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Return a StreamingTextResponse, which is compatible with the AI SDK
  return new StreamingTextResponse(stream)
}

