"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Check, Sparkles } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface Task {
  id: string
  text: string
  completed: boolean
}

interface ProgressWindowProps {
  onXpGain: (amount: number) => void
}

// Generate mock monthly data
const generateMonthlyData = () => {
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    tasks: Math.floor(Math.random() * 8) + 1,
  }))
  return days
}

export default function ProgressWindow({ onXpGain }: ProgressWindowProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Morning meditation", completed: false },
    { id: "2", text: "Deep work session", completed: false },
    { id: "3", text: "Review notes", completed: false },
  ])
  const [newTask, setNewTask] = useState("")
  const [monthlyData] = useState(generateMonthlyData)
  const [showXpAnimation, setShowXpAnimation] = useState<string | null>(null)

  const addTask = useCallback(() => {
    if (!newTask.trim()) return
    setTasks((prev) => [...prev, { id: Date.now().toString(), text: newTask.trim(), completed: false }])
    setNewTask("")
  }, [newTask])

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id && !task.completed) {
            // Award XP on completion
            onXpGain(10)
            setShowXpAnimation(id)
            setTimeout(() => setShowXpAnimation(null), 1000)
            return { ...task, completed: true }
          }
          return task
        }),
      )
    },
    [onXpGain],
  )

  const completedCount = tasks.filter((t) => t.completed).length
  const completionPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Today&apos;s Focus</h3>
          <p className="text-xs text-muted-foreground">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              className="h-full bg-primary"
              style={{
                boxShadow: completionPercent > 0 ? "0 0 8px var(--glow)" : "none",
              }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">{Math.round(completionPercent)}%</span>
        </div>
      </div>

      {/* Add task */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="flex-1 px-3 py-2 text-sm bg-secondary rounded-lg border border-transparent focus:border-primary/30 focus:outline-none placeholder:text-muted-foreground"
        />
        <button onClick={addTask} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-auto space-y-2 min-h-0">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${task.completed ? "bg-primary/5 border border-primary/10" : "bg-secondary hover:bg-secondary/80"}
              `}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`
                  w-5 h-5 rounded flex items-center justify-center border transition-all
                  ${
                    task.completed
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  }
                `}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              <span
                className={`flex-1 text-sm transition-all ${
                  task.completed ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {task.text}
              </span>

              {/* XP animation */}
              <AnimatePresence>
                {showXpAnimation === task.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-3 top-0 flex items-center gap-1 text-primary text-xs font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    +10 XP
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Monthly graph */}
      <div className="pt-2 border-t border-border">
        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Monthly Progress</h4>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                tickFormatter={(value) => (value % 7 === 1 ? value : "")}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
