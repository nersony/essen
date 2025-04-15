"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Phone, Car, Train, Bus } from "lucide-react"
import { InstagramEmbed } from "@/components/instagram-embed"
import { TrackClick } from "@/components/track-click" // Add this import
import { useUmami } from "@/hooks/use-umami" // Add this import
import { useEffect } from "react" // Add this import

export default function VisitUs() {
  const { trackEvent } = useUmami(); // Add this hook
  
  // Track page view with additional data
  useEffect(() => {
    trackEvent("page_viewed", { page: "visit_us", page_type: "showroom" });
  }, [trackEvent]);

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 uppercase text-center">Visit Our Showroom</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          We'd love to welcome you to our showroom where you can experience our furniture collection in person and
          receive personalized advice from our design experts.
        </p>

        <div className="space-y-8">
          {/* Location and Hours */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xl font-bold">Location</h3>
                      <p className="text-muted-foreground">
                        <TrackClick eventName="location_click" eventData={{ page: "visit_us" }}>
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
                        </TrackClick>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xl font-bold">Opening Hours</h3>
                      <p className="text-muted-foreground">Operating Daily: 11am-8pm</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xl font-bold">Contact</h3>
                      <p className="text-muted-foreground">
                        Whatsapp:{" "}
                        <TrackClick eventName="contact_method_click" eventData={{ method: "whatsapp", page: "visit_us" }}>
                          <Link
                            href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                            className="hover:text-primary"
                          >
                            +65 6019 0775
                          </Link>
                        </TrackClick>
                        <br />
                        Email:{" "}
                        <TrackClick eventName="contact_method_click" eventData={{ method: "email", page: "visit_us" }}>
                          <Link href="mailto:enquiry@essen.sg" className="hover:text-primary">
                            enquiry@essen.sg
                          </Link>
                        </TrackClick>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="map-container h-full">
                  <TrackClick eventName="map_interaction" eventData={{ page: "visit_us" }}>
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
                  </TrackClick>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Here */}
          <div>
            <h2 className="text-2xl font-bold mb-4 uppercase">Getting Here</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card onMouseEnter={() => trackEvent("section_viewed", { section: "transportation", option: "car" })}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-bold">By Car</h3>
                      <p className="text-sm text-muted-foreground">Parking Available at Essen</p>
                    </div>
                  </CardContent>
                </Card>
                <Card onMouseEnter={() => trackEvent("section_viewed", { section: "transportation", option: "mrt" })}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Train className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-bold">By MRT</h3>
                      <p className="text-sm text-muted-foreground">10-min walk from Redhill MRT Station (EW18)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card onMouseEnter={() => trackEvent("section_viewed", { section: "transportation", option: "bus" })}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold">By Bus</h3>
                    <p className="text-sm text-muted-foreground">
                      Stop at Blk 1 (Stop ID: 10139) or Opp Blk 28 (Stop ID: 10111) along Jalan Bukit Merah
                    </p>
                    <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 w-full mt-2">
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">14</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">123</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">147</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">153</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">196</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">197</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">198</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">855</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">961</div>
                      <div className="bg-green-500 text-white text-center py-1 rounded-md">961M</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What to Expect */}
          <div>
            <h2 className="text-2xl font-bold mb-4 uppercase">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-4">
                <div className="mx-auto md:mx-0">
                  <InstagramEmbed url="https://www.instagram.com/reel/DFkPkrWtB8J/" />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">When you visit our showroom, you'll experience:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                      1
                    </span>
                    <span>A welcoming atmosphere with complimentary refreshments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                      2
                    </span>
                    <span>Our complete furniture collection arranged in lifestyle settings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                      3
                    </span>
                    <span>Personalized assistance from our design consultants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                      4
                    </span>
                    <span>Exclusive in-store promotions and discounts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5">
                      5
                    </span>
                    <span>Material and fabric samples to help with your decision</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Book a Consultation */}
          <div className="bg-secondary p-6">
            <h2 className="text-2xl font-bold mb-4 uppercase text-center">Book a Design Consultation</h2>
            <p className="text-muted-foreground mb-6 text-center">
              For a more personalized experience, book a free 45-minute consultation with one of our design experts and
              receive $50 off your purchase of $500 or more.
            </p>
            <div className="text-center">
              <TrackClick eventName="cta_click" eventData={{ location: "visit_us", cta_text: "BOOK CONSULTATION" }}>
                <Link href="/contact" className="essen-button-primary">
                  BOOK CONSULTATION
                </Link>
              </TrackClick>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}