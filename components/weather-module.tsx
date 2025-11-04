"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, Sun, Wind, Droplets } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface WeatherData {
  city: string
  region: string
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  visibility: number
  condition: string
  icon: string
  forecast: {
    day: string
    high: number
    low: number
    condition: string
    rainfall: number
  }[]
}

const REGIONS = [
  {
    city: "Lahore",
    region: "Punjab",
    temperature: 32,
    humidity: 65,
    rainfall: 2.5,
    windSpeed: 8,
    visibility: 10,
    condition: "Sunny with Clouds",
    icon: "⛅",
  },
  {
    city: "Karachi",
    region: "Sindh",
    temperature: 28,
    humidity: 72,
    rainfall: 0,
    windSpeed: 12,
    visibility: 8,
    condition: "Partly Cloudy",
    icon: "🌤️",
  },
  {
    city: "Islamabad",
    region: "Federal Capital",
    temperature: 24,
    humidity: 55,
    rainfall: 5.2,
    windSpeed: 6,
    visibility: 12,
    condition: "Clear & Pleasant",
    icon: "🌤️",
  },
  {
    city: "Multan",
    region: "Punjab",
    temperature: 34,
    humidity: 58,
    rainfall: 0,
    windSpeed: 10,
    visibility: 11,
    condition: "Hot & Sunny",
    icon: "☀️",
  },
  {
    city: "Peshawar",
    region: "KP",
    temperature: 26,
    humidity: 68,
    rainfall: 8.5,
    windSpeed: 5,
    visibility: 7,
    condition: "Rainy",
    icon: "🌧️",
  },
]

export default function WeatherModule() {
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])

  useEffect(() => {
    const enhancedWeatherData = REGIONS.map((region) => ({
      ...region,
      forecast: [
        {
          day: "Today",
          high: region.temperature,
          low: region.temperature - 4,
          condition: region.condition,
          rainfall: region.rainfall,
        },
        {
          day: "Tomorrow",
          high: region.temperature + 2,
          low: region.temperature - 3,
          condition: "Partly Cloudy",
          rainfall: 1.2,
        },
        { day: "+2 Days", high: region.temperature + 1, low: region.temperature - 5, condition: "Sunny", rainfall: 0 },
        {
          day: "+3 Days",
          high: region.temperature + 3,
          low: region.temperature - 2,
          condition: "Cloudy",
          rainfall: 3.5,
        },
        {
          day: "+4 Days",
          high: region.temperature,
          low: region.temperature - 4,
          condition: "Light Rain",
          rainfall: 2.1,
        },
        {
          day: "+5 Days",
          high: region.temperature - 1,
          low: region.temperature - 6,
          condition: "Rainy",
          rainfall: 6.0,
        },
        {
          day: "+6 Days",
          high: region.temperature + 2,
          low: region.temperature - 3,
          condition: "Clear",
          rainfall: 0.5,
        },
      ],
    }))

    setWeatherData(enhancedWeatherData)
    if (!selectedCity && enhancedWeatherData.length > 0) {
      setSelectedCity(enhancedWeatherData[0])
    }
  }, [])

  const forecastChartData = selectedCity?.forecast || []
  const temperatureData =
    selectedCity?.forecast.map((f) => ({
      day: f.day,
      high: f.high,
      low: f.low,
      avg: (f.high + f.low) / 2,
    })) || []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {weatherData.map((city) => (
          <button
            key={city.city}
            onClick={() => setSelectedCity(city)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedCity?.city === city.city
                ? "border-accent bg-accent/10"
                : "border-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{city.city}</h3>
                <p className="text-xs text-muted-foreground">{city.region}</p>
              </div>
              <span className="text-2xl">{city.icon}</span>
            </div>
            <p className="text-lg font-bold text-accent">{city.temperature}°C</p>
            <p className="text-xs text-muted-foreground">{city.condition}</p>
          </button>
        ))}
      </div>

      {selectedCity && (
        <>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">{selectedCity.icon}</span>
                    {selectedCity.city}, {selectedCity.region}
                  </CardTitle>
                  <CardDescription>{selectedCity.condition}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-accent" />
                    <span className="text-xs font-medium text-muted-foreground">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedCity.temperature}°C</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedCity.humidity}%</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-medium text-muted-foreground">Rainfall</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedCity.rainfall}mm</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4 text-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedCity.windSpeed} km/h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7-Day Temperature Forecast</CardTitle>
              <CardDescription>High and low temperatures for the coming week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temperatureData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
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
                    type="monotone"
                    dataKey="high"
                    stroke="var(--color-destructive)"
                    strokeWidth={2}
                    name="High (°C)"
                  />
                  <Line type="monotone" dataKey="low" stroke="var(--color-secondary)" strokeWidth={2} name="Low (°C)" />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Average (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rainfall Forecast</CardTitle>
              <CardDescription>Expected precipitation for the week ahead</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={forecastChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                  />
                  <Bar dataKey="rainfall" fill="var(--color-primary)" radius={[8, 8, 0, 0]} name="Rainfall (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-base">Farming Tips for {selectedCity.city}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {selectedCity.humidity > 70 && (
                <p className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>
                    High humidity detected. Increase ventilation in storage areas to prevent crop moisture issues.
                  </span>
                </p>
              )}
              {selectedCity.rainfall > 5 && (
                <p className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Significant rainfall expected. Ensure proper drainage in fields to prevent waterlogging.</span>
                </p>
              )}
              {selectedCity.windSpeed > 10 && (
                <p className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Strong winds forecasted. Secure loose structures and protect delicate crops.</span>
                </p>
              )}
              {selectedCity.temperature > 32 && (
                <p className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>High temperatures expected. Increase irrigation frequency to combat heat stress.</span>
                </p>
              )}
              {selectedCity.temperature < 15 && (
                <p className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Cold weather ahead. Monitor for frost risk and protect sensitive crops if needed.</span>
                </p>
              )}
              {selectedCity.humidity <= 40 && (
                <p className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>
                    Low humidity detected. Be cautious of fire risk and maintain soil moisture through irrigation.
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
