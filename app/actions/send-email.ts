"use server"

import nodemailer from "nodemailer"
import { z } from "zod"

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

// Function to create email transporter
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

// Main function to send email
export async function sendEmail(formData: FormData): Promise<FormResponse> {
  try {
    // Validate form data
    const validatedData = formSchema.parse(formData)

    // Create email transporter
    const transporter = createTransporter()

    // Set up email options
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: "enquiry@essen.sg", // Your business email
      subject: "Special In-Store Offer Claim",
      text: `
Name: ${validatedData.name}
Email: ${validatedData.email}
Phone: ${validatedData.phone}
Consent: Yes

This customer would like to claim the special in-store offer.
      `.trim(),
      html: `
<h2>Special In-Store Offer Claim</h2>
<p><strong>Name:</strong> ${validatedData.name}</p>
<p><strong>Email:</strong> ${validatedData.email}</p>
<p><strong>Phone:</strong> ${validatedData.phone}</p>
<p><strong>Consent:</strong> Yes</p>
<p>This customer would like to claim the special in-store offer.</p>
      `.trim(),
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return {
      success: true,
      message: "Your request has been sent successfully! We will contact you shortly.",
    }
  } catch (error) {
    console.error("Error sending email:", error)

    if (error instanceof z.ZodError) {
      // Return validation errors
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
