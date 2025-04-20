import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarClock, Star, MapPin, Phone } from "lucide-react"
import { GoogleReviewsSection } from "@/components/google-reviews-section"
import { SimplifiedContactForm } from "@/components/simplified-contact-form"

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "VELA",
      image: "/images/vela.png",
      price: "From $1,288.00",
      category: "Dining",
      href: "/product/vela",
    },
    {
      id: 2,
      name: "LUXORA",
      image: "/images/luxora.jpg",
      price: "From $2,288.00",
      category: "Dining",
      href: "/product/luxora",
    },
    {
      id: 3,
      name: "AEQUUS",
      image: "/images/aequus.png",
      price: "From $2,688.00",
      category: "Living",
      href: "/product/aequis",
    },
    {
      id: 4,
      name: "ECLAT",
      image: "/images/eclat.jpg",
      price: "From $1,998.00",
      category: "Bedroom",
      href: "/product/eclat",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="/images/hero-background.png"
          alt="Modern living room with elegant furniture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white pt-16">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl uppercase">Giving You The Power</h1>
          <p className="mt-4 text-2xl sm:text-3xl md:text-4xl uppercase">To Transform Your Home</p>
          <p className="mt-4 text-xl max-w-xl">Just 5 minutes from downtown Singapore</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/visit-us" className="essen-button-secondary bg-white hover:bg-white/90 text-base">
              VIEW MORE
            </Link>
            <Link href="/visit-us" className="essen-button-primary text-base">
              SHOP NOW
            </Link>
          </div>
          <div className="mt-8">
            <div className="limited-time-badge text-base">
              <CalendarClock className="mr-1 h-5 w-5" />
              This Weekend Only: Special Promotions In-Store Purchases
            </div>
          </div>
        </div>
      </section>

      {/* Store Info & Map Section */}
      <section className="py-16">
        <div className="container">
          <div className="essen-section-subtitle">YOUR ESSENTIAL LIVING EXPERT</div>
          <h2 className="essen-section-title mb-12">VISIT OUR SHOWROOM</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Experience our furniture in person and get personalized advice from our design experts.
              </p>
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold">Location</h3>
                  <p className="text-muted-foreground">
                    <Link
                      href="https://maps.app.goo.gl/5YNjVuRRjCyGjNuY7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      36 Jalan Kilang Barat
                      <br />
                      Singapore 159366
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold">Contact</h3>
                  <p className="text-muted-foreground">
                    <Link
                      href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                      className="hover:text-primary"
                    >
                      Whatsapp: +65 6019 0775
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold">Special In-Store Offer</h3>
                  <p className="text-muted-foreground">
                    Book an appointment with our design consultant to receive $50 off your purchase of $500 or more.
                  </p>
                </div>
              </div>
              <div className="flex justify-start mt-6">
                <Link
                  href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                  className="essen-button-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="map-container overflow-hidden rounded-lg border shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7982326290084!2d103.80229491475403!3d1.2896110990636652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1bd0af54a8c9%3A0x7c70de73c54ea256!2s36%20Jalan%20Kilang%20Barat%2C%20Singapore%20159366!5e0!3m2!1sen!2ssg!4v1650000000000!5m2!1sen!2ssg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ESSEN Furniture Store Location"
                className="hover:opacity-95 transition-opacity"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Best Sellers */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="essen-section-subtitle">YOUR ESSENTIAL LIVING EXPERT</div>
          <h2 className="essen-section-title mb-12">WEEKLY BEST SELLERS</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-sm font-medium mt-1">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/visit-us" className="essen-button-primary">
              VIEW MORE
            </Link>
          </div>
        </div>
      </section>

      {/* In-Store Perks Section */}
      <section className="py-16">
        <div className="container">
          <div className="essen-section-subtitle">EXCLUSIVE BENEFITS</div>
          <h2 className="essen-section-title mb-12">IN-STORE EXPERIENCE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                      <line x1="6" x2="6" y1="2" y2="4" />
                      <line x1="10" x2="10" y1="2" y2="4" />
                      <line x1="14" x2="14" y1="2" y2="4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium">Complimentary Refreshments</h3>
                  <p className="text-muted-foreground">
                    Enjoy free coffee, tea, and cookies while you browse our collection and consult with our design
                    experts.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      <path d="M6 8h4" />
                      <path d="M14 8h4" />
                      <path d="M6 12h4" />
                      <path d="M14 12h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium">Free Design Consultation</h3>
                  <p className="text-muted-foreground">
                    Get personalized advice from our interior design experts to create your perfect living space.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                      <line x1="12" y1="17" x2="12" y2="17" />
                      <path d="M16 16h-3" />
                      <path d="M16 12h-7" />
                      <path d="M12 8H9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium">Exclusive Discounts</h3>
                  <p className="text-muted-foreground">
                    In-store customers receive special discounts and promotions not available online.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <Link href="/visit-us" className="essen-button-primary">
              PLAN YOUR VISIT
            </Link>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviewsSection />

      {/* Special Offer Section */}
      <section className="py-16">
        <div className="container">
          <div className="essen-section-subtitle">THIS WEEKEND ONLY</div>
          <h2 className="essen-section-title mb-12">SPECIAL IN-STORE OFFER</h2>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-xl">
              Book an appointment with our design consultant to receive $50 off your purchase of $500 or more.
            </p>
            <div className="border p-6 max-w-md mx-auto">
              <SimplifiedContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold uppercase">Ready to Transform Your Home?</h2>
            <p className="text-xl">
              Visit our showroom today to experience our furniture collection in person and take advantage of exclusive
              in-store offers.
            </p>
            <div className="mt-8">
              <Link href="/visit-us" className="essen-button-secondary bg-white text-primary hover:bg-white/90">
                GET DIRECTIONS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
