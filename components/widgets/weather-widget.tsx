"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cloud, Sun, CloudRain, Settings } from "lucide-react"

interface WeatherData {
  location?: string
  temperature?: number
  condition?: string
  humidity?: number
}

interface WeatherWidgetProps {
  data?: WeatherData
  onUpdate: (data: WeatherData) => void
}

export function WeatherWidget({ data, onUpdate }: WeatherWidgetProps) {
  const [isEditing, setIsEditing] = useState(!data?.location)
  const [location, setLocation] = useState(data?.location || "")

  // Mock weather data - in a real app, you'd fetch from a weather API
  const mockWeatherData = {
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
  }

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Sun")) return <Sun className="h-8 w-8" />
    if (condition.includes("Rain")) return <CloudRain className="h-8 w-8" />
    return <Cloud className="h-8 w-8" />
  }

  const saveLocation = () => {
    if (location) {
      onUpdate({
        location,
        ...mockWeatherData,
      })
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <Input
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
        <Button
          onClick={(e) => {
            e.stopPropagation()
            saveLocation()
          }}
          className="w-full"
        >
          Save Location
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm opacity-80">{data?.location}</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/50 hover:text-white"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex items-center justify-center">{getWeatherIcon(data?.condition || "")}</div>

      <div className="text-2xl font-bold">{data?.temperature}°C</div>
      <div className="text-sm opacity-80">{data?.condition}</div>
      <div className="text-xs opacity-60">Humidity: {data?.humidity}%</div>
    </div>
  )
}
