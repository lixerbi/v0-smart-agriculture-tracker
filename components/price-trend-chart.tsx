"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Calendar } from "lucide-react"
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts"

interface PriceTrendChartProps {
  item: { name: string; region: string; price: number }
  onClose: () => void
}

export default function PriceTrendChart({ item, onClose }: PriceTrendChartProps) {
  const [priceHistory, setPriceHistory] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(`priceHistory_${item.name}_${item.region}`)
    let history = []

    if (stored) {
      history = JSON.parse(stored)
    } else {
      const today = new Date()
      const basePrice = item.price
      history = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        // Generate more realistic trending data
        const trendFactor = (6 - i) * 0.5
        const variation = (Math.random() - 0.5) * 12 + trendFactor
        const price = Math.max(Math.round((basePrice + variation) * 100) / 100, basePrice * 0.8)

        history.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          fullDate: date.toISOString(),
          price,
          volume: Math.round(Math.random() * 100 + 50),
        })
      }

      // Store history for persistence
      localStorage.setItem(`priceHistory_${item.name}_${item.region}`, JSON.stringify(history))
    }

    setPriceHistory(history)
  }, [item])

  const avgPrice =
    priceHistory.length > 0
      ? Math.round((priceHistory.reduce((sum, d) => sum + d.price, 0) / priceHistory.length) * 100) / 100
      : 0
  const maxPrice = priceHistory.length > 0 ? Math.max(...priceHistory.map((d) => d.price)) : 0
  const minPrice = priceHistory.length > 0 ? Math.min(...priceHistory.map((d) => d.price)) : 0
  const priceChange = priceHistory.length > 1 ? priceHistory[priceHistory.length - 1].price - priceHistory[0].price : 0
  const priceChangePercent = priceHistory.length > 1 ? ((priceChange / priceHistory[0].price) * 100).toFixed(2) : 0
  const trend = priceChange > 0 ? "rising" : priceChange < 0 ? "falling" : "stable"

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            {item.name} - 7-Day Price Analysis
          </CardTitle>
          <CardDescription className="mt-1">{item.region} Market | Last 7 Days</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="bg-muted">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-xl font-bold text-accent">₹{item.price}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-xl font-bold text-primary">₹{avgPrice}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Highest</p>
              <p className="text-xl font-bold text-secondary">₹{maxPrice}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Lowest</p>
              <p className="text-xl font-bold text-foreground">₹{minPrice}</p>
            </CardContent>
          </Card>
          <Card
            className={`${trend === "rising" ? "bg-destructive/10" : trend === "falling" ? "bg-secondary/10" : "bg-primary/10"}`}
          >
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">7-Day Change</p>
              <p
                className={`text-xl font-bold ${trend === "rising" ? "text-destructive" : trend === "falling" ? "text-secondary" : "text-primary"}`}
              >
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)} ({priceChangePercent}%)
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Price Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={priceHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="var(--color-accent)"
                strokeWidth={3}
                dot={{ fill: "var(--color-accent)", r: 5 }}
                activeDot={{ r: 7 }}
                name="Price (₹)"
              />
              <Bar yAxisId="right" dataKey="volume" fill="var(--color-primary)" opacity={0.3} name="Trade Volume" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-muted rounded-lg border border-border">
          <p className="text-sm font-medium mb-2">Market Insight</p>
          <p className="text-sm text-muted-foreground">
            {trend === "rising" &&
              `Prices for ${item.name} are trending upward with a ${priceChangePercent}% increase over the last week. This might be a good time to sell if you have stock.`}
            {trend === "falling" &&
              `Prices for ${item.name} are declining with a ${Math.abs(Number(priceChangePercent))}% decrease. Consider waiting for stabilization before selling.`}
            {trend === "stable" &&
              `Prices for ${item.name} have remained stable around ₹${avgPrice}. Market conditions are consistent.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
