"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { WindowState } from "@/lib/window-types"
import { Music, FileText, Quote, CheckSquare } from "lucide-react"

interface TaskBarProps {
  windows: WindowState[]
  onWindowClick: (id: string) => void
  bringToFront: (id: string) => void
}

const windowIcons: Record<string, React.ReactNode> = {
  music: <Music className="w-4 h-4" />,
  pdf: <FileText className="w-4 h-4" />,
  quotes: <Quote className="w-4 h-4" />,
  progress: <CheckSquare className="w-4 h-4" />,
}

export default function TaskBar({ windows, onWindowClick, bringToFront }: TaskBarProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center"
    >
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-secondary/60 border border-border backdrop-blur-md">
        {windows.map((window) => (
          <button
            key={window.id}
            onClick={() => {
              if (window.isMinimized) {
                onWindowClick(window.id)
              }
              bringToFront(window.id)
            }}
            className={`
              relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${
                window.isMinimized
                  ? "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  : "text-foreground bg-secondary/80"
              }
            `}
          >
            {windowIcons[window.id]}
            <span className="text-xs font-medium">{window.title}</span>
            {!window.isMinimized && (
              <motion.div
                layoutId={`indicator-${window.id}`}
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
