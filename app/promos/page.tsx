import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Metadata } from "next"
import styles from "./styles.module.css"

export const metadata: Metadata = {
  title: "Great Singapore Sale | ESSEN Promotions",
  description:
    "Enjoy up to 50% off during ESSEN's Great Singapore Sale. Spin the wheel to win exciting prizes, explore exclusive in-store promotions, and transform your home.",
  alternates: {
    canonical: "https://essen.sg/promos",
  },
  openGraph: {
    title: "Great Singapore Sale | ESSEN Promotions",
    description:
      "Enjoy up to 50% off during ESSEN's Great Singapore Sale. Spin the wheel to win exciting prizes and explore exclusive in-store promotions.",
    url: "https://essen.sg/promos",
    images: [
      {
        url: "https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/Banner1.png",
        width: 1200,
        height: 630,
        alt: "ESSEN Great Singapore Sale",
      },
    ],
  },
  twitter: {
    title: "Great Singapore Sale | ESSEN Promotions",
    description:
      "Enjoy up to 50% off during ESSEN's Great Singapore Sale. Spin the wheel to win exciting prizes and explore exclusive in-store promotions.",
    images: ["https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/Banner1.png"],
  },
}

export default function PromosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section */}
      <section className="w-full">
        <div className="relative w-full">
          <Image
            src="https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/Banner1.png"
            alt="ESSEN Great Singapore Sale - Up to 50% OFF"
            width={1200}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Spin the Wheel Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-[600px] animate-spin-slow">
                <Image
                  src="https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/Wheel.png"
                  alt="Spin the Wheel & Win Prizes"
                  width={800}
                  height={800}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">🎡 Spin the Wheel & Win!</h2>
              <p className="text-lg">
                Make ANY PURCHASE at Essen and get a chance to spin the wheel for exciting rewards!
              </p>
              <p className="text-lg">
                Stand to win instant vouchers, exclusive goodie bags, stylish bathroom accessories, and more.
              </p>
              <p className="text-lg font-semibold">
                💥 Spend $5,000 or more to unlock our Premium Prize Wheel — with chances to win up to $500 OFF!
              </p>
              <p className="text-sm text-muted-foreground italic">
                *Essen reserves the right to determine the prize based on stock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className={styles.promoTitle}>Your One-Stop for Home Essentials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Home Living */}
            <div>
              <Card className="overflow-hidden border-0 shadow-md h-full">
                <div className="relative aspect-square">
                  <Image
                    src="https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/home-living.jpg"
                    alt="Home Living"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-xl font-bold text-primary">HOME LIVING</h3>
                </CardContent>
              </Card>
            </div>

            {/* Kitchen */}
            <div>
              <Card className="overflow-hidden border-0 shadow-md h-full">
                <div className="relative aspect-square">
                  <Image
                    src="https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/kitchen.png"
                    alt="Kitchen"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-xl font-bold text-primary">KITCHEN</h3>
                </CardContent>
              </Card>
            </div>

            {/* Bathroom */}
            <div>
              <Card className="overflow-hidden border-0 shadow-md h-full">
                <div className="relative aspect-square">
                  <Image
                    src="https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/bathroom.jpg"
                    alt="Bathroom"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-xl font-bold text-primary">BATHROOM</h3>
                </CardContent>
              </Card>
            </div>

            {/* Lighting */}
            <div>
              <Card className="overflow-hidden border-0 shadow-md h-full">
                <div className="relative aspect-square">
                  <Image
                    src="https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/lighting.png"
                    alt="Lighting"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-xl font-bold text-primary">LIGHTING</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* In-Store Promotions Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">🛋️ Exclusive In-Store Promotions</h2>
          <p className="text-lg mb-4">
            Enjoy up to 50% off selected items, special deals on sofas, sinks, shower sets, and more!
          </p>
          <p className="text-lg mb-6">
            Come down to our showroom and speak to our team to discover what's in store — only during this Great
            Singapore Sale season.
          </p>
          <p className="text-xl font-semibold">📍 Visit us today and don't miss out!</p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link
                href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20would%20like%20to%20book%20an%20appointment%20for%20the%20Great%20Singapore%20Sale%20promotion."
                target="_blank"
                rel="noopener noreferrer"
              >
                Book an Appointment via WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">READY TO TRANSFORM YOUR HOME?</h2>
          <p className="text-xl mb-8">
            Visit our showroom today to experience our furniture collection in person and take advantage of exclusive
            in-store offers.
          </p>
          <Button asChild size="lg" variant="outline" className={styles.ctaButton}>
            <Link href="/visit-us">GET DIRECTIONS</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
