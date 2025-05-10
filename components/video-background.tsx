"use client"

import { useEffect, useRef, useState } from "react"

interface VideoBackgroundProps {
  videoSrc: string
  className?: string
}

export function VideoBackground({ videoSrc, className = "" }: VideoBackgroundProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const calculateDimensions = () => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const containerHeight = containerRef.current.offsetHeight
    const aspectRatio = 16 / 9

    let width, height

    if (containerWidth / containerHeight > aspectRatio) {
      width = containerWidth * 1.2
      height = width / aspectRatio
    } else {
      height = containerHeight * 1.2
      width = height * aspectRatio
    }

    setDimensions({ width, height })
  }

  useEffect(() => {
    calculateDimensions()
    window.addEventListener("resize", calculateDimensions)
    return () => window.removeEventListener("resize", calculateDimensions)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
      }}
    >
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
    </div>
  )
}