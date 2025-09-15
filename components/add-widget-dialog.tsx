"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WidgetData } from "@/app/page"
import {
  Clock,
  Bookmark,
  Cloud,
  StickyNote,
  Calendar,
  Monitor,
  Rss,
  CheckSquare,
  DollarSign,
  Quote,
  Calculator,
  Music,
  Github,
} from "lucide-react"

interface AddWidgetDialogProps {
  open: boolean
  onClose: () => void
  onAddWidget: (widget: Omit<WidgetData, "id">) => void
}

const widgetTypes = [
  { value: "clock", label: "Clock", icon: Clock, description: "Display current time and date" },
  { value: "bookmark", label: "Bookmarks", icon: Bookmark, description: "Quick access to your favorite links" },
  { value: "weather", label: "Weather", icon: Cloud, description: "Current weather information" },
  { value: "notes", label: "Notes", icon: StickyNote, description: "Simple text notes" },
  { value: "calendar", label: "Calendar", icon: Calendar, description: "Monthly calendar view" },
  { value: "system-info", label: "System Info", icon: Monitor, description: "Browser and system information" },
  { value: "rss", label: "RSS Feed", icon: Rss, description: "Latest articles from RSS feeds" },
  { value: "todo", label: "Todo List", icon: CheckSquare, description: "Task management and todo items" },
  { value: "crypto", label: "Crypto Prices", icon: DollarSign, description: "Cryptocurrency price tracker" },
  { value: "quotes", label: "Daily Quotes", icon: Quote, description: "Inspirational quotes and sayings" },
  { value: "calculator", label: "Calculator", icon: Calculator, description: "Simple calculator widget" },
  { value: "music", label: "Music Player", icon: Music, description: "Basic music player controls" },
  { value: "github-stats", label: "GitHub Stats", icon: Github, description: "GitHub profile statistics" },
]

export function AddWidgetDialog({ open, onClose, onAddWidget }: AddWidgetDialogProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [title, setTitle] = useState("")

  const handleAdd = () => {
    if (selectedType && title) {
      const widgetType = widgetTypes.find((t) => t.value === selectedType)
      onAddWidget({
        type: selectedType as WidgetData["type"],
        title,
        position: { x: 100, y: 100 },
        size: { width: 300, height: 200 },
      })
      setSelectedType("")
      setTitle("")
      onClose()
    }
  }

  const selectedWidget = widgetTypes.find((t) => t.value === selectedType)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>Choose a widget type and give it a name</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Widget Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {widgetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedWidget && <div className="text-sm text-muted-foreground mt-1">{selectedWidget.description}</div>}
          </div>

          <div>
            <Label>Widget Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter widget title" />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleAdd} className="flex-1" disabled={!selectedType || !title}>
              Add Widget
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
