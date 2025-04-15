import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrackClick } from "@/components/track-click" // Add this import

export function Footer() {
  return (
    <footer>
      <div className="border-t">
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <TrackClick eventName="logo_click" eventData={{ location: "footer" }}>
                <div style={{ width: "180px", height: "48px", position: "relative" }}>
                  <Image
                    src="/images/essen-header-logo.png"
                    alt="ESSEN - Your Essential Living Expert"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                    unoptimized
                  />
                </div>
              </TrackClick>
              <p className="text-sm text-muted-foreground">
                Your Essential Living Expert. Premium furniture for every space in your home.
              </p>
              <div className="flex space-x-4">
                <TrackClick eventName="social_click" eventData={{ platform: "facebook" }}>
                  <Link
                    href="https://www.facebook.com/p/essensg-61560718696802"
                    className="text-primary hover:text-primary/80"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                </TrackClick>
                <TrackClick eventName="social_click" eventData={{ platform: "instagram" }}>
                  <Link href="https://www.instagram.com/essen.sg" className="text-primary hover:text-primary/80">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </TrackClick>
                <TrackClick eventName="social_click" eventData={{ platform: "tiktok" }}>
                  <Link href="https://www.tiktok.com/@essen.sg" className="text-primary hover:text-primary/80">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 32 32"
                      fill="currentColor"
                      stroke="none"
                      strokeWidth="0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"></path>
                    </svg>
                    <span className="sr-only">TikTok</span>
                  </Link>
                </TrackClick>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium uppercase">Visit Our Showroom</h3>
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <TrackClick eventName="location_click" eventData={{ location: "footer" }}>
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
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Operating Daily: 11am-8pm</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium uppercase">Terms and Conditions</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <TrackClick eventName="footer_link_click" eventData={{ link: "warranty" }}>
                    <Link href="/terms/warranty" className="text-muted-foreground hover:text-primary">
                      Warranty
                    </Link>
                  </TrackClick>
                </li>
                <li>
                  <TrackClick eventName="footer_link_click" eventData={{ link: "faq" }}>
                    <Link href="/terms/faq" className="text-muted-foreground hover:text-primary">
                      FAQ
                    </Link>
                  </TrackClick>
                </li>
                <li>
                  <TrackClick eventName="footer_link_click" eventData={{ link: "delivery_information" }}>
                    <Link href="/terms/delivery-information" className="text-muted-foreground hover:text-primary">
                      Delivery Information
                    </Link>
                  </TrackClick>
                </li>
                <li>
                  <TrackClick eventName="footer_link_click" eventData={{ link: "return_policy" }}>
                    <Link href="/terms/return-policy" className="text-muted-foreground hover:text-primary">
                      Return Policy
                    </Link>
                  </TrackClick>
                </li>
                <li>
                  <TrackClick eventName="footer_link_click" eventData={{ link: "cancellation_policy" }}>
                    <Link href="/terms/cancellation-policy" className="text-muted-foreground hover:text-primary">
                      Cancellation Policy
                    </Link>
                  </TrackClick>
                </li>
                <li>
                  <TrackClick eventName="footer_link_click" eventData={{ link: "disposal_service" }}>
                    <Link href="/terms/disposal-service" className="text-muted-foreground hover:text-primary">
                      Disposal Service
                    </Link>
                  </TrackClick>
                </li>
                <li>
                  <TrackClick eventName="footer_link_click" eventData={{ link: "free_storage" }}>
                    <Link href="/terms/free-storage" className="text-muted-foreground hover:text-primary">
                      Free Storage
                    </Link>
                  </TrackClick>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium uppercase">Contact</h3>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary" />
                <TrackClick eventName="contact_method_click" eventData={{ method: "whatsapp_footer" }}>
                  <Link
                    href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Whatsapp: +65 6019 0775
                  </Link>
                </TrackClick>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <TrackClick eventName="contact_method_click" eventData={{ method: "email" }}>
                  <Link href="mailto:enquiry@essen.sg" className="text-sm text-muted-foreground hover:text-primary">
                    enquiry@essen.sg
                  </Link>
                </TrackClick>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium uppercase mb-2">Newsletter</h3>
                <div className="space-y-2">
                  <Input type="email" placeholder="Email" className="bg-white" />
                  <TrackClick eventName="newsletter_signup" eventData={{ location: "footer" }}>
                    <Button className="w-full">JOIN OUR COMMUNITY</Button>
                  </TrackClick>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} ESSEN. All rights reserved.
            <span className="mx-2">|</span>
            <TrackClick eventName="footer_link_click" eventData={{ link: "terms_of_use" }}>
              <Link href="/terms-of-use" className="hover:underline">
                Terms of Use
              </Link>
            </TrackClick>
            <span className="mx-2">|</span>
            <TrackClick eventName="footer_link_click" eventData={{ link: "privacy_policy" }}>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </TrackClick>
          </p>
        </div>
      </div>
    </footer>
  )
}