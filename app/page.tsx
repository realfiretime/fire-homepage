"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Settings, Plus } from "lucide-react"
import { SettingsPanel } from "@/components/settings-panel"
import { Widget } from "@/components/widget"
import { SearchBar } from "@/components/search-bar"
import { AddWidgetDialog } from "@/components/add-widget-dialog"
import { DashboardSwitcher } from "@/components/dashboard-switcher"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { cn } from "@/lib/utils"
import { SearchRedirectInfo } from "@/components/search-redirect-info"

export interface WidgetData {
  id: string
  type:
    | "bookmark"
    | "clock"
    | "weather"
    | "notes"
    | "calendar"
    | "system-info"
    | "rss"
    | "todo"
    | "crypto"
    | "quotes"
    | "calculator"
    | "music"
    | "github-stats"
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  data?: any
}

export interface DashboardSettings {
  background: {
    type: "gradient" | "image" | "video" | "solid"
    value: string
  }
  searchBangs: { [key: string]: string }
  theme: "light" | "dark" | "auto"
  gridSize: number
}

export interface Dashboard {
  id: string
  name: string
  widgets: WidgetData[]
  settings: DashboardSettings
}

const defaultSettings: DashboardSettings = {
  background: {
    type: "gradient",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  searchBangs: {
    g: "https://google.com/search?q=",
    yt: "https://youtube.com/results?search_query=",
    gh: "https://github.com/search?q=",
    tw: "https://twitter.com/search?q=",
    r: "https://reddit.com/search?q=",
  },
  theme: "dark",
  gridSize: 20,
}

const defaultWidgets: WidgetData[] = [
  {
    id: "1",
    type: "clock",
    title: "Clock",
    position: { x: 50, y: 50 },
    size: { width: 300, height: 150 },
  },
  {
    id: "2",
    type: "bookmark",
    title: "Quick Links",
    position: { x: 400, y: 50 },
    size: { width: 250, height: 200 },
    data: {
      links: [
        { name: "GitHub", url: "https://github.com", icon: "🐙" },
        { name: "YouTube", url: "https://youtube.com", icon: "📺" },
        { name: "Reddit", url: "https://reddit.com", icon: "🤖" },
      ],
    },
  },
]

const createDefaultDashboard = (name: string): Dashboard => ({
  id: Date.now().toString(),
  name,
  widgets: defaultWidgets,
  settings: defaultSettings,
})

export default function HomePage() {
  // Check for existing data in localStorage before initializing
  const [dashboards, setDashboards, dashboardsInitialized] = useLocalStorage<Dashboard[]>("dashboards", [
    createDefaultDashboard("My Dashboard"),
  ])

  const [currentDashboardId, setCurrentDashboardId, currentDashboardIdInitialized] = useLocalStorage<string>(
    "current-dashboard",
    dashboards[0]?.id || "",
  )

  const [showSettings, setShowSettings] = useState(false)
  const [showAddWidget, setShowAddWidget] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Find the current dashboard
  const currentDashboard = dashboards.find((d) => d.id === currentDashboardId) || dashboards[0]

  // Handle URL search parameters for immediate redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchQuery = urlParams.get("q")

    if (searchQuery && searchQuery.trim()) {
      setIsRedirecting(true)

      // Get saved search bangs from localStorage directly
      const savedSettings = localStorage.getItem("dashboard-settings")
      let searchBangs = defaultSettings.searchBangs

      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          searchBangs = parsed.searchBangs || defaultSettings.searchBangs
        } catch (e) {
          console.error("Error parsing settings:", e)
        }
      }

      // Check for bang syntax
      const bangMatch = searchQuery.match(/^!(\w+)\s+(.+)/)
      let redirectUrl = ""

      if (bangMatch) {
        const [, bang, searchTerm] = bangMatch
        const bangUrl = searchBangs[bang]
        if (bangUrl) {
          redirectUrl = bangUrl + encodeURIComponent(searchTerm)
        } else {
          redirectUrl = `https://google.com/search?q=${encodeURIComponent(searchQuery)}`
        }
      } else {
        redirectUrl = `https://google.com/search?q=${encodeURIComponent(searchQuery)}`
      }

      window.location.href = redirectUrl
      return
    }
  }, []) // Empty dependency array - only run once on mount

  // Wait for localStorage to initialize
  useEffect(() => {
    if (dashboardsInitialized && currentDashboardIdInitialized) {
      setIsLoading(false)
    }
  }, [dashboardsInitialized, currentDashboardIdInitialized])

  // Ensure we have at least one dashboard - only run when loading is complete
  useEffect(() => {
    if (!isLoading && dashboards.length === 0) {
      const newDashboard = createDefaultDashboard("My Dashboard")
      setDashboards([newDashboard])
      setCurrentDashboardId(newDashboard.id)
    }
  }, [isLoading, dashboards.length, setDashboards, setCurrentDashboardId])

  const backgroundStyle = {
    background:
      currentDashboard?.settings.background.type === "gradient" ||
      currentDashboard?.settings.background.type === "solid"
        ? currentDashboard.settings.background.value
        : currentDashboard?.settings.background.type === "image"
          ? `url(${currentDashboard.settings.background.value}) center/cover no-repeat`
          : undefined,
  }

  const handleWidgetUpdate = (id: string, updates: Partial<WidgetData>) => {
    setDashboards((prev) =>
      prev.map((dashboard) =>
        dashboard.id === currentDashboardId
          ? {
              ...dashboard,
              widgets: dashboard.widgets.map((widget) => (widget.id === id ? { ...widget, ...updates } : widget)),
            }
          : dashboard,
      ),
    )
  }

  const handleWidgetDelete = (id: string) => {
    setDashboards((prev) =>
      prev.map((dashboard) =>
        dashboard.id === currentDashboardId
          ? { ...dashboard, widgets: dashboard.widgets.filter((widget) => widget.id !== id) }
          : dashboard,
      ),
    )
  }

  const handleAddWidget = (widget: Omit<WidgetData, "id">) => {
    const newWidget: WidgetData = {
      ...widget,
      id: Date.now().toString(),
    }
    setDashboards((prev) =>
      prev.map((dashboard) =>
        dashboard.id === currentDashboardId ? { ...dashboard, widgets: [...dashboard.widgets, newWidget] } : dashboard,
      ),
    )
  }

  const handleSettingsUpdate = (settings: DashboardSettings) => {
    setDashboards((prev) =>
      prev.map((dashboard) => (dashboard.id === currentDashboardId ? { ...dashboard, settings } : dashboard)),
    )
  }

  const handleDashboardNameChange = (name: string) => {
    setDashboards((prev) =>
      prev.map((dashboard) => (dashboard.id === currentDashboardId ? { ...dashboard, name } : dashboard)),
    )
  }

  // Show loading screen while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Redirecting to search results...</p>
        </div>
      </div>
    )
  }

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!currentDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center text-white">
          <p className="text-lg mb-4">No dashboard found. Create a new one?</p>
          <Button
            onClick={() => {
              const newDashboard = createDefaultDashboard("My Dashboard")
              setDashboards([newDashboard])
              setCurrentDashboardId(newDashboard.id)
            }}
          >
            Create Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "min-h-screen relative overflow-hidden transition-all duration-500",
        currentDashboard.settings.theme === "dark" ? "dark" : "",
      )}
      style={backgroundStyle}
    >
      {/* Background Video */}
      {currentDashboard.settings.background.type === "video" && (
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover -z-10">
          <source src={currentDashboard.settings.background.value} type="video/mp4" />
        </video>
      )}

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20 -z-5" />

      {/* Header */}
      <header className="relative z-50 p-6 flex items-center justify-between backdrop-blur-sm bg-white/10 dark:bg-black/20 border-b border-white/20">
        <div className="flex items-center gap-4">
          <DashboardSwitcher
            dashboards={dashboards}
            currentDashboardId={currentDashboardId}
            onDashboardChange={setCurrentDashboardId}
            onDashboardCreate={(name) => {
              const newDashboard = createDefaultDashboard(name)
              setDashboards((prev) => [...prev, newDashboard])
              setCurrentDashboardId(newDashboard.id)
            }}
            onDashboardDelete={(id) => {
              setDashboards((prev) => prev.filter((d) => d.id !== id))
              if (currentDashboardId === id) {
                const remaining = dashboards.filter((d) => d.id !== id)
                setCurrentDashboardId(remaining[0]?.id || "")
              }
            }}
            onDashboardRename={handleDashboardNameChange}
          />
        </div>

        <SearchBar
          searchBangs={currentDashboard.settings.searchBangs}
          onUpdateBangs={(bangs) => handleSettingsUpdate({ ...currentDashboard.settings, searchBangs: bangs })}
        />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAddWidget(true)}
            className="text-white hover:bg-white/20"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Widget Container */}
      <div className="relative p-6 h-[calc(100vh-120px)]">
        {currentDashboard.widgets.map((widget) => (
          <Widget
            key={widget.id}
            widget={widget}
            onUpdate={(updates) => handleWidgetUpdate(widget.id, updates)}
            onDelete={() => handleWidgetDelete(widget.id)}
            gridSize={currentDashboard.settings.gridSize}
          />
        ))}
        {/* Search Engine Info Card */}
        <div className="absolute bottom-6 right-6">
          <SearchRedirectInfo />
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={currentDashboard.settings}
        onUpdateSettings={handleSettingsUpdate}
      />

      {/* Add Widget Dialog */}
      <AddWidgetDialog open={showAddWidget} onClose={() => setShowAddWidget(false)} onAddWidget={handleAddWidget} />
    </div>
  )
}
