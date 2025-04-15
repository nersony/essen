"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

interface AnalyticsProps {
  websiteId: string
  umamiUrl?: string
}

export function Analytics({ websiteId, umamiUrl = "https://analytics.umami.is/script.js" }: AnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    // Only attempt to track if we're in the browser
    if (typeof window === 'undefined' || !pathname) return;
    
    // Get the full URL with search params
    const url = searchParams?.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname
      
    // Wait for umami to load and track page view
    const trackPageView = () => {
      if (!window.umami) return;
      
      // Try to detect which version of umami is loaded
      if (typeof window.umami === 'function') {
        // Modern v2 umami
        window.umami('pageview', { url });
      } else if (window.umami.trackView) {
        // Legacy method
        window.umami.trackView(url);
      } else if (window.umami.track) {
        // Alternative legacy method
        window.umami.track('pageview', { url });
      }
    };
    
    // Check if umami is already loaded
    if (window.umami) {
      trackPageView();
    } else {
      // If not, set up a listener for when the script loads
      const handleUmamiLoad = () => {
        trackPageView();
      };
      
      document.addEventListener('umami.load', handleUmamiLoad);
      
      return () => {
        document.removeEventListener('umami.load', handleUmamiLoad);
      };
    }
  }, [pathname, searchParams])

  return (
    <Script
      async
      defer
      data-website-id={websiteId}
      src={umamiUrl}
      data-cache="true"
      data-domains={typeof window !== "undefined" ? window.location.hostname : ""}
      onLoad={() => {
        // Dispatch an event when umami loads
        document.dispatchEvent(new Event('umami.load'));
      }}
    />
  )
}