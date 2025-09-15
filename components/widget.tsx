"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Move, MoreHorizontal, Edit } from "lucide-react"
import type { WidgetData } from "@/app/page"
import { ClockWidget } from "@/components/widgets/clock-widget"
import { BookmarkWidget } from "@/components/widgets/bookmark-widget"
import { WeatherWidget } from "@/components/widgets/weather-widget"
import { NotesWidget } from "@/components/widgets/notes-widget"
import { CalendarWidget } from "@/components/widgets/calendar-widget"
import { SystemInfoWidget } from "@/components/widgets/system-info-widget"
import { RssWidget } from "@/components/widgets/rss-widget"
import { TodoWidget } from "@/components/widgets/todo-widget"
import { CryptoWidget } from "@/components/widgets/crypto-widget"
import { QuotesWidget } from "@/components/widgets/quotes-widget"
import { CalculatorWidget } from "@/components/widgets/calculator-widget"
import { MusicWidget } from "@/components/widgets/music-widget"
import { GithubStatsWidget } from "@/components/widgets/github-stats-widget"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WidgetProps {
  widget: WidgetData
  onUpdate: (updates: Partial<WidgetData>) => void
  onDelete: () => void
  gridSize: number
}

export function Widget({ widget, onUpdate, onDelete, gridSize }: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showControls, setShowControls] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header area
    const target = e.target as HTMLElement

    // Don't drag if clicking on interactive elements
    if (target.closest("button") || target.closest("input") || target.closest("textarea") || target.closest("a")) {
      return
    }

    // Only allow dragging from the header area
    if (!target.closest(".widget-header")) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - widget.position.x,
      y: e.clientY - widget.position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()

    const newX = Math.max(0, e.clientX - dragStart.x)
    const newY = Math.max(0, e.clientY - dragStart.y)

    // Snap to grid
    const snappedX = Math.round(newX / gridSize) * gridSize
    const snappedY = Math.round(newY / gridSize) * gridSize

    onUpdate({
      position: { x: snappedX, y: snappedY },
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart, gridSize, widget.position.x, widget.position.y, onUpdate])

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = widget.size.width
    const startHeight = widget.size.height

    const handleResizeMove = (e: MouseEvent) => {
      const newWidth = Math.max(200, startWidth + (e.clientX - startX))
      const newHeight = Math.max(150, startHeight + (e.clientY - startY))

      onUpdate({
        size: { width: newWidth, height: newHeight },
      })
    }

    const handleResizeEnd = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleResizeMove)
      document.removeEventListener("mouseup", handleResizeEnd)
    }

    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  const renderWidgetContent = () => {
    switch (widget.type) {
      case "clock":
        return <ClockWidget />
      case "bookmark":
        return <BookmarkWidget data={widget.data} onUpdate={(data) => onUpdate({ data })} />
      case "weather":
        return <WeatherWidget data={widget.data} onUpdate={(data) => onUpdate({ data })} />
      case "notes":
        return <NotesWidget data={widget.data} onUpdate={(data) => onUpdate({ data })} />
      case "calendar":
        return <CalendarWidget />
      case "system-info":
        return <SystemInfoWidget />
      case "rss":
        return <RssWidget data={widget.data} onUpdate={(data) => onUpdate({ data })} />
      case "todo":
        return <TodoWidget data={widget.data} onUpdate={(data) => onUpdate({ data })} />
      case "crypto":
        return <CryptoWidget data={widget.data} onUpdate={(data) => onUpdate({ data })} />
      case "quotes":
        return <QuotesWidget />
      case "calculator":
        return <CalculatorWidget />
      case "music":
        return <MusicWidget data={widget.data} onUpdate={(data) => onUpdate({ data })} />
      case "github-stats":
        return <GithubStatsWidget data={widget.data} onUpdate={(data) => onUpdate({ data })} />
      default:
        return <div>Unknown widget type</div>
    }
  }

  return (
    <Card
      ref={widgetRef}
      className="absolute backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl transition-all duration-200 hover:shadow-2xl group"
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        userSelect: isDragging || isResizing ? "none" : "auto",
        zIndex: isDragging || isResizing ? 50 : 1,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Widget Controls */}
      <div
        className={`absolute -top-2 -right-2 flex gap-1 transition-opacity duration-200 z-10 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-6 w-6 bg-white/90 hover:bg-white text-black">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUpdate({ title: prompt("New title:", widget.title) || widget.title })}>
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <X className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="pb-2 widget-header cursor-move" onMouseDown={handleMouseDown}>
        <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
          <Move className="h-3 w-3 opacity-50 move-handle" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-white">{renderWidgetContent()}</CardContent>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleResize}
      >
        <div className="w-full h-full bg-white/50 rounded-tl-lg" />
      </div>
    </Card>
  )
}
