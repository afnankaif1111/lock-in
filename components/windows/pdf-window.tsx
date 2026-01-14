"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, Upload, ZoomIn, ZoomOut, Pencil, FileText } from "lucide-react"

interface Slide {
  id: number
  content: string
  type: "title" | "content" | "image"
}

const mockSlides: Slide[] = [
  { id: 1, content: "Deep Work Principles", type: "title" },
  {
    id: 2,
    content:
      "Rule #1: Work Deeply\n\nThe ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.",
    type: "content",
  },
  {
    id: 3,
    content: "Rule #2: Embrace Boredom\n\nDon't take breaks from distraction. Instead take breaks from focus.",
    type: "content",
  },
  {
    id: 4,
    content:
      "Rule #3: Quit Social Media\n\nThe deep life is not for everybody. It requires hard work and drastic changes to your habits.",
    type: "content",
  },
  {
    id: 5,
    content: "Rule #4: Drain the Shallows\n\nSchedule every minute of your day. Quantify the depth of every activity.",
    type: "content",
  },
]

export default function PDFWindow() {
  const [slides, setSlides] = useState<Slide[]>(mockSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [isDrawMode, setIsDrawMode] = useState(false)
  const [hasFile, setHasFile] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const slide = slides[currentSlide]

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mock file handling - in real app, parse PDF/PPT
      setHasFile(true)
    }
  }, [])

  if (!hasFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="p-4 rounded-full bg-secondary">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-foreground mb-1">No file loaded</h3>
          <p className="text-xs text-muted-foreground mb-4">Upload a PDF or PPT to start reading</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm">Upload File</span>
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx" onChange={handleFileUpload} className="hidden" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <span className="text-xs text-muted-foreground">
          {currentSlide + 1} / {slides.length}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsDrawMode(!isDrawMode)}
            className={`p-1.5 rounded transition-colors ${
              isDrawMode ? "bg-primary/20 text-primary" : "hover:bg-secondary text-muted-foreground"
            }`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Slide content */}
      <div
        className="flex-1 flex items-center justify-center p-6 overflow-auto"
        style={{
          cursor: isDrawMode ? "crosshair" : "default",
        }}
      >
        <div
          className="w-full max-w-lg aspect-[4/3] rounded-lg bg-card border border-border p-8 flex items-center justify-center transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {slide.type === "title" ? (
            <h1 className="text-2xl font-semibold text-foreground text-center">{slide.content}</h1>
          ) : (
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{slide.content}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-2 py-3 border-t border-border">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Slide indicators */}
        <div className="flex items-center gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide ? "bg-primary w-4" : "bg-secondary hover:bg-muted"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx" onChange={handleFileUpload} className="hidden" />
    </div>
  )
}
