"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, Settings } from "lucide-react"

interface CryptoData {
  coins?: string[]
  prices?: { [key: string]: { price: number; change: number } }
}

interface CryptoWidgetProps {
  data?: CryptoData
  onUpdate: (data: CryptoData) => void
}

export function CryptoWidget({ data, onUpdate }: CryptoWidgetProps) {
  const [isEditing, setIsEditing] = useState(!data?.coins?.length)
  const [coinInput, setCoinInput] = useState("")

  // Mock crypto data
  const mockPrices = {
    BTC: { price: 45000, change: 2.5 },
    ETH: { price: 3200, change: -1.2 },
    ADA: { price: 0.85, change: 5.8 },
  }

  useEffect(() => {
    if (data?.coins?.length && !data.prices) {
      onUpdate({
        ...data,
        prices: mockPrices,
      })
    }
  }, [data])

  const addCoin = () => {
    if (coinInput.trim()) {
      const newCoins = [...(data?.coins || []), coinInput.toUpperCase().trim()]
      onUpdate({
        coins: newCoins,
        prices: { ...mockPrices, [coinInput.toUpperCase().trim()]: { price: 1.0, change: 0 } },
      })
      setCoinInput("")
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="text-sm opacity-80">Add cryptocurrency symbols (e.g., BTC, ETH)</div>
        <div className="flex gap-2">
          <Input
            placeholder="Coin symbol"
            value={coinInput}
            onChange={(e) => setCoinInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCoin()}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation()
              addCoin()
            }}
          >
            Add
          </Button>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(false)
          }}
          variant="outline"
          className="w-full"
        >
          Done
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Crypto Prices</div>
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

      <div className="space-y-2">
        {data?.coins?.map((coin) => {
          const priceData = data.prices?.[coin]
          if (!priceData) return null

          return (
            <div key={coin} className="flex items-center justify-between">
              <div className="font-medium">{coin}</div>
              <div className="text-right">
                <div className="text-sm">${priceData.price.toLocaleString()}</div>
                <div
                  className={`text-xs flex items-center gap-1 ${priceData.change >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {priceData.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(priceData.change)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
