"use client"

import { useEffect, useState, useRef } from "react"
import YouTube from "react-youtube"

interface YouTubeBackgroundProps {
  videoId: string
  className?: string
}

export function YouTubeBackground({ videoId, className = "" }: YouTubeBackgroundProps) {
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
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          pointerEvents: "none",
        }}
      >
        {dimensions.width > 0 && (
          <YouTube
            videoId={videoId}
            opts={{
              width: dimensions.width.toString(),
              height: dimensions.height.toString(),
              playerVars: {
                autoplay: 1,
                mute: 1,
                loop: 1,
                controls: 0,
                showinfo: 0,
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
                enablejsapi: 1,
                playlist: videoId, // required for loop
              },
            }}
            onReady={(event) => {
              const player = event.target
              player.mute()
              player.playVideo()
            }}
            onEnd={(event) => {
              // Additional safety: force restart on end
              event.target.seekTo(0)
              event.target.playVideo()
            }}
            className="youtube-player"
          />
        )}
      </div>
    </div>
  )
}
