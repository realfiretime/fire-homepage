"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, RefreshCw } from "lucide-react"

interface RssData {
  feedUrl?: string
  articles?: Array<{ title: string; link: string; pubDate: string }>
}

interface RssWidgetProps {
  data?: RssData
  onUpdate: (data: RssData) => void
}

export function RssWidget({ data, onUpdate }: RssWidgetProps) {
  const [isEditing, setIsEditing] = useState(!data?.feedUrl)
  const [feedUrl, setFeedUrl] = useState(data?.feedUrl || "")
  const [isLoading, setIsLoading] = useState(false)

  // Mock RSS data - in a real app, you'd fetch from an RSS parser API
  const mockArticles = [
    { title: "Latest Tech News", link: "https://example.com/1", pubDate: "2024-01-15" },
    { title: "Web Development Trends", link: "https://example.com/2", pubDate: "2024-01-14" },
    { title: "JavaScript Updates", link: "https://example.com/3", pubDate: "2024-01-13" },
  ]

  const saveFeed = () => {
    if (feedUrl) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        onUpdate({
          feedUrl,
          articles: mockArticles,
        })
        setIsEditing(false)
        setIsLoading(false)
      }, 1000)
    }
  }

  const refreshFeed = () => {
    setIsLoading(true)
    setTimeout(() => {
      onUpdate({
        ...data,
        articles: mockArticles,
      })
      setIsLoading(false)
    }, 1000)
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <Input
          placeholder="RSS Feed URL"
          value={feedUrl}
          onChange={(e) => setFeedUrl(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
        <Button
          onClick={(e) => {
            e.stopPropagation()
            saveFeed()
          }}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Save Feed"}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80 truncate flex-1">{data?.feedUrl?.replace(/^https?:\/\//, "")}</div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/50 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              refreshFeed()
            }}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/50 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              setFeedUrl(data?.feedUrl || "")
              setIsEditing(true)
            }}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-32 overflow-y-auto">
        {data?.articles?.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 rounded hover:bg-white/10 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-medium truncate">{article.title}</div>
            <div className="text-xs opacity-60">{new Date(article.pubDate).toLocaleDateString()}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
