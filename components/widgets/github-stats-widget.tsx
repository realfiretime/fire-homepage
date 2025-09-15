"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Star, Settings } from "lucide-react"

interface GithubData {
  username?: string
  stats?: {
    repos: number
    followers: number
    following: number
    stars: number
  }
}

interface GithubStatsWidgetProps {
  data?: GithubData
  onUpdate: (data: GithubData) => void
}

export function GithubStatsWidget({ data, onUpdate }: GithubStatsWidgetProps) {
  const [isEditing, setIsEditing] = useState(!data?.username)
  const [username, setUsername] = useState(data?.username || "")

  // Mock GitHub stats
  const mockStats = {
    repos: 42,
    followers: 128,
    following: 89,
    stars: 256,
  }

  const saveUsername = () => {
    if (username.trim()) {
      onUpdate({
        username: username.trim(),
        stats: mockStats,
      })
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <Input
          placeholder="GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveUsername()}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
        <Button
          onClick={(e) => {
            e.stopPropagation()
            saveUsername()
          }}
          className="w-full"
        >
          Save Username
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4" />
          <span className="text-sm font-medium">{data?.username}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/50 hover:text-white"
          onClick={(e) => {
            e.stopPropagation()
            setUsername(data?.username || "")
            setIsEditing(true)
          }}
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div>
          <div className="text-lg font-bold">{data?.stats?.repos}</div>
          <div className="text-xs opacity-60">Repos</div>
        </div>
        <div>
          <div className="text-lg font-bold">{data?.stats?.followers}</div>
          <div className="text-xs opacity-60">Followers</div>
        </div>
        <div>
          <div className="text-lg font-bold">{data?.stats?.following}</div>
          <div className="text-xs opacity-60">Following</div>
        </div>
        <div>
          <div className="text-lg font-bold flex items-center justify-center gap-1">
            <Star className="h-3 w-3" />
            {data?.stats?.stars}
          </div>
          <div className="text-xs opacity-60">Stars</div>
        </div>
      </div>
    </div>
  )
}
