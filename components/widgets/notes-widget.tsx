"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface NotesData {
  content?: string
}

interface NotesWidgetProps {
  data?: NotesData
  onUpdate: (data: NotesData) => void
}

export function NotesWidget({ data, onUpdate }: NotesWidgetProps) {
  const [content, setContent] = useState(data?.content || "")

  const handleChange = (value: string) => {
    setContent(value)
    onUpdate({ content: value })
  }

  return (
    <Textarea
      value={content}
      onChange={(e) => handleChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      placeholder="Write your notes here..."
      className="w-full h-full resize-none bg-transparent border-none text-white placeholder:text-white/50 focus:ring-0"
    />
  )
}
