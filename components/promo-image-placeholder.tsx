"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Card } from "@/components/ui/card"

interface PromoImagePlaceholderProps {
  imageUrl: string
  altText: string
  linkUrl?: string
  width?: number
  height?: number
}

export function PromoImagePlaceholder({
  imageUrl,
  altText,
  linkUrl = "/visit-us",
  width = 600,
  height = 600,
}: PromoImagePlaceholderProps) {
  const [isLoading, setIsLoading] = useState(true)

  const content = (
    <div className="relative w-full overflow-hidden rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <span className="text-muted-foreground">Loading promotion...</span>
        </div>
      )}
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={altText}
        width={width}
        height={height}
        className={`w-full h-auto transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        priority
      />
    </div>
  )

  if (linkUrl) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link href={linkUrl} className="block">
          {content}
        </Link>
      </Card>
    )
  }

  return <Card className="overflow-hidden">{content}</Card>
}
