import { DatabaseUrlDisplay } from "@/components/database-url-display"

export default function DatabaseUrlPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Database Configuration</h1>
      <DatabaseUrlDisplay />
    </div>
  )
}

