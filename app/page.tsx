"use client"

import { useEffect } from "react"

export default function BirthdayPage() {
  useEffect(() => {
    // Redirect to the HTML file
    window.location.href = "/habede/index.html"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <p className="text-rose-400 animate-pulse">Loading birthday surprise...</p>
    </div>
  )
}
