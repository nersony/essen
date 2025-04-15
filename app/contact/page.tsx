"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react"
import { useUmami } from "@/hooks/use-umami" // Add this import
import { TrackClick } from "@/components/track-click" // Add this import

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const { trackEvent } = useUmami() // Add this hook

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Track form submission
    trackEvent("contact_form_submit", { form_type: "general_inquiry" })

    // In a real application, you would handle the form submission here
    setFormSubmitted(true)
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 uppercase text-center">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          We'd love to hear from you! Reach out to us with any questions, or book a visit to our showroom.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Get In Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold">Visit Us</h3>
                      <p className="text-sm text-muted-foreground">
                        <TrackClick eventName="location_click" eventData={{ page: "contact" }}>
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
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold">WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">
                        <TrackClick eventName="contact_method_click" eventData={{ method: "whatsapp", page: "contact" }}>
                          <Link
                            href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                            className="hover:text-primary"
                          >
                            +65 6019 0775
                          </Link>
                        </TrackClick>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold">Email Us</h3>
                      <p className="text-sm text-muted-foreground">
                        <TrackClick eventName="contact_method_click" eventData={{ method: "email", page: "contact" }}>
                          <Link href="mailto:enquiry@essen.sg" className="hover:text-primary">
                            enquiry@essen.sg
                          </Link>
                        </TrackClick>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold">Opening Hours</h3>
                      <p className="text-sm text-muted-foreground">Operating Daily: 11am - 8pm</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-bold mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <TrackClick eventName="social_click" eventData={{ platform: "facebook", page: "contact" }}>
                      <Link
                        href="https://www.facebook.com/p/essensg-61560718696802"
                        className="text-primary hover:text-primary/80"
                      >
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                      </Link>
                    </TrackClick>
                    <TrackClick eventName="social_click" eventData={{ platform: "instagram", page: "contact" }}>
                      <Link href="https://www.instagram.com/essen.sg" className="text-primary hover:text-primary/80">
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                      </Link>
                    </TrackClick>
                    <TrackClick eventName="social_click" eventData={{ platform: "tiktok", page: "contact" }}>
                      <Link href="https://www.tiktok.com/@essen.sg" className="text-primary hover:text-primary/80">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                          <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                          <path d="M15 8v8a4 4 0 0 1-4 4" />
                          <line x1="15" y1="4" x2="15" y2="12" />
                        </svg>
                        <span className="sr-only">TikTok</span>
                      </Link>
                    </TrackClick>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="map-container h-[200px] rounded overflow-hidden">
              <TrackClick eventName="map_interaction" eventData={{ page: "contact" }}>
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
            <TrackClick eventName="cta_click" eventData={{ location: "contact_sidebar", cta_text: "Get Directions" }}>
              <Button asChild size="lg" className="w-full">
                <Link href="/visit-us">
                  <MapPin className="mr-2 h-4 w-4" />
                  Get Directions
                </Link>
              </Button>
            </TrackClick>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">Thank You!</h2>
                    <p className="text-muted-foreground mb-6">
                      We've received your message and will get back to you shortly.
                    </p>
                    <Button onClick={() => {
                      setFormSubmitted(false);
                      trackEvent("form_reset", { form_type: "contact" });
                    }}>Send Another Message</Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-4">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" required
                            onFocus={() => trackEvent("form_field_focus", { field: "firstName", form: "contact" })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" required
                            onFocus={() => trackEvent("form_field_focus", { field: "lastName", form: "contact" })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required
                          onFocus={() => trackEvent("form_field_focus", { field: "email", form: "contact" })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel"
                          onFocus={() => trackEvent("form_field_focus", { field: "phone", form: "contact" })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason for Contact</Label>
                        <RadioGroup defaultValue="inquiry" onChange={(value) => trackEvent("form_selection", { field: "reason", value })}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inquiry" id="inquiry" />
                            <Label htmlFor="inquiry">General Inquiry</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="consultation" id="consultation" />
                            <Label htmlFor="consultation">Book a Consultation</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="feedback" id="feedback" />
                            <Label htmlFor="feedback">Feedback</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Contact Time (if applicable)</Label>
                        <Select onValueChange={(value) => trackEvent("form_selection", { field: "preferredTime", value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (11am - 1pm)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (1pm - 5pm)</SelectItem>
                            <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" size="lg" className="w-full">
                        Submit
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}