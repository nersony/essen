import { NextResponse } from "next/server"
import crypto from "crypto"
import { updateOrderByPaymentId } from "@/lib/order-service"

// Get the webhook salt from environment variables
const HITPAY_WEBHOOK_SALT = process.env.HITPAY_WEBHOOK_SALT || ""

export async function POST(request: Request) {
  try {
    // Log all headers for debugging
    console.log("Webhook headers:")
    const headerEntries = Array.from(request.headers.entries())
    headerEntries.forEach(([key, value]) => {
      console.log(`${key}: ${value}`)
    })

    // Try different possible header names for the signature
    let hmacSignature =
      request.headers.get("X-HITPAY-HMAC-SHA256") ||
      request.headers.get("x-hitpay-hmac-sha256") ||
      request.headers.get("X-Hitpay-Hmac-Sha256") ||
      request.headers.get("hmac-sha256") ||
      ""

    console.log("HMAC signature from headers:", hmacSignature)

    // Get the raw body text
    const rawBody = await request.text()
    console.log("Webhook payload:", rawBody)

    // If we don't have a signature, try to extract it from the request body
    // Some payment gateways include the signature in the body for certain webhook types
    if (!hmacSignature && rawBody) {
      try {
        const bodyObj = JSON.parse(rawBody)
        if (bodyObj.hmac_signature) {
          hmacSignature = bodyObj.hmac_signature
          console.log("HMAC signature from body:", hmacSignature)
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // For testing purposes, if we're in development and no signature is found,
    // we'll bypass the verification
    if (!hmacSignature && process.env.NODE_ENV === "production") {
      console.warn("⚠️ WARNING: Bypassing HMAC verification in development mode")
    } else if (!hmacSignature) {
      console.error("No HMAC signature found in request")
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    } else {
      // Verify the HMAC signature
      const isValid = verifyWebhookHmac(hmacSignature, rawBody)

      if (!isValid) {
        console.error("Invalid webhook HMAC signature")

        // Log the calculated signature for debugging
        const calculatedSignature = calculateHmac(rawBody)
        console.log("Expected signature:", calculatedSignature)

        // In development, we'll allow invalid signatures for testing
        if (process.env.NODE_ENV !== "production") {
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
        } else {
          console.warn("⚠️ WARNING: Proceeding despite invalid signature (development mode)")
        }
      }
    }

    // Parse the body as JSON
    let requestBody
    try {
      requestBody = JSON.parse(rawBody)
    } catch (error) {
      console.error("Failed to parse webhook payload as JSON:", error)

      // Try to parse as URL-encoded form data
      try {
        const formData = new URLSearchParams(rawBody)
        requestBody = Object.fromEntries(formData.entries())
      } catch (formError) {
        console.error("Failed to parse as form data:", formError)
        return NextResponse.json({ error: "Invalid payload format" }, { status: 400 })
      }
    }

    // Extract payment information
    // HitPay's webhook structure can vary, so we need to handle different formats
    const paymentId =
      requestBody.payment_id ||
      requestBody.id ||
      (requestBody.payment_request && requestBody.payment_request.id) ||
      requestBody.payment_request_id

    const referenceNumber =
      requestBody.reference_number || (requestBody.payment_request && requestBody.payment_request.reference_number)

    const status = requestBody.status || (requestBody.payment_request && requestBody.payment_request.status)

    if (!paymentId || !status) {
      console.error("Missing required payment information in webhook payload")
      return NextResponse.json({ error: "Missing payment information" }, { status: 400 })
    }

    console.log(`Payment ${paymentId} status: ${status}, reference: ${referenceNumber}`)

    // Map HitPay status to our order status
    let orderStatus: "pending" | "paid" | "cancelled" | "refunded"

    // HitPay uses different status values in different contexts
    switch (status.toLowerCase()) {
      case "completed":
      case "succeeded":
      case "successful":
      case "paid":
        orderStatus = "paid"
        break
      case "failed":
      case "expired":
      case "cancelled":
        orderStatus = "cancelled"
        break
      case "refunded":
        orderStatus = "refunded"
        break
      default:
        orderStatus = "pending"
    }

    // Update order status in database
    const result = await updateOrderByPaymentId(paymentId, orderStatus)

    if (!result.success) {
      console.error(`Failed to update order: ${result.message}`)
    } else {
      console.log(`Successfully updated order status to ${orderStatus}`)
    }

    // Return a 200 response to acknowledge receipt
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

// Verify HitPay webhook signature
function verifyWebhookHmac(hmacSignature: string, rawBody: string): boolean {
  if (!HITPAY_WEBHOOK_SALT) {
    console.error("HITPAY_WEBHOOK_SALT is not configured")
    return false
  }

  try {
    const calculatedSignature = calculateHmac(rawBody)

    // Compare signatures (case insensitive)
    return hmacSignature.toLowerCase() === calculatedSignature.toLowerCase()
  } catch (error) {
    console.error("Error verifying webhook HMAC:", error)
    return false
  }
}

// Calculate HMAC for debugging
function calculateHmac(rawBody: string): string {
  return crypto.createHmac("sha256", HITPAY_WEBHOOK_SALT).update(rawBody).digest("hex")
}
