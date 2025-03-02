import { NextResponse } from "next/server"
import { headers } from 'next/headers'

export async function GET() {
  const headersList = headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  return NextResponse.json({
    env: {
      hasGithubId: !!process.env.GITHUB_ID,
      hasGithubSecret: !!process.env.GITHUB_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      currentUrl: `${protocol}://${host}`,
    },
    headers: {
      host: headersList.get('host'),
      userAgent: headersList.get('user-agent'),
    }
  })
}