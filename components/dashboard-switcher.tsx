"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Plus, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Dashboard } from "@/app/page"

interface DashboardSwitcherProps {
  dashboards: Dashboard[]
  currentDashboardId: string
  onDashboardChange: (id: string) => void
  onDashboardCreate: (name: string) => void
  onDashboardDelete: (id: string) => void
  onDashboardRename: (name: string) => void
}

export function DashboardSwitcher({
  dashboards,
  currentDashboardId,
  onDashboardChange,
  onDashboardCreate,
  onDashboardDelete,
  onDashboardRename,
}: DashboardSwitcherProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [newDashboardName, setNewDashboardName] = useState("")

  const currentDashboard = dashboards.find((d) => d.id === currentDashboardId)

  const handleCreate = () => {
    if (newDashboardName.trim()) {
      onDashboardCreate(newDashboardName.trim())
      setNewDashboardName("")
      setShowCreateDialog(false)
    }
  }

  const handleRename = () => {
    if (newDashboardName.trim()) {
      onDashboardRename(newDashboardName.trim())
      setNewDashboardName("")
      setShowRenameDialog(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center gap-2">
            <h1 className="text-2xl font-bold drop-shadow-lg">{currentDashboard?.name || "Dashboard"}</h1>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {dashboards.map((dashboard) => (
            <DropdownMenuItem
              key={dashboard.id}
              onClick={() => onDashboardChange(dashboard.id)}
              className={currentDashboardId === dashboard.id ? "bg-accent" : ""}
            >
              {dashboard.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setNewDashboardName(currentDashboard?.name || "")
              setShowRenameDialog(true)
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Rename Current
          </DropdownMenuItem>
          {dashboards.length > 1 && (
            <DropdownMenuItem onClick={() => onDashboardDelete(currentDashboardId)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Current
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Dashboard Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>Enter a name for your new dashboard</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Dashboard name"
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="flex-1">
                Create
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dashboard Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Dashboard</DialogTitle>
            <DialogDescription>Enter a new name for this dashboard</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Dashboard name"
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
            <div className="flex gap-2">
              <Button onClick={handleRename} className="flex-1">
                Rename
              </Button>
              <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
