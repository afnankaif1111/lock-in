"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import WindowManager from "@/components/window-manager"
import MusicWindow from "@/components/windows/music-window"
import PDFWindow from "@/components/windows/pdf-window"
import QuotesWindow from "@/components/windows/quotes-window"
import ProgressWindow from "@/components/windows/progress-window"
import TaskBar from "@/components/task-bar"
import type { WindowState } from "@/lib/window-types"

const initialWindows: WindowState[] = [
  {
    id: "music",
    title: "Music",
    x: 40,
    y: 40,
    width: 320,
    height: 200,
    minWidth: 280,
    minHeight: 180,
    isMinimized: false,
    zIndex: 1,
  },
  {
    id: "quotes",
    title: "Quotes",
    x: 400,
    y: 40,
    width: 380,
    height: 220,
    minWidth: 300,
    minHeight: 180,
    isMinimized: false,
    zIndex: 2,
  },
  {
    id: "progress",
    title: "Progress",
    x: 40,
    y: 280,
    width: 400,
    height: 380,
    minWidth: 350,
    minHeight: 320,
    isMinimized: false,
    zIndex: 3,
  },
  {
    id: "pdf",
    title: "Reader",
    x: 480,
    y: 300,
    width: 500,
    height: 400,
    minWidth: 400,
    minHeight: 300,
    isMinimized: false,
    zIndex: 4,
  },
]

export default function Dashboard() {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows)
  const [xp, setXp] = useState(0)

  const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)))
  }, [])

  const bringToFront = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex))
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
    })
  }, [])

  const toggleMinimize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)))
  }, [])

  const addXp = useCallback((amount: number) => {
    setXp((prev) => prev + amount)
  }, [])

  const renderWindow = (windowState: WindowState) => {
    switch (windowState.id) {
      case "music":
        return <MusicWindow />
      case "pdf":
        return <PDFWindow />
      case "quotes":
        return <QuotesWindow />
      case "progress":
        return <ProgressWindow onXpGain={addXp} />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-background overflow-hidden"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.5 0 0) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.5 0 0) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* XP Counter */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border backdrop-blur-sm">
        <div className="relative">
          <div
            className="w-2 h-2 rounded-full bg-primary transition-all duration-500"
            style={{
              boxShadow: xp > 0 ? `0 0 ${Math.min(xp / 10, 20)}px var(--glow)` : "none",
            }}
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground">{xp} XP</span>
      </div>

      {/* Windows */}
      <WindowManager
        windows={windows}
        updateWindow={updateWindow}
        bringToFront={bringToFront}
        renderWindow={renderWindow}
      />

      {/* Task Bar */}
      <TaskBar windows={windows} onWindowClick={toggleMinimize} bringToFront={bringToFront} />
    </motion.div>
  )
}
