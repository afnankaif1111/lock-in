"use client"

import { useState } from "react"
import IntroScreen from "@/components/intro-screen"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false)

  if (!hasEntered) {
    return <IntroScreen onEnter={() => setHasEntered(true)} />
  }

  return <Dashboard />
}
