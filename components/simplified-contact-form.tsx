"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { useUmami } from "@/hooks/use-umami" // Add this import

// Type for the form data
export type FormData = {
  name: string
  email: string
  phone: string
  consent: boolean
}

export function SimplifiedContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    consent: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { trackEvent } = useUmami() // Add this hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, consent: checked }))
    if (errors.consent) {
      setErrors((prev) => ({ ...prev, consent: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone) newErrors.phone = "Phone is required"
    if (!formData.consent) newErrors.consent = "You must consent to receive communications"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      trackEvent("form_validation_error", { 
        form_type: "contact",
        errors: Object.keys(errors) 
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create WhatsApp message
      const message = `
*Special In-Store Offer Claim*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

I would like to claim the special in-store offer.
`.trim()

      // Track the form submission before opening WhatsApp
      trackEvent("form_submit", { 
        form_type: "special_offer", 
        method: "whatsapp",
        user_type: "new_lead"
      })

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message)

      // WhatsApp phone number - replace with your business WhatsApp number
      const phoneNumber = "6560190775" // Singapore number format

      // Generate WhatsApp URL
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank")

      // Show success message
      toast({
        title: "Success!",
        description: "WhatsApp is opening with your information. Please send the message to complete your request.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        consent: false,
      })
    } catch (error) {
      console.error("Error processing form:", error)
      
      // Track the error
      trackEvent("form_error", { 
        form_type: "special_offer",
        error: String(error)
      })
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "border-red-500" : ""}
          disabled={isSubmitting}
          onFocus={() => trackEvent("form_field_focus", { field: "name" })}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "border-red-500" : ""}
          disabled={isSubmitting}
          onFocus={() => trackEvent("form_field_focus", { field: "email" })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? "border-red-500" : ""}
          disabled={isSubmitting}
          onFocus={() => trackEvent("form_field_focus", { field: "phone" })}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox
          id="consent"
          checked={formData.consent}
          onCheckedChange={handleCheckboxChange}
          className={errors.consent ? "border-red-500 data-[state=unchecked]:bg-red-50" : ""}
          disabled={isSubmitting}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="consent" className={`text-sm leading-tight ${errors.consent ? "text-red-500" : ""}`}>
            I consent to receiving communications from ESSEN as described in your Privacy Policy. I understand that I
            can opt-out of future communications at any time.
          </Label>
          {errors.consent && <p className="text-red-500 text-xs">{errors.consent}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Claim Now via WhatsApp!"}
      </Button>
    </form>
  )
}