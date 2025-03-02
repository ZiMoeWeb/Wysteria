import { WysteriaLogo } from "@/components/wysteria-logo"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8">
        <WysteriaLogo />
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </main>
  )
}

