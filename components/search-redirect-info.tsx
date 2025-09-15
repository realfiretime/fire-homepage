"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Zap, Globe, X } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function SearchRedirectInfo() {
  const [isDismissed, setIsDismissed] = useLocalStorage("search-info-dismissed", false)

  if (isDismissed) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 shadow-xl relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        className="absolute -top-2 -right-2 h-6 w-6 bg-white/90 hover:bg-white text-black rounded-full"
      >
        <X className="h-3 w-3" />
      </Button>

      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Engine Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="text-white space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Setup
          </h4>
          <p className="text-sm opacity-80">Add this URL as your default search engine in your browser:</p>
          <code className="block bg-black/30 p-2 rounded text-xs font-mono">
            {typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/?q=%s
          </code>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            How it works
          </h4>
          <ul className="text-sm opacity-80 space-y-1">
            <li>• Type normally: "hello world" → Google search</li>
            <li>• Use bangs: "!yt music" → YouTube search</li>
            <li>• Instant redirect - no dashboard loading</li>
          </ul>
        </div>

        <div className="text-xs opacity-60 pt-2 border-t border-white/20">
          Configure your search bangs in settings to customize redirect behavior
        </div>
      </CardContent>
    </Card>
  )
}
