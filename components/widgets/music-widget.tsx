"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

interface MusicData {
  currentTrack?: string
  isPlaying?: boolean
}

interface MusicWidgetProps {
  data?: MusicData
  onUpdate: (data: MusicData) => void
}

export function MusicWidget({ data, onUpdate }: MusicWidgetProps) {
  const [trackName, setTrackName] = useState(data?.currentTrack || "No track selected")

  const togglePlay = () => {
    onUpdate({
      ...data,
      isPlaying: !data?.isPlaying,
    })
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-sm font-medium truncate">{trackName}</div>
        <div className="text-xs opacity-60">Artist Name</div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            togglePlay()
          }}
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-white hover:bg-white/20"
        >
          {data?.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4" />
        <div className="flex-1 bg-white/20 rounded-full h-2">
          <div className="bg-white rounded-full h-2 w-3/4"></div>
        </div>
      </div>

      <Input
        placeholder="Enter track name"
        value={trackName}
        onChange={(e) => setTrackName(e.target.value)}
        onBlur={() => onUpdate({ ...data, currentTrack: trackName })}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
      />
    </div>
  )
}
