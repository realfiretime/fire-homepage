"use client"

import { useState, useEffect } from "react"
import { Monitor, Cpu, HardDrive } from "lucide-react"

export function SystemInfoWidget() {
  const [systemInfo, setSystemInfo] = useState({
    browser: "",
    platform: "",
    memory: 0,
    timestamp: new Date(),
  })

  useEffect(() => {
    const updateSystemInfo = () => {
      setSystemInfo({
        browser: navigator.userAgent.split(" ").pop() || "Unknown",
        platform: navigator.platform,
        memory: (performance as any).memory?.usedJSHeapSize || 0,
        timestamp: new Date(),
      })
    }

    updateSystemInfo()
    const interval = setInterval(updateSystemInfo, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2">
        <Monitor className="h-4 w-4" />
        <div>
          <div className="font-medium">Platform</div>
          <div className="text-xs opacity-80">{systemInfo.platform}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4" />
        <div>
          <div className="font-medium">Browser</div>
          <div className="text-xs opacity-80 truncate">{systemInfo.browser}</div>
        </div>
      </div>

      {systemInfo.memory > 0 && (
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4" />
          <div>
            <div className="font-medium">Memory Usage</div>
            <div className="text-xs opacity-80">{formatBytes(systemInfo.memory)}</div>
          </div>
        </div>
      )}

      <div className="text-xs opacity-60 pt-2 border-t border-white/20">
        Updated: {systemInfo.timestamp.toLocaleTimeString()}
      </div>
    </div>
  )
}
