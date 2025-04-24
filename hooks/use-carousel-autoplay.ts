"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { EmblaCarouselType } from "embla-carousel-react"
import AutoplayPlugin from "embla-carousel-autoplay"

interface UseCarouselAutoplayOptions {
  delay?: number
  cooldownPeriod?: number
  enabled?: boolean
  rootNode?: (emblaRoot: HTMLElement) => HTMLElement
}

/**
 * A custom hook that provides autoplay functionality for Embla Carousel
 * with built-in pause on user interaction and automatic resume after cooldown
 */
export function useCarouselAutoplay({
  delay = 5000,
  cooldownPeriod = 5000,
  enabled = true,
  rootNode,
}: UseCarouselAutoplayOptions = {}) {
  // Track if autoplay is currently active
  const [isPlaying, setIsPlaying] = useState(enabled)

  // Store references that persist across renders
  const autoplayPluginRef = useRef<any>(null)
  const autoplayInstanceRef = useRef<any>(null)
  const emblaApiRef = useRef<EmblaCarouselType | null>(null)
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Create the autoplay plugin
  const createPlugin = useCallback(() => {
    if (!enabled) return null

    return AutoplayPlugin(
      {
        delay,
        stopOnInteraction: false, // We'll handle this manually
        stopOnMouseEnter: false, // We'll handle this manually
        stopOnFocusIn: false, // We'll handle this manually
        playOnInit: true,
        rootNode: rootNode || ((emblaRoot) => emblaRoot),
      },
      (autoplayInstance) => {
        // Store the autoplay instance for direct control
        autoplayInstanceRef.current = autoplayInstance
      },
    )
  }, [delay, enabled, rootNode])

  // Initialize the plugin
  if (!autoplayPluginRef.current && enabled) {
    autoplayPluginRef.current = createPlugin()
  }

  // Function to pause autoplay
  const pause = useCallback(() => {
    if (!autoplayInstanceRef.current || !isPlaying) return

    // Stop the autoplay
    autoplayInstanceRef.current.stop()
    setIsPlaying(false)

    // Clear any existing cooldown timer
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current)
      cooldownTimerRef.current = null
    }

    // Set a new cooldown timer
    cooldownTimerRef.current = setTimeout(() => {
      if (autoplayInstanceRef.current && emblaApiRef.current?.canScrollNext()) {
        autoplayInstanceRef.current.play()
        setIsPlaying(true)
      }
    }, cooldownPeriod)
  }, [cooldownPeriod, isPlaying])

  // Function to handle user interaction
  const onUserInteraction = useCallback(() => {
    if (!enabled) return
    pause()
  }, [enabled, pause])

  // Function to set the Embla API reference
  const setEmblaApi = useCallback((api: EmblaCarouselType | null) => {
    emblaApiRef.current = api
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current)
      }
    }
  }, [])

  return {
    plugin: autoplayPluginRef.current,
    isPlaying,
    pause,
    onUserInteraction,
    setEmblaApi,
  }
}
