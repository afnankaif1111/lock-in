"use client"

import type React from "react"

import { useRef, useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { WindowState } from "@/lib/window-types"
import { Minus } from "lucide-react"

interface WindowManagerProps {
  windows: WindowState[]
  updateWindow: (id: string, updates: Partial<WindowState>) => void
  bringToFront: (id: string) => void
  renderWindow: (window: WindowState) => React.ReactNode
}

export default function WindowManager({ windows, updateWindow, bringToFront, renderWindow }: WindowManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="absolute inset-0 inset-b-14">
      <AnimatePresence>
        {windows
          .filter((w) => !w.isMinimized)
          .map((window) => (
            <Window
              key={window.id}
              window={window}
              containerRef={containerRef}
              updateWindow={updateWindow}
              bringToFront={bringToFront}
            >
              {renderWindow(window)}
            </Window>
          ))}
      </AnimatePresence>
    </div>
  )
}

interface WindowProps {
  window: WindowState
  containerRef: React.RefObject<HTMLDivElement | null>
  updateWindow: (id: string, updates: Partial<WindowState>) => void
  bringToFront: (id: string) => void
  children: React.ReactNode
}

function Window({ window, containerRef, updateWindow, bringToFront, children }: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, windowX: 0, windowY: 0 })
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".window-controls")) return
      e.preventDefault()
      bringToFront(window.id)
      setIsDragging(true)
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        windowX: window.x,
        windowY: window.y,
      }
    },
    [bringToFront, window.id, window.x, window.y],
  )

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      bringToFront(window.id)
      setIsResizing(true)
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: window.width,
        height: window.height,
      }
    },
    [bringToFront, window.id, window.width, window.height],
  )

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const bounds = containerRef.current.getBoundingClientRect()

      if (isDragging) {
        const deltaX = e.clientX - dragStart.current.x
        const deltaY = e.clientY - dragStart.current.y
        let newX = dragStart.current.windowX + deltaX
        let newY = dragStart.current.windowY + deltaY

        // Keep window inside bounds
        newX = Math.max(0, Math.min(newX, bounds.width - window.width))
        newY = Math.max(0, Math.min(newY, bounds.height - window.height))

        updateWindow(window.id, { x: newX, y: newY })
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x
        const deltaY = e.clientY - resizeStart.current.y
        let newWidth = resizeStart.current.width + deltaX
        let newHeight = resizeStart.current.height + deltaY

        // Apply minimum size constraints
        newWidth = Math.max(window.minWidth, newWidth)
        newHeight = Math.max(window.minHeight, newHeight)

        // Keep within bounds
        newWidth = Math.min(newWidth, bounds.width - window.x)
        newHeight = Math.min(newHeight, bounds.height - window.y)

        updateWindow(window.id, { width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, window, updateWindow, containerRef])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute rounded-xl overflow-hidden"
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
        boxShadow: `
          0 0 0 1px var(--window-border),
          0 4px 30px -4px oklch(0 0 0 / 0.5),
          0 0 40px -10px var(--glow-subtle)
        `,
      }}
      onClick={() => bringToFront(window.id)}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between h-9 px-3 bg-window-header cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{window.title}</span>
        <div className="window-controls flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation()
              updateWindow(window.id, { isMinimized: true })
            }}
            className="p-1 rounded hover:bg-secondary transition-colors"
          >
            <Minus className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className="bg-window-bg overflow-auto" style={{ height: `calc(100% - 36px)` }}>
        {children}
      </div>

      {/* Resize handle */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={handleResizeStart}>
        <svg className="absolute bottom-1 right-1 w-2 h-2 text-muted-foreground/30" viewBox="0 0 6 6">
          <circle cx="5" cy="1" r="0.5" fill="currentColor" />
          <circle cx="5" cy="3" r="0.5" fill="currentColor" />
          <circle cx="5" cy="5" r="0.5" fill="currentColor" />
          <circle cx="3" cy="3" r="0.5" fill="currentColor" />
          <circle cx="3" cy="5" r="0.5" fill="currentColor" />
          <circle cx="1" cy="5" r="0.5" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  )
}
