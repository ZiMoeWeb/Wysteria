"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface DBStats {
  users: number
  subscriptions: number
  generations: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<DBStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats")
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setStats(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch stats",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, []) // Removed fetchStats from the dependency array

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Total registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{loading ? "..." : stats?.users || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Active subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{loading ? "..." : stats?.subscriptions || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generations</CardTitle>
            <CardDescription>Total code generations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{loading ? "..." : stats?.generations || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={fetchStats} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Stats"}
        </Button>
      </div>
    </div>
  )
}

