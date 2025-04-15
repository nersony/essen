interface Window {
    // Existing window interfaces
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
    
    // Updated Umami analytics interface
    umami?: {
      track?: (eventName: string, eventData?: Record<string, any>) => void // Legacy v1 method
      trackEvent?: (eventName: string, eventData?: Record<string, any>) => void // Legacy method
      trackView?: (url: string) => void // Legacy method
      
      // Modern v2 method (single function for all tracking)
      track: (
        eventName: string,
        eventData?: Record<string, any>,
        url?: string,
        websiteId?: string
      ) => void
    }
  }