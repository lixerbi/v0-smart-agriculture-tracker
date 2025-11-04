"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AuthPageProps {
  onLogin: (role: string, name: string) => void
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"admin" | "farmer">("farmer")
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && name) {
      onLogin(role, name)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">🌾</div>
          <CardTitle>Kisan Bazaar</CardTitle>
          <CardDescription>Smart Agriculture Market Tracker</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Login as</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="farmer"
                    checked={role === "farmer"}
                    onChange={(e) => setRole(e.target.value as "farmer" | "admin")}
                  />
                  <span className="text-sm">Farmer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value as "farmer" | "admin")}
                  />
                  <span className="text-sm">Admin</span>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo credentials: Any email/password combination works
            </p>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Quick Demo Login:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Admin:</strong> Email: admin@example.com | Pass: admin
              </p>
              <p>
                <strong>Farmer:</strong> Email: farmer@example.com | Pass: farmer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
