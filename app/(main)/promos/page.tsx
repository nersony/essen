import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"
import { PromoHero } from "@/components/promo-hero"
import { PromoCard } from "@/components/promo-card"
import { SimplifiedContactForm } from "@/components/simplified-contact-form"
import { PromoImagePlaceholder } from "@/components/promo-image-placeholder"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Promotions | Limited Time Furniture Deals",
  description:
    "Explore current promotions and limited-time deals on premium furniture at ESSEN Singapore. Seasonal offers, discounts, and special packages available.",
  alternates: {
    canonical: "https://essen.sg/promos",
  },
  openGraph: {
    title: "Promotions | Limited Time Furniture Deals at ESSEN",
    description:
      "Explore current promotions and limited-time deals on premium furniture at ESSEN Singapore. Seasonal offers, discounts, and special packages available.",
    url: "https://essen.sg/promos",
    images: [
      {
        url: "/images/essen-promos-og.jpg",
        width: 1200,
        height: 630,
        alt: "ESSEN Singapore Promotions",
      },
    ],
  },
  twitter: {
    title: "Promotions | Limited Time Furniture Deals at ESSEN",
    description:
      "Explore current promotions and limited-time deals on premium furniture at ESSEN Singapore. Seasonal offers, discounts, and special packages available.",
    images: ["/images/essen-promos-twitter.jpg"],
  },
}

export default function PromosPage() {
  // Current featured promotion (could be fetched from a CMS in a real implementation)
  const featuredPromo = {
    title: "Year-End Clearance Sale",
    subtitle: "Up to 50% Off Selected Items",
    description:
      "Make room for our new 2024 collection with incredible savings on floor models and last season's inventory.",
    image: "/placeholder.svg?height=600&width=1200",
    endDate: "2023-12-31", // YYYY-MM-DD format
    badge: "Limited Time",
  }

  // Seasonal promotions
  const seasonalPromos = [
    {
      id: 1,
      title: "Christmas Special",
      description:
        "Get a free accent pillow with any sofa purchase. Perfect for adding a festive touch to your living room.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "December 25, 2023",
      badge: "Seasonal",
      color: "bg-red-600",
    },
    {
      id: 2,
      title: "New Year New Home",
      description:
        "Start the new year with a fresh look. 20% off all living room packages when you purchase 3 or more items.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "January 31, 2024",
      badge: "Coming Soon",
      color: "bg-blue-600",
    },
  ]

  // Regular promotions
  const regularPromos = [
    {
      id: 1,
      title: "First-Time Customer Discount",
      description: "New to ESSEN? Enjoy 10% off on selected items when you visit our showroom.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "Ongoing",
      badge: "New Customers",
    },
    {
      id: 2,
      title: "Refer-a-Friend Program",
      description: "Refer a friend and both of you will receive $50 off your next purchase of $500 or more.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "Ongoing",
      badge: "Referral",
    },
    {
      id: 3,
      title: "Interior Design Consultation",
      description:
        "Book a free 45-minute consultation with our interior design experts to help plan your perfect space.",
      image: "/placeholder.svg?height=300&width=500",
      validUntil: "Ongoing",
      badge: "Service",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Current Featured Promotion */}
      <PromoHero
        title={featuredPromo.title}
        subtitle={featuredPromo.subtitle}
        description={featuredPromo.description}
        image={featuredPromo.image}
        endDate={featuredPromo.endDate}
        badge={featuredPromo.badge}
      />

      {/* Current Featured Promotion Image */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="essen-section-subtitle">FEATURED PROMOTION</div>
          <h2 className="essen-section-title mb-12">LABOUR DAY SPECIAL</h2>
          <div className="max-w-3xl mx-auto">
            <PromoImagePlaceholder
              imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-16%20at%205.40.41%20PM-exvVJgIhXgUo28drdS0FUqakJbashS.jpeg"
              altText="Labour Day Sale - Bathroom Shower Set $399, was $699. Receive $100 ESSEN voucher."
              linkUrl="/visit-us"
              width={800}
              height={800}
            />
            <div className="mt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Visit our showroom to take advantage of this limited-time offer. Valid until May 5, 2025.
              </p>
              <Button asChild>
                <Link href="/visit-us">Claim This Offer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Promotions */}
      <section className="py-16">
        <div className="container">
          <div className="essen-section-subtitle">LIMITED TIME OFFERS</div>
          <h2 className="essen-section-title mb-12">SEASONAL PROMOTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seasonalPromos.map((promo) => (
              <PromoCard
                key={promo.id}
                title={promo.title}
                description={promo.description}
                image={promo.image}
                validUntil={promo.validUntil}
                badge={promo.badge}
                color={promo.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Regular Promotions */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="essen-section-subtitle">ALWAYS AVAILABLE</div>
          <h2 className="essen-section-title mb-12">ONGOING PROMOTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularPromos.map((promo) => (
              <PromoCard
                key={promo.id}
                title={promo.title}
                description={promo.description}
                image={promo.image}
                validUntil={promo.validUntil}
                badge={promo.badge}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Notification Signup */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Never Miss a Promotion</h2>
            <p className="text-xl mb-8">
              Sign up to receive exclusive promotions and be the first to know about our special offers.
            </p>
            <div className="bg-white p-6 rounded-lg text-foreground">
              <SimplifiedContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">How do I redeem a promotion?</h3>
                <p className="text-muted-foreground">
                  Simply visit our showroom and mention the promotion to our staff. For online exclusive promotions,
                  you'll need to provide the coupon code at checkout.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">Can promotions be combined?</h3>
                <p className="text-muted-foreground">
                  Unless specifically stated, promotions cannot be combined with other offers or discounts.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">Do promotions apply to all products?</h3>
                <p className="text-muted-foreground">
                  Most promotions apply to regular-priced items only, unless otherwise specified. Clearance items,
                  display models, and custom orders may be excluded.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">How often do you run promotions?</h3>
                <p className="text-muted-foreground">
                  We run seasonal promotions throughout the year, with special offers during major holidays. We also
                  have ongoing promotions available year-round.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center mb-4">
              <Tag className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Ready to Save?</h2>
            <p className="text-xl text-muted-foreground">
              Visit our showroom today to take advantage of these exclusive offers and transform your home for less.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="essen-button-primary">
                <Link href="/visit-us">Visit Showroom</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
