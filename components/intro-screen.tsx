"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroScreenProps {
  onEnter: () => void
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleEnter = () => {
    setIsExiting(true)
    setTimeout(onEnter, 800)
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Subtle radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/30 via-background to-background" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary animate-ping opacity-30" />
              </div>
              <span className="text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase">LOCK-IN</span>
            </motion.div>

            {/* Main Quote */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-foreground max-w-2xl text-balance"
            >
              We are so back to the zone.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-muted-foreground text-base sm:text-lg tracking-wide"
            >
              Built for introverts. Tuned for ADHD.
            </motion.p>

            {/* Enter Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              onClick={handleEnter}
              className="group relative mt-8 px-8 py-3 rounded-full bg-secondary border border-border text-foreground text-sm font-medium tracking-wider uppercase transition-all hover:bg-secondary/80 hover:border-primary/30"
            >
              <span className="relative z-10">Enter</span>
              {/* Pulse animation */}
              <span className="absolute inset-0 rounded-full animate-pulse bg-primary/5" />
            </motion.button>
          </div>

          {/* Bottom attribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="absolute bottom-8 text-xs text-muted-foreground/50 tracking-widest uppercase"
          >
            A Focus Environment
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
