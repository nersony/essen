"use server"

import { z } from "zod"
import { Resend } from "resend"

// Initialize Resend instance
const resend = new Resend(process.env.RESEND_API_KEY)

// Define the form schema for validation
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive communications",
  }),
})

// Type for the form data
export type FormData = z.infer<typeof formSchema>

// Type for the response
export type FormResponse = {
  success: boolean
  message: string
}

// Main function to send email using Resend
export async function sendEmail(formData: FormData): Promise<FormResponse> {
  try {
    // Validate form data
    const validatedData = formSchema.parse(formData)

    // Set up email content
    const subject = "Special In-Store Offer Claim"
    const text = `
Name: ${validatedData.name}
Email: ${validatedData.email}
Phone: ${validatedData.phone}
Consent: Yes

This customer would like to claim the special in-store offer.
    `.trim()

    const html = `
<h2>Special In-Store Offer Claim</h2>
<p><strong>Name:</strong> ${validatedData.name}</p>
<p><strong>Email:</strong> ${validatedData.email}</p>
<p><strong>Phone:</strong> ${validatedData.phone}</p>
<p><strong>Consent:</strong> Yes</p>
<p>This customer would like to claim the special in-store offer.</p>
    `.trim()

    // Send email via Resend
    await resend.emails.send({
      from: "ESSEN <noreply@essen.sg>",
      to: ["enquiry@essen.sg"],
      subject,
      text,
      html,
    })

    return {
      success: true,
      message: "Your request has been sent successfully! We will contact you shortly.",
    }
  } catch (error) {
    console.error("Error sending email:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check the form for errors and try again.",
      }
    }

    return {
      success: false,
      message: "Failed to send your request. Please try again or contact us directly.",
    }
  }
}
