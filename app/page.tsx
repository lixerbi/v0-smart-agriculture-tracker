"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import AuthPage from "@/components/auth-page"
import AdminDashboard from "@/components/admin-dashboard"
import FarmerDashboard from "@/components/farmer-dashboard"
import CommunityForum from "@/components/community-forum"
import WeatherModule from "@/components/weather-module"
import SmartAdviceModule from "@/components/smart-advice-module"

type UserRole = "admin" | "farmer" | null

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")
    setUserRole(stored as UserRole)
    setUserName(name || "")
    setIsLoading(false)
  }, [])

  if (isLoading) return null

  if (!userRole) {
    return (
      <AuthPage
        onLogin={(role, name) => {
          setUserRole(role as UserRole)
          setUserName(name)
          localStorage.setItem("userRole", role)
          localStorage.setItem("userName", name)
        }}
      />
    )
  }

  const handleLogout = () => {
    setUserRole(null)
    setUserName("")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Kisan Bazaar</h1>
            <p className="text-sm text-muted-foreground">Smart Agriculture Market Tracker</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === "admin" ? (
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="dashboard">Market Data</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Market Statistics</CardTitle>
                  <CardDescription>Overview of uploaded market data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Total Items</p>
                        <p className="text-3xl font-bold text-primary">12</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Average Price</p>
                        <p className="text-3xl font-bold text-accent">₹485</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Regions</p>
                        <p className="text-3xl font-bold text-secondary">5</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="prices" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="prices">Prices</TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="advice">Advice</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
            </TabsList>
            <TabsContent value="prices">
              <FarmerDashboard />
            </TabsContent>
            <TabsContent value="weather">
              <WeatherModule />
            </TabsContent>
            <TabsContent value="advice">
              <SmartAdviceModule />
            </TabsContent>
            <TabsContent value="forum">
              <CommunityForum />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
