"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarClock } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function MobileFirstHero() {
  const isMobile = useMobile()

  return (
    <section className="relative overflow-hidden">
      {/* Adjust height based on device - shorter on mobile */}
      <div className="relative h-[60vh] md:h-[80vh]">
        <Image
          src="/images/hero-background.png"
          alt="Modern living room with elegant furniture"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={isMobile ? 80 : 90} // Lower quality on mobile for faster loading
        />
        <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          {/* Smaller text on mobile */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase">
            Giving You The Power
          </h1>
          <p className="mt-2 md:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase">To Transform Your Home</p>
          <p className="mt-2 md:mt-4 text-base md:text-xl max-w-xl">Just 5 minutes from downtown Singapore</p>

          {/* Stack buttons on mobile, side by side on desktop */}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md">
            <Link href="/visit-us" className="w-full">
              <Button variant="secondary" className="w-full">
                VIEW MORE
              </Button>
            </Link>
            <Link href="/visit-us" className="w-full">
              <Button className="w-full">SHOP NOW</Button>
            </Link>
          </div>

          {/* Smaller badge on mobile */}
          <div className="mt-6 md:mt-8">
            <div className="limited-time-badge">
              <CalendarClock className="mr-1 h-4 w-4 md:h-5 md:w-5" />
              This Weekend Only: Special Promotions
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
