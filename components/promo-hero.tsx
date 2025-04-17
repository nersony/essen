"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "@/components/countdown-timer"

interface PromoHeroProps {
  title: string
  subtitle: string
  description: string
  image: string
  endDate: string
  badge?: string
}

export function PromoHero({ title, subtitle, description, image, endDate, badge }: PromoHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-primary/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {badge && <Badge className="mb-6 px-4 py-1 text-lg bg-white text-primary">{badge}</Badge>}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-2xl md:text-3xl mb-6">{subtitle}</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">{description}</p>

          <div className="mb-8">
            <div className="text-lg mb-2">Offer Ends In:</div>
            <CountdownTimer targetDate={`${endDate}T23:59:59`} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/visit-us">Visit Showroom</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/contact">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
