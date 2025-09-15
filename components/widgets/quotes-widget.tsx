"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
]

export function QuotesWidget() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }

  useEffect(() => {
    getRandomQuote()
  }, [])

  return (
    <div className="space-y-3 text-center">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/50 hover:text-white"
          onClick={(e) => {
            e.stopPropagation()
            getRandomQuote()
          }}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-2">
        <blockquote className="text-sm italic">"{currentQuote.text}"</blockquote>
        <cite className="text-xs opacity-70">— {currentQuote.author}</cite>
      </div>
    </div>
  )
}
