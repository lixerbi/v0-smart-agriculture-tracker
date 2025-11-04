"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingUp, Cloud, Bug, Lightbulb, Award } from "lucide-react"

interface AdviceItem {
  id: number
  title: string
  advice: string
  type: "price" | "weather" | "pest" | "market" | "technique"
  icon: React.ReactNode
  priority: "high" | "medium" | "low"
  actionable: string
  timestamp: Date
}

interface MarketItem {
  id: string
  name: string
  region: string
  price: number
  quantity: string
  date: string
}

export default function SmartAdviceModule() {
  const [adviceList, setAdviceList] = useState<AdviceItem[]>([])
  const [marketData, setMarketData] = useState<MarketItem[]>([])
  const [selectedAdvice, setSelectedAdvice] = useState<AdviceItem | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("marketData")
    if (stored) {
      setMarketData(JSON.parse(stored))
    }

    // Generate dynamic advice based on market conditions
    const generateAdvice = () => {
      const advice: AdviceItem[] = []

      const tomatoData = marketData.find((item) => item.name === "Tomato")
      if (tomatoData && tomatoData.price < 40) {
        advice.push({
          id: 1,
          title: "Tomato Price Alert",
          advice: `Tomato prices are currently low at ₹${tomatoData.price}/kg. Consider holding your stock until prices recover. Market demand is expected to increase in 3-4 days.`,
          type: "price",
          icon: <TrendingUp className="w-5 h-5 text-accent" />,
          priority: "high",
          actionable: "Store in cool conditions and monitor market daily",
          timestamp: new Date(),
        })
      }

      const potatoData = marketData.find((item) => item.name === "Potato")
      if (potatoData && potatoData.price > 50) {
        advice.push({
          id: 2,
          title: "Potato Selling Opportunity",
          advice: `Potato prices are strong at ₹${potatoData.price}/kg. This is an optimal time to sell if you have stock available.`,
          type: "market",
          icon: <Award className="w-5 h-5 text-secondary" />,
          priority: "high",
          actionable: "Contact buyers and arrange transportation",
          timestamp: new Date(),
        })
      }

      advice.push({
        id: 3,
        title: "Rain Expected This Week",
        advice:
          "Rain is forecasted for the coming days. Ensure proper drainage in all fields to prevent waterlogging and crop damage.",
        type: "weather",
        icon: <Cloud className="w-5 h-5 text-primary" />,
        priority: "high",
        actionable: "Check drainage systems and clear blocked channels",
        timestamp: new Date(),
      })

      advice.push({
        id: 4,
        title: "Pest Alert - Monsoon Season",
        advice:
          "During monsoon season, pest activity increases significantly. Implement integrated pest management (IPM) strategies and monitor crops closely.",
        type: "pest",
        icon: <Bug className="w-5 h-5 text-destructive" />,
        priority: "medium",
        actionable: "Apply organic pest control and increase field monitoring",
        timestamp: new Date(),
      })

      advice.push({
        id: 5,
        title: "Crop Rotation Recommendation",
        advice:
          "Based on your cultivation patterns, consider rotating crops to maintain soil fertility and reduce pest buildup.",
        type: "technique",
        icon: <Lightbulb className="w-5 h-5 text-secondary" />,
        priority: "medium",
        actionable: "Plan next season crop rotation strategy",
        timestamp: new Date(),
      })

      // Add more market-based advice
      const onionData = marketData.find((item) => item.name === "Onion")
      if (onionData && onionData.price > 60) {
        advice.push({
          id: 6,
          title: "Onion Market Premium",
          advice: `Onions are trading at a premium price of ₹${onionData.price}/kg. Check supply levels before increasing production next season.`,
          type: "market",
          icon: <TrendingUp className="w-5 h-5 text-accent" />,
          priority: "medium",
          actionable: "Review market trends and plan seed purchases",
          timestamp: new Date(),
        })
      }

      setAdviceList(advice)
    }

    generateAdvice()
  }, [marketData])

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedAdvice = [...adviceList].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const highPriorityAdvice = sortedAdvice.filter((a) => a.priority === "high")
  const otherAdvice = sortedAdvice.filter((a) => a.priority !== "high")

  const adviceDistribution = [
    { type: "Price", count: adviceList.filter((a) => a.type === "price" || a.type === "market").length },
    { type: "Weather", count: adviceList.filter((a) => a.type === "weather").length },
    { type: "Pest", count: adviceList.filter((a) => a.type === "pest").length },
    { type: "Techniques", count: adviceList.filter((a) => a.type === "technique").length },
  ]

  return (
    <div className="space-y-6">
      {highPriorityAdvice.length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Priority Alerts ({highPriorityAdvice.length})
          </h2>
          {highPriorityAdvice.map((advice) => (
            <Card
              key={advice.id}
              className="border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedAdvice(advice)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span>{advice.icon}</span>
                      {advice.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{advice.advice}</CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-destructive/20 text-destructive rounded">
                      {advice.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  <strong>Action:</strong> {advice.actionable}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {otherAdvice.length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Other Recommendations ({otherAdvice.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherAdvice.map((item) => (
              <Card
                key={item.id}
                className={`border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                  item.priority === "medium" ? "border-l-accent" : "border-l-secondary"
                }`}
                onClick={() => setSelectedAdvice(item)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span>{item.icon}</span>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <p className="text-sm text-muted-foreground">{item.advice}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.priority}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedAdvice && (
        <Card className="border-2 border-accent">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedAdvice.icon}</span>
                  {selectedAdvice.title}
                </CardTitle>
                <CardDescription className="mt-2">{selectedAdvice.advice}</CardDescription>
              </div>
              <button onClick={() => setSelectedAdvice(null)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-muted">
                <CardContent className="pt-4 pb-3">
                  <p className="text-xs text-muted-foreground mb-1">Priority Level</p>
                  <p className="font-semibold text-sm capitalize">{selectedAdvice.priority}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardContent className="pt-4 pb-3">
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="font-semibold text-sm capitalize">{selectedAdvice.type}</p>
                </CardContent>
              </Card>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
              <p className="text-sm font-semibold mb-2">Recommended Action</p>
              <p className="text-sm text-muted-foreground">{selectedAdvice.actionable}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {adviceList.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              No advice available at this moment. Add market data to get personalized recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
