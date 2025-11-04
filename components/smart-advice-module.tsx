"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingUp, Cloud, Bug, Lightbulb, Award, Loader } from "lucide-react"

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

async function generateAIAdvice(marketData: MarketItem[], weatherConditions: string): Promise<AdviceItem[]> {
  try {
    // Using Google's Gemini API (free tier available)
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

    if (!apiKey) {
      console.log("[v0] Gemini API key not configured, using rule-based advice")
      return generateRuleBasedAdvice(marketData)
    }

    const prompt = `You are a Pakistani agriculture expert. Analyze this market data and provide 3-4 actionable farming advice items in JSON format.

Market Data: ${JSON.stringify(marketData.slice(0, 5))}
Weather: ${weatherConditions}

Return ONLY a JSON array with this structure (no markdown):
[
  {
    "title": "advice title",
    "advice": "detailed explanation",
    "type": "price|weather|pest|market|technique",
    "priority": "high|medium|low",
    "actionable": "specific action to take"
  }
]`

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        next: { revalidate: 3600 },
      },
    )

    if (response.ok) {
      const result = await response.json()
      const content = result.candidates?.[0]?.content?.parts?.[0]?.text || ""
      const parsed = JSON.parse(content)

      return parsed.map((item: any, idx: number) => ({
        id: idx + 100,
        ...item,
        icon: getIconForType(item.type),
        timestamp: new Date(),
      }))
    }
  } catch (error) {
    console.error("[v0] AI API error:", error)
  }

  return generateRuleBasedAdvice(marketData)
}

function generateRuleBasedAdvice(marketData: MarketItem[]): AdviceItem[] {
  const advice: AdviceItem[] = []

  const tomatoData = marketData.find((item) => item.name === "Tomato")
  if (tomatoData && tomatoData.price < 40) {
    advice.push({
      id: 1,
      title: "Tomato Price Alert",
      advice: `Tomato prices are currently low at PKR${tomatoData.price}/kg. Consider holding your stock until prices recover. Market demand is expected to increase in 3-4 days.`,
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
      advice: `Potato prices are strong at PKR${potatoData.price}/kg. This is an optimal time to sell if you have stock available.`,
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

  const onionData = marketData.find((item) => item.name === "Onion")
  if (onionData && onionData.price > 60) {
    advice.push({
      id: 6,
      title: "Onion Market Premium",
      advice: `Onions are trading at a premium price of PKR${onionData.price}/kg. Check supply levels before increasing production next season.`,
      type: "market",
      icon: <TrendingUp className="w-5 h-5 text-accent" />,
      priority: "medium",
      actionable: "Review market trends and plan seed purchases",
      timestamp: new Date(),
    })
  }

  return advice
}

function getIconForType(type: string) {
  const icons: Record<string, React.ReactNode> = {
    price: <TrendingUp className="w-5 h-5 text-accent" />,
    weather: <Cloud className="w-5 h-5 text-primary" />,
    pest: <Bug className="w-5 h-5 text-destructive" />,
    market: <Award className="w-5 h-5 text-secondary" />,
    technique: <Lightbulb className="w-5 h-5 text-secondary" />,
  }
  return icons[type] || <Lightbulb className="w-5 h-5" />
}

export default function SmartAdviceModule() {
  const [adviceList, setAdviceList] = useState<AdviceItem[]>([])
  const [marketData, setMarketData] = useState<MarketItem[]>([])
  const [selectedAdvice, setSelectedAdvice] = useState<AdviceItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("marketData")
    if (stored) {
      setMarketData(JSON.parse(stored))
    }

    const generateAdvice = async () => {
      setLoading(true)
      try {
        const advice = await generateAIAdvice(marketData, "Monsoon season with scattered rainfall")
        setAdviceList(advice)
      } catch (error) {
        console.error("[v0] Advice generation error:", error)
        setAdviceList(generateRuleBasedAdvice(marketData))
      } finally {
        setLoading(false)
      }
    }

    generateAdvice()
  }, [marketData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Generating AI-powered advice...</p>
        </div>
      </div>
    )
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedAdvice = [...adviceList].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const highPriorityAdvice = sortedAdvice.filter((a) => a.priority === "high")
  const otherAdvice = sortedAdvice.filter((a) => a.priority !== "high")

  return (
    <div className="space-y-6">
      {highPriorityAdvice.length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 animate-fade-in-up">
            <AlertCircle className="w-5 h-5 text-destructive animate-pulse-slow" />
            Priority Alerts ({highPriorityAdvice.length})
          </h2>
          {highPriorityAdvice.map((advice, idx) => (
            <Card
              key={advice.id}
              className="border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-all transform hover:scale-105 animate-fade-in-up"
              onClick={() => setSelectedAdvice(advice)}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span className="animate-pulse-slow">{advice.icon}</span>
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
          <h2 className="text-lg font-semibold animate-fade-in-up">Other Recommendations ({otherAdvice.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherAdvice.map((item, idx) => (
              <Card
                key={item.id}
                className={`border-l-4 cursor-pointer hover:shadow-md transition-all transform hover:scale-105 animate-fade-in-up ${
                  item.priority === "medium" ? "border-l-accent" : "border-l-secondary"
                }`}
                onClick={() => setSelectedAdvice(item)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="animate-pulse-slow">{item.icon}</span>
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
        <Card className="border-2 border-accent animate-fade-in-up">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl animate-pulse-slow">{selectedAdvice.icon}</span>
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
              <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="animate-pulse-slow">🎯</span> Recommended Action
              </p>
              <p className="text-sm text-muted-foreground">{selectedAdvice.actionable}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {adviceList.length === 0 && (
        <Card className="text-center py-12 animate-fade-in-up">
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
