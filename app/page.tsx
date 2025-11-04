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
      <header className="border-b border-border bg-gradient-to-r from-card to-card/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center animate-slide-in-left">
          <div className="flex items-center gap-4">
            <div className="text-4xl animate-pulse-slow">👨‍🌾</div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Kisan Bazaar</h1>
              <p className="text-sm text-muted-foreground">Smart Agriculture Market Tracker - Pakistan</p>
            </div>
          </div>
          <div className="flex items-center gap-4 animate-fade-in-up">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-transparent hover:bg-muted transform hover:scale-105 transition-transform"
            >
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
              <Card className="animate-fade-in-up">
                <CardHeader>
                  <CardTitle>Market Statistics</CardTitle>
                  <CardDescription>Overview of uploaded market data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 transform hover:scale-105 transition-transform animate-fade-in-up">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Total Items</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">12</p>
                      </CardContent>
                    </Card>
                    <Card
                      className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 transform hover:scale-105 transition-transform animate-fade-in-up"
                      style={{ animationDelay: "0.1s" }}
                    >
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Average Price</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">PKR 485</p>
                      </CardContent>
                    </Card>
                    <Card
                      className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 transform hover:scale-105 transition-transform animate-fade-in-up"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-2">Regions</p>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">5</p>
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
              <TabsTrigger value="advice">AI Advice</TabsTrigger>
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
