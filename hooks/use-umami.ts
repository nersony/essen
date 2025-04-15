"use client"

import { useCallback } from "react"

export function useUmami() {
  /**
   * Track a custom event with Umami
   * @param eventName Name of the event to track
   * @param eventData Optional data to associate with the event
   */
  const trackEvent = useCallback((eventName: string, eventData?: Record<string, any>) => {
    if (typeof window === "undefined" || !window.umami) return;
    
    // Try the modern v2 method first
    if (typeof window.umami === 'function') {
      window.umami(eventName, eventData);
      return;
    }
    
    // Fall back to older methods if available
    if (window.umami.track) {
      window.umami.track(eventName, eventData);
    } else if (window.umami.trackEvent) {
      window.umami.trackEvent(eventName, eventData);
    } else {
      console.warn('Umami tracking method not found');
    }
  }, [])

  return {
    trackEvent
  }
}