"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"

const tracks = [
  { title: "Midnight Drift", artist: "Lo-Fi Beats", duration: 245 },
  { title: "Rain on Glass", artist: "Ambient Waves", duration: 312 },
  { title: "Focus State", artist: "Study Sessions", duration: 198 },
  { title: "Deep Work", artist: "Concentration FM", duration: 267 },
]

export default function MusicWindow() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const animationRef = useRef<number | null>(null)

  const track = tracks[currentTrack]

  // Generate waveform data
  useEffect(() => {
    const data = Array.from({ length: 32 }, () => Math.random() * 0.8 + 0.2)
    setWaveformData(data)
  }, [currentTrack])

  // Animate waveform when playing
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setWaveformData((prev) => prev.map((v) => Math.max(0.2, Math.min(1, v + (Math.random() - 0.5) * 0.3))))
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  // Progress simulation
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextTrack()
          return 0
        }
        return prev + (100 / track.duration) * 0.5
      })
    }, 500)
    return () => clearInterval(interval)
  }, [isPlaying, track.duration])

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
    setProgress(0)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)
    setProgress(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Waveform visualization */}
      <div className="flex items-end justify-center gap-0.5 h-12">
        {waveformData.map((value, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-primary transition-all duration-150"
            style={{
              height: `${value * 100}%`,
              opacity: isPlaying ? 0.8 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Track info */}
      <div className="text-center">
        <h3 className="text-sm font-medium text-foreground truncate">{track.title}</h3>
        <p className="text-xs text-muted-foreground">{track.artist}</p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground font-mono">
          {formatTime((progress / 100) * track.duration)}
        </span>
        <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{formatTime(track.duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={prevTrack} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <SkipBack className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button onClick={nextTrack} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <SkipForward className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
