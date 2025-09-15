"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface SearchBarProps {
  searchBangs: { [key: string]: string }
  onUpdateBangs: (bangs: { [key: string]: string }) => void
}

export function SearchBar({ searchBangs, onUpdateBangs }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showBangSettings, setShowBangSettings] = useState(false)
  const [newBangKey, setNewBangKey] = useState("")
  const [newBangUrl, setNewBangUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Check for bang syntax
    const bangMatch = query.match(/^!(\w+)\s+(.+)/)
    if (bangMatch) {
      const [, bang, searchTerm] = bangMatch
      const url = searchBangs[bang]
      if (url) {
        window.open(url + encodeURIComponent(searchTerm), "_blank")
        setQuery("")
        return
      }
    }

    // Default to Google search
    window.open(`https://google.com/search?q=${encodeURIComponent(query)}`, "_blank")
    setQuery("")
  }

  const addBang = () => {
    if (newBangKey && newBangUrl) {
      onUpdateBangs({
        ...searchBangs,
        [newBangKey]: newBangUrl,
      })
      setNewBangKey("")
      setNewBangUrl("")
    }
  }

  const removeBang = (key: string) => {
    const newBangs = { ...searchBangs }
    delete newBangs[key]
    onUpdateBangs(newBangs)
  }

  return (
    <div className="flex items-center gap-2 max-w-md w-full">
      <form onSubmit={handleSearch} className="flex-1 relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or use !bang (Ctrl+K)"
          className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 pr-10"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-white/20"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <Dialog open={showBangSettings} onOpenChange={setShowBangSettings}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Bangs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Use bangs to search specific sites. Type !g hello to search Google for "hello"
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bang-key">Bang Key</Label>
                <Input
                  id="bang-key"
                  value={newBangKey}
                  onChange={(e) => setNewBangKey(e.target.value)}
                  placeholder="g"
                />
              </div>
              <div>
                <Label htmlFor="bang-url">Search URL</Label>
                <Input
                  id="bang-url"
                  value={newBangUrl}
                  onChange={(e) => setNewBangUrl(e.target.value)}
                  placeholder="https://google.com/search?q="
                />
              </div>
            </div>

            <Button onClick={addBang} className="w-full">
              Add Bang
            </Button>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {Object.entries(searchBangs).map(([key, url]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex-1">
                    <span className="font-mono">!{key}</span>
                    <span className="text-sm text-muted-foreground ml-2">{url}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeBang(key)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
