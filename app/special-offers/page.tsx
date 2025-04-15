import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Clock, MapPin } from "lucide-react"

export default function SpecialOffers() {
  const offers = [
    {
      id: 1,
      title: "Weekend Special: 20% Off All Purchases",
      description:
        "Visit our showroom this weekend and enjoy 20% off your entire purchase. Valid on all furniture items.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "May 31, 2024",
      badge: "Limited Time",
    },
    {
      id: 2,
      title: "Free Design Consultation",
      description:
        "Book a free 45-minute consultation with our interior design experts to help plan your perfect space.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "Ongoing",
      badge: "Popular",
    },
    {
      id: 3,
      title: "Buy 2 Get 1 Free: Accent Pillows",
      description: "Purchase any two accent pillows and receive a third one of equal or lesser value for free.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "June 15, 2024",
      badge: "In-Store Only",
    },
    {
      id: 4,
      title: "$50 Off $500 Purchase",
      description: "Present the coupon from our website to receive $50 off any purchase of $500 or more.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "June 30, 2024",
      badge: "With Coupon",
    },
  ]

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Special Offers</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Visit our showroom to take advantage of these exclusive in-store offers and promotions.
        </p>

        <div className="space-y-8">
          {/* Featured Offer */}
          <div className="bg-accent text-accent-foreground p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <Badge className="mb-4 bg-white text-accent">Featured Offer</Badge>
                <h2 className="text-3xl font-bold mb-4">Grand Opening Special</h2>
                <p className="text-lg mb-4">
                  To celebrate our newly renovated showroom, enjoy 30% off your first purchase when you visit us
                  in-store.
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5" />
                  <span>Valid until May 15, 2024</span>
                </div>
                <Button asChild size="lg" className="bg-white text-accent hover:bg-white/90">
                  <Link href="/visit-us">Visit Showroom</Link>
                </Button>
              </div>
              <div>
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Grand Opening Special"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Current Offers */}
          <h2 className="text-2xl font-bold mb-4">Current Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden">
                <div className="aspect-[16/9] relative">
                  <Image src={offer.image || "/placeholder.svg"} alt={offer.title} fill className="object-cover" />
                  {offer.badge && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">{offer.badge}</Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4" />
                    <span>Valid until: {offer.validUntil}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coupon */}
          <div className="bg-secondary p-8 rounded-lg">
            <div className="text-center max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4">Special In-Store Coupon</h2>
              <p className="text-muted-foreground mb-6">
                Show this coupon in-store to receive $50 off your purchase of $500 or more.
              </p>
              <div className="bg-white p-6 rounded-lg">
                <div className="border-2 border-dashed border-primary p-6 rounded">
                  <h3 className="text-2xl font-bold">$50 OFF</h3>
                  <p className="text-sm mt-2">Valid on purchases of $500 or more</p>
                  <p className="text-xs mt-4 text-muted-foreground">
                    Present this coupon at checkout. Valid until June 30, 2024. Cannot be combined with other offers.
                  </p>
                  <div className="mt-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="QR Code"
                      width={100}
                      height={100}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-xs mt-2">Scan to save this offer to your phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Us CTA */}
          <div className="bg-primary text-primary-foreground p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Visit Our Showroom Today</h2>
                <p className="mb-4">
                  Come experience our furniture in person and take advantage of these exclusive in-store offers.
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <Link
                    href="https://maps.app.goo.gl/5YNjVuRRjCyGjNuY7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-foreground/80"
                  >
                    36 Jalan Kilang Barat, Singapore 159366
                  </Link>
                </div>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/visit-us">Get Directions</Link>
                </Button>
              </div>
              <div className="map-container h-[200px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7982326290084!2d103.80229491475403!3d1.2896110990636652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1bd0af54a8c9%3A0x7c70de73c54ea256!2s36%20Jalan%20Kilang%20Barat%2C%20Singapore%20159366!5e0!3m2!1sen!2ssg!4v1650000000000!5m2!1sen!2ssg"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ESSEN Furniture Store Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
