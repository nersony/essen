import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarClock, ArrowRight } from "lucide-react"

interface PromoCardProps {
  title: string
  description: string
  image: string
  validUntil: string
  badge?: string
  color?: string
  compact?: boolean
}

export function PromoCard({
  title,
  description,
  image,
  validUntil,
  badge,
  color = "bg-primary",
  compact = false,
}: PromoCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <div className={compact ? "grid grid-cols-1" : "grid grid-cols-1"}>
        <div className="relative aspect-[16/9]">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          {badge && <Badge className={`absolute top-4 right-4 ${color} text-white`}>{badge}</Badge>}
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <CalendarClock className="h-4 w-4 mr-2" />
            <span>Valid until: {validUntil}</span>
          </div>
          <Button asChild className="w-full">
            <Link href="/visit-us">
              Claim Offer <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
