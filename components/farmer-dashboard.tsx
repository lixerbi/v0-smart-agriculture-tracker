"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, TrendingDown } from "lucide-react"
import PriceTrendChart from "./price-trend-chart"

interface MarketItem {
  id: string
  name: string
  region: string
  price: number
  quantity: string
  date: string
}

export default function FarmerDashboard() {
  const [marketData, setMarketData] = useState<MarketItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("marketData")
    if (stored) {
      setMarketData(JSON.parse(stored))
    }
  }, [])

  const regions = Array.from(new Set(marketData.map((item) => item.region)))
  const filteredData = marketData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === "all" || item.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const avgPrice =
    filteredData.length > 0
      ? Math.round((filteredData.reduce((sum, item) => sum + item.price, 0) / filteredData.length) * 100) / 100
      : 0
  const maxPrice = filteredData.length > 0 ? Math.max(...filteredData.map((item) => item.price)) : 0
  const minPrice = filteredData.length > 0 ? Math.min(...filteredData.map((item) => item.price)) : 0

  const itemsByName = marketData.reduce(
    (acc, item) => {
      if (!acc[item.name]) acc[item.name] = []
      acc[item.name].push(item)
      return acc
    },
    {} as Record<string, MarketItem[]>,
  )

  return (
    <div className="space-y-6">
      {filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Average Price</p>
              <p className="text-3xl font-bold text-primary">₹{avgPrice}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Highest Price</p>
              <p className="text-3xl font-bold text-secondary">₹{maxPrice}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Lowest Price</p>
              <p className="text-3xl font-bold text-accent">₹{minPrice}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-muted to-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Items</p>
              <p className="text-3xl font-bold text-foreground">{filteredData.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Market Prices</CardTitle>
          <CardDescription>View current prices across regions and find best deals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items or regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Item</th>
                    <th className="text-left py-3 px-4 font-semibold">Region</th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Unit</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => {
                    const itemAvg =
                      itemsByName[item.name]?.reduce((sum, i) => sum + i.price, 0) / itemsByName[item.name].length ||
                      item.price
                    const isAboveAvg = item.price > itemAvg
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4">{item.region}</td>
                        <td className="py-3 px-4 font-semibold text-accent text-lg">₹{item.price}</td>
                        <td className="py-3 px-4">{item.quantity}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {isAboveAvg ? (
                              <div className="flex items-center gap-1 text-destructive">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xs">High</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-secondary">
                                <TrendingDown className="w-4 h-4" />
                                <span className="text-xs">Low</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedItem(item)
                            }}
                            className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                          >
                            View Trend
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && <p className="text-center py-8 text-muted-foreground">No items found</p>}
          </div>
        </CardContent>
      </Card>

      {selectedItem && <PriceTrendChart item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}
