"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"

interface TodoData {
  tasks?: Array<{ id: string; text: string; completed: boolean }>
}

interface TodoWidgetProps {
  data?: TodoData
  onUpdate: (data: TodoData) => void
}

export function TodoWidget({ data, onUpdate }: TodoWidgetProps) {
  const [newTask, setNewTask] = useState("")
  const tasks = data?.tasks || []

  const addTask = () => {
    if (newTask.trim()) {
      onUpdate({
        tasks: [...tasks, { id: Date.now().toString(), text: newTask.trim(), completed: false }],
      })
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    onUpdate({
      tasks: tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    })
  }

  const deleteTask = (id: string) => {
    onUpdate({
      tasks: tasks.filter((task) => task.id !== id),
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex-1 h-8 bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
        <Button
          onClick={(e) => {
            e.stopPropagation()
            addTask()
          }}
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1 max-h-32 overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 group">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="border-white/30"
            />
            <span className={`flex-1 text-sm ${task.completed ? "line-through opacity-60" : ""}`}>{task.text}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                deleteTask(task.id)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <div className="text-xs opacity-60 pt-2 border-t border-white/20">
          {tasks.filter((t) => !t.completed).length} of {tasks.length} remaining
        </div>
      )}
    </div>
  )
}
