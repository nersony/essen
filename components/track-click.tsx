"use client"

import { useUmami } from "@/hooks/use-umami"
import { cloneElement, type ReactElement } from "react"

interface TrackClickProps {
  /**
   * The component to track clicks on
   */
  children: ReactElement
  /**
   * Event name to be tracked in Umami
   */
  eventName: string
  /**
   * Optional data to include with the event
   */
  eventData?: Record<string, any>
}

/**
 * A component that wraps a child component and tracks clicks using Umami
 */
export function TrackClick({ children, eventName, eventData }: TrackClickProps) {
  const { trackEvent } = useUmami()

  const handleClick = (e: React.MouseEvent) => {
    // Call the original onClick if it exists
    if (children.props.onClick) {
      children.props.onClick(e)
    }

    // Track the event
    trackEvent(eventName, eventData)
  }

  // Clone the child element with the new onClick handler
  return cloneElement(children, {
    onClick: handleClick,
  })
}