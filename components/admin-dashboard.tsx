"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Edit2 } from "lucide-react"

interface MarketItem {
  id: string
  name: string
  region: string
  price: number
  quantity: string
  date: string
}

const REGIONS = ["Lahore", "Karachi", "Islamabad", "Multan", "Peshawar", "Faisalabad"]
const ITEMS = [
  "Tomato",
  "Potato",
  "Onion",
  "Carrot",
  "Brinjal",
  "Cabbage",
  "Lettuce",
  "Cucumber",
  "Bell Pepper",
  "Spinach",
]

export default function AdminDashboard() {
  const [marketData, setMarketData] = useState<MarketItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    price: "",
    quantity: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("marketData")
    if (stored) {
      setMarketData(JSON.parse(stored))
    } else {
      setMarketData([
        { id: "1", name: "Tomato", region: "Lahore", price: 45, quantity: "kg", date: new Date().toISOString() },
        { id: "2", name: "Potato", region: "Karachi", price: 35, quantity: "kg", date: new Date().toISOString() },
        { id: "3", name: "Onion", region: "Islamabad", price: 55, quantity: "kg", date: new Date().toISOString() },
      ])
    }
  }, [])

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.region || !formData.price) {
      alert("Please fill all fields")
      return
    }

    if (editingId) {
      setMarketData(
        marketData.map((item) =>
          item.id === editingId
            ? { ...item, ...formData, price: Number.parseFloat(formData.price), date: new Date().toISOString() }
            : item,
        ),
      )
      setEditingId(null)
    } else {
      const newItem: MarketItem = {
        id: Date.now().toString(),
        ...formData,
        price: Number.parseFloat(formData.price),
        date: new Date().toISOString(),
      }
      setMarketData([...marketData, newItem])
    }

    setFormData({ name: "", region: "", price: "", quantity: "" })
    setShowForm(false)
  }

  const handleEdit = (item: MarketItem) => {
    setFormData({
      name: item.name,
      region: item.region,
      price: item.price.toString(),
      quantity: item.quantity,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setMarketData(marketData.filter((item) => item.id !== id))
  }

  useEffect(() => {
    localStorage.setItem("marketData", JSON.stringify(marketData))
  }, [marketData])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Market Data</CardTitle>
          <CardDescription>Add or update vegetable and fruit prices</CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button
              onClick={() => {
                setShowForm(true)
                setFormData({ name: "", region: "", price: "", quantity: "" })
                setEditingId(null)
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Item
            </Button>
          ) : (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Item Name</label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="">Select Item</option>
                    {ITEMS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="">Select Region</option>
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹/kg)</label>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <Input
                    type="text"
                    placeholder="kg, quintal, etc"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddOrUpdate}>{editingId ? "Update" : "Add Item"}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Data</CardTitle>
          <CardDescription>Current vegetable and fruit prices across regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Item</th>
                  <th className="text-left py-3 px-4 font-semibold">Region</th>
                  <th className="text-left py-3 px-4 font-semibold">Price</th>
                  <th className="text-left py-3 px-4 font-semibold">Unit</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.region}</td>
                    <td className="py-3 px-4 font-semibold text-accent">₹{item.price}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 hover:bg-muted rounded text-primary">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-destructive/10 rounded text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {marketData.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">No market data added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
