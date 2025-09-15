"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DashboardSettings } from "@/app/page"

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  settings: DashboardSettings
  onUpdateSettings: (settings: DashboardSettings) => void
}

const gradientPresets = [
  { name: "Ocean Blue", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Sunset", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Purple Rain", value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Fire", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { name: "Night Sky", value: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%, #6b8cce 100%, #a2b6df 100%)" },
]

const imagePresets = [
  { name: "Mountain Landscape", value: "/placeholder.svg?height=1080&width=1920&text=Mountain+Landscape" },
  { name: "City Skyline", value: "/placeholder.svg?height=1080&width=1920&text=City+Skyline" },
  { name: "Abstract Art", value: "/placeholder.svg?height=1080&width=1920&text=Abstract+Art" },
  { name: "Nature Scene", value: "/placeholder.svg?height=1080&width=1920&text=Nature+Scene" },
]

export function SettingsPanel({ open, onClose, settings, onUpdateSettings }: SettingsPanelProps) {
  const [customBackground, setCustomBackground] = useState("")

  const updateBackground = (type: "gradient" | "image" | "video" | "solid", value: string) => {
    onUpdateSettings({
      ...settings,
      background: { type, value },
    })
  }

  const applyCustomBackground = () => {
    if (customBackground) {
      const type =
        customBackground.startsWith("http") && customBackground.includes(".mp4")
          ? "video"
          : customBackground.startsWith("http")
            ? "image"
            : customBackground.startsWith("linear-gradient") || customBackground.startsWith("radial-gradient")
              ? "gradient"
              : "solid"

      updateBackground(type, customBackground)
      setCustomBackground("")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Dashboard Settings</SheetTitle>
          <SheetDescription>Customize your dashboard appearance and functionality</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="background" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="background" className="space-y-4">
            <div>
              <Label>Background Type</Label>
              <Select
                value={settings.background.type}
                onValueChange={(value: "gradient" | "image" | "video" | "solid") =>
                  updateBackground(value, settings.background.value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="solid">Solid Color</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.background.type === "gradient" && (
              <div className="space-y-3">
                <Label>Gradient Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  {gradientPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-12 p-0 overflow-hidden"
                      style={{ background: preset.value }}
                      onClick={() => updateBackground("gradient", preset.value)}
                    >
                      <span className="bg-black/50 text-white px-2 py-1 text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {settings.background.type === "image" && (
              <div className="space-y-3">
                <Label>Image Presets</Label>
                <div className="grid grid-cols-1 gap-2">
                  {imagePresets.map((preset) => (
                    <Button key={preset.name} variant="outline" onClick={() => updateBackground("image", preset.value)}>
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Custom Background</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    settings.background.type === "gradient"
                      ? "linear-gradient(...)"
                      : settings.background.type === "image"
                        ? "https://example.com/image.jpg"
                        : settings.background.type === "video"
                          ? "https://example.com/video.mp4"
                          : "#ff0000"
                  }
                  value={customBackground}
                  onChange={(e) => setCustomBackground(e.target.value)}
                />
                <Button onClick={applyCustomBackground}>Apply</Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">Current: {settings.background.value}</div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div>
              <Label>Search Bangs</Label>
              <div className="text-sm text-muted-foreground mb-3">
                Configure custom search shortcuts. Use !bang followed by your search term.
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(settings.searchBangs).map(([key, url]) => (
                  <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="font-mono text-sm">!{key}</span>
                    <Input
                      value={url}
                      onChange={(e) =>
                        onUpdateSettings({
                          ...settings,
                          searchBangs: {
                            ...settings.searchBangs,
                            [key]: e.target.value,
                          },
                        })
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newBangs = { ...settings.searchBangs }
                        delete newBangs[key]
                        onUpdateSettings({
                          ...settings,
                          searchBangs: newBangs,
                        })
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <div>
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: "light" | "dark" | "auto") => onUpdateSettings({ ...settings, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Grid Size</Label>
              <Input
                type="number"
                min="10"
                max="50"
                value={settings.gridSize}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    gridSize: Number.parseInt(e.target.value) || 20,
                  })
                }
              />
              <div className="text-sm text-muted-foreground">Controls widget snapping precision</div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
