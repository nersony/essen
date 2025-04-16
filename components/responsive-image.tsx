"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useMobile } from "@/hooks/use-mobile"

interface ResponsiveImageProps {
  src: string
  alt: string
  mobileHeight?: number
  desktopHeight?: number
  mobileWidth?: number
  desktopWidth?: number
  className?: string
  priority?: boolean
}

export function ResponsiveImage({
  src,
  alt,
  mobileHeight = 300,
  desktopHeight = 500,
  mobileWidth = 400,
  desktopWidth = 800,
  className = "",
  priority = false,
}: ResponsiveImageProps) {
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default to mobile dimensions until client-side code runs
  const height = mounted ? (isMobile ? mobileHeight : desktopHeight) : mobileHeight
  const width = mounted ? (isMobile ? mobileWidth : desktopWidth) : mobileWidth

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      height={height}
      width={width}
      className={className}
      priority={priority}
    />
  )
}
