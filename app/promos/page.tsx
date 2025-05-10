"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrackClick } from "@/components/track-click" 
import { useUmami } from "@/hooks/use-umami"
import styles from "./styles.module.css"

// Metadata is handled by a separate file in the client component
export const dynamic = 'force-dynamic';

export default function PromosPage() {
  const { trackEvent } = useUmami();
  
  // Track page view with additional data
  useEffect(() => {
    trackEvent("page_viewed", { 
      page: "promos", 
      campaign: "great_singapore_sale", 
      page_type: "promotional" 
    });
  }, [trackEvent]);

  // Track section views using Intersection Observer
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sectionIds = [
      'promo-hero-section', 
      'spin-wheel-section', 
      'product-categories-section', 
      'in-store-promotions-section', 
      'cta-section'
    ];
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          trackEvent("section_viewed", { section: sectionId, page: "promos" });
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.3 });
    
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, [trackEvent]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section */}
      <section id="promo-hero-section" className="w-full">
        <div className="relative w-full">
          <TrackClick eventName="promo_banner_click" eventData={{ banner: "great_singapore_sale" }}>
            <Link href="#spin-wheel-section">
              <Image
                src="https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/Banner1.png"
                alt="ESSEN Great Singapore Sale - Up to 50% OFF"
                width={1200}
                height={600}
                className="w-full h-auto"
                priority
              />
            </Link>
          </TrackClick>
        </div>
      </section>

      {/* Spin the Wheel Section */}
      <section 
        id="spin-wheel-section" 
        className="py-16 bg-white"
        onMouseEnter={() => trackEvent("content_hover", { 
          section: "spin_wheel",
          page: "promos"
        })}
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center md:justify-end">
              <TrackClick 
                eventName="promo_element_click" 
                eventData={{ element: "spin_wheel_image", action: "view" }}
              >
                <div className="relative w-full max-w-[600px] animate-spin-slow">
                  <Image
                    src="https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/Wheel.png"
                    alt="Spin the Wheel & Win Prizes"
                    width={800}
                    height={800}
                  />
                </div>
              </TrackClick>
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
      <section 
        id="product-categories-section" 
        className="py-16 bg-secondary"
      >
        <div className="container">
          <h2 className={styles.promoTitle}>Your One-Stop for Home Essentials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Home Living */}
            <TrackClick 
              eventName="category_click" 
              eventData={{ category: "home_living", page: "promos" }}
            >
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
            </TrackClick>

            {/* Kitchen */}
            <TrackClick 
              eventName="category_click" 
              eventData={{ category: "kitchen", page: "promos" }}
            >
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
            </TrackClick>

            {/* Bathroom */}
            <TrackClick 
              eventName="category_click" 
              eventData={{ category: "bathroom", page: "promos" }}
            >
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
            </TrackClick>

            {/* Lighting */}
            <TrackClick 
              eventName="category_click" 
              eventData={{ category: "lighting", page: "promos" }}
            >
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
            </TrackClick>
          </div>
        </div>
      </section>

      {/* In-Store Promotions Section */}
      <section 
        id="in-store-promotions-section" 
        className="py-16 bg-white"
        onMouseEnter={() => trackEvent("content_hover", { 
          section: "in_store_promotions",
          page: "promos"
        })}
      >
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
            <TrackClick 
              eventName="cta_click" 
              eventData={{ 
                cta: "book_appointment", 
                location: "in_store_promotions",
                method: "whatsapp",
                page: "promos"
              }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link
                  href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20would%20like%20to%20book%20an%20appointment%20for%20the%20Great%20Singapore%20Sale%20promotion."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book an Appointment via WhatsApp
                </Link>
              </Button>
            </TrackClick>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta-section" 
        className="py-16 bg-primary text-white"
        onMouseEnter={() => trackEvent("content_hover", { 
          section: "cta",
          page: "promos"
        })}
      >
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">READY TO TRANSFORM YOUR HOME?</h2>
          <p className="text-xl mb-8">
            Visit our showroom today to experience our furniture collection in person and take advantage of exclusive
            in-store offers.
          </p>
          <TrackClick 
            eventName="cta_click" 
            eventData={{ 
              cta: "get_directions", 
              location: "page_bottom",
              page: "promos"
            }}
          >
            <Button asChild size="lg" variant="outline" className={styles.ctaButton}>
              <Link href="/visit-us">GET DIRECTIONS</Link>
            </Button>
          </TrackClick>
        </div>
      </section>
    </div>
  )
}