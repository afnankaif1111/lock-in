"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pin, RefreshCw } from "lucide-react"

const quotes = [
  { text: "The successful warrior is the average person, with laser-like focus.", author: "Bruce Lee" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  {
    text: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.",
    author: "Socrates",
  },
  { text: "Where focus goes, energy flows.", author: "Tony Robbins" },
  { text: "Starve your distractions, feed your focus.", author: "Unknown" },
  { text: "The main thing is to keep the main thing the main thing.", author: "Stephen Covey" },
  { text: "You can always find a distraction if you're looking for one.", author: "Tom Kite" },
  { text: "Lack of direction, not lack of time, is the problem.", author: "Zig Ziglar" },
  { text: "Energy flows where attention goes.", author: "James Redfield" },
]

export default function QuotesWindow() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isPinned, setIsPinned] = useState(false)
  const [key, setKey] = useState(0)

  const nextQuote = useCallback(() => {
    if (isPinned) return
    setCurrentQuote((prev) => (prev + 1) % quotes.length)
    setKey((prev) => prev + 1)
  }, [isPinned])

  // Auto-rotate every 5 minutes
  useEffect(() => {
    if (isPinned) return
    const interval = setInterval(nextQuote, 5 * 60 * 1000) // 5 minutes
    return () => clearInterval(interval)
  }, [isPinned, nextQuote])

  const quote = quotes[currentQuote]

  return (
    <div className="flex flex-col h-full p-6 items-center justify-center relative">
      {/* Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <button
          onClick={() => setIsPinned(!isPinned)}
          className={`p-1.5 rounded-lg transition-colors ${
            isPinned ? "bg-primary/20 text-primary" : "hover:bg-secondary text-muted-foreground"
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={nextQuote}
          disabled={isPinned}
          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors disabled:opacity-30"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quote */}
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-base leading-relaxed text-foreground text-balance mb-4">&ldquo;{quote.text}&rdquo;</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">— {quote.author}</p>
        </motion.div>
      </AnimatePresence>

      {/* Quote indicator dots */}
      <div className="absolute bottom-4 flex items-center gap-1">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentQuote(i)
              setKey((prev) => prev + 1)
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentQuote ? "bg-primary" : "bg-secondary"}`}
          />
        ))}
      </div>
    </div>
  )
}
