"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail, Lock, User } from "lucide-react"

interface AuthPageProps {
  onLogin: (role: string, name: string) => void
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"admin" | "farmer">("farmer")
  const [isSignUp, setIsSignUp] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && (isSignUp ? name : true)) {
      onLogin(role, name || email.split("@")[0])
    }
  }

  if (!hasAccount && !isSignUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <header className="border-b border-green-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-green-600">🌾</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kisan Bazaar</h1>
                <p className="text-xs text-gray-500">Smart Agriculture Market Tracker</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsSignUp(true)}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Sign Up
              </Button>
              <Button onClick={() => setHasAccount(true)} className="bg-green-600 hover:bg-green-700 text-white">
                Sign In
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-sm font-semibold text-green-700 mb-6">
                Empower Your Farm
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Market Intelligence for Pakistani Farmers
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get real-time market prices, weather insights, and expert advice all in one place. Make informed
                decisions and maximize your profits.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button
                  onClick={() => setIsSignUp(true)}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setHasAccount(true)}
                  variant="outline"
                  size="lg"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8"
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-3">Real-time Market Data</h3>
                <p className="text-green-50 mb-6">
                  Track vegetable and fruit prices across all major Pakistani markets in real-time.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm opacity-90">Latest Prices</p>
                    <p className="text-2xl font-bold">50+</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm opacity-90">Updates</p>
                    <p className="text-2xl font-bold">Daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Price Trends</h3>
              <p className="text-gray-600">
                7-day price charts help you identify the best time to buy or sell your produce.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌦️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Weather Updates</h3>
              <p className="text-gray-600">
                Get accurate weather forecasts for your region to plan your farming activities.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Advice</h3>
              <p className="text-gray-600">
                AI-powered recommendations based on market conditions and weather patterns.
              </p>
            </div>
          </div>

          {/* Community Section */}
          <div className="bg-white rounded-2xl p-12 border border-green-100 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Thousands of Farmers</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with farming communities, share experiences, and learn from fellow farmers across Pakistan.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <div className="px-6 py-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Farmers</p>
                <p className="text-2xl font-bold text-green-600">1000+</p>
              </div>
              <div className="px-6 py-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Daily Discussions</p>
                <p className="text-2xl font-bold text-green-600">500+</p>
              </div>
              <div className="px-6 py-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Market Updates</p>
                <p className="text-2xl font-bold text-green-600">Live</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center gap-2 mb-4">
            <div className="text-4xl">🌾</div>
          </div>
          <CardTitle className="text-3xl text-green-600">Kisan Bazaar</CardTitle>
          <CardDescription>Smart Agriculture Market Tracker</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">Login as</label>
              <div className="flex gap-4">
                <label
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
                  style={{
                    borderColor: role === "farmer" ? "#22c55e" : "#e5e7eb",
                    backgroundColor: role === "farmer" ? "#f0fdf4" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="farmer"
                    checked={role === "farmer"}
                    onChange={(e) => setRole(e.target.value as "farmer" | "admin")}
                    className="w-4 h-4 accent-green-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Farmer</span>
                    <p className="text-xs text-gray-500">View prices & weather</p>
                  </div>
                </label>
                <label
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
                  style={{
                    borderColor: role === "admin" ? "#22c55e" : "#e5e7eb",
                    backgroundColor: role === "admin" ? "#f0fdf4" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value as "farmer" | "admin")}
                    className="w-4 h-4 accent-green-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Admin</span>
                    <p className="text-xs text-gray-500">Manage market data</p>
                  </div>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>

            <p className="text-xs text-center text-gray-600">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setHasAccount(true)
                }}
                className="font-semibold text-green-600 hover:text-green-700 underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>

            {!isSignUp && (
              <p className="text-xs text-center text-gray-600">
                New to Kisan Bazaar?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true)
                    setHasAccount(true)
                  }}
                  className="font-semibold text-green-600 hover:text-green-700 underline"
                >
                  Create an account
                </button>
              </p>
            )}
          </form>

          {!isSignUp && (
            <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-green-800 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-green-700">
                <p>
                  <strong>Farmer:</strong> farm@example.com / farm
                </p>
                <p>
                  <strong>Admin:</strong> admin@example.com / admin
                </p>
              </div>
            </div>
          )}

          {!isSignUp && (
            <button
              type="button"
              onClick={() => setHasAccount(false)}
              className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Home
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
