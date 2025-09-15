"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ExternalLink, X } from "lucide-react"

interface BookmarkData {
  links: Array<{ name: string; url: string; icon?: string }>
}

interface BookmarkWidgetProps {
  data?: BookmarkData
  onUpdate: (data: BookmarkData) => void
}

export function BookmarkWidget({ data, onUpdate }: BookmarkWidgetProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newLink, setNewLink] = useState({ name: "", url: "", icon: "" })

  const links = data?.links || []

  const addLink = () => {
    if (newLink.name && newLink.url) {
      onUpdate({
        links: [...links, { ...newLink, icon: newLink.icon || "🔗" }],
      })
      setNewLink({ name: "", url: "", icon: "" })
      setIsAdding(false)
    }
  }

  const removeLink = (index: number) => {
    onUpdate({
      links: links.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={index} className="flex items-center justify-between group">
          <a
            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors flex-1 py-1 px-2 rounded hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation() // Prevent widget dragging when clicking links
            }}
          >
            <span>{link.icon}</span>
            <span className="truncate">{link.name}</span>
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              removeLink(index)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}

      {isAdding ? (
        <div className="space-y-2 pt-2 border-t border-white/20">
          <Input
            placeholder="Name"
            value={newLink.name}
            onChange={(e) => setNewLink((prev) => ({ ...prev, name: e.target.value }))}
            className="h-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Input
            placeholder="URL"
            value={newLink.url}
            onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
            className="h-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Input
            placeholder="Icon (emoji)"
            value={newLink.icon}
            onChange={(e) => setNewLink((prev) => ({ ...prev, icon: e.target.value }))}
            className="h-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                addLink()
              }}
              size="sm"
              className="flex-1"
            >
              Add
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setIsAdding(false)
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            setIsAdding(true)
          }}
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      )}
    </div>
  )
}
