import { NextResponse } from "next/server"
import { verifyWebhookHmac } from "@/lib/hitpay"
import { updateOrderByPaymentId } from "@/lib/order-service"

export async function POST(request: Request) {
  try {
    // Get the HMAC signature from the header
    const hmacSignature = request.headers.get("X-HITPAY-HMAC-SHA256") || ""

    // Get the raw body text for HMAC verification
    const rawBody = await request.text()

    // Log the raw webhook payload for debugging
    console.log("Webhook payload:", rawBody)
    console.log("HMAC signature:", hmacSignature)

    // Verify the HMAC signature with the webhook salt
    const isValid = verifyWebhookHmac(hmacSignature, rawBody)

    if (!isValid) {
      console.error("Invalid webhook HMAC signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse the body as JSON after verification
    let requestBody
    try {
      requestBody = JSON.parse(rawBody)
    } catch (error) {
      console.error("Failed to parse webhook payload as JSON:", error)

      // Try to parse as URL-encoded form data
      const formData = new URLSearchParams(rawBody)
      requestBody = Object.fromEntries(formData.entries())
    }

    // Process the webhook payload
    const { payment_id, payment_request_id, reference_number, status } = requestBody

    console.log(`Payment ${payment_id || payment_request_id} status: ${status}`)

    // Map HitPay status to our order status
    let orderStatus: "pending" | "paid" | "cancelled" | "refunded"

    switch (status) {
      case "completed":
        orderStatus = "paid"
        break
      case "failed":
      case "expired":
        orderStatus = "cancelled"
        break
      case "refunded":
        orderStatus = "refunded"
        break
      default:
        orderStatus = "pending"
    }

    // Update order status in database
    const paymentIdToUse = payment_id || payment_request_id
    const result = await updateOrderByPaymentId(paymentIdToUse, orderStatus)

    if (!result.success) {
      console.error(`Failed to update order: ${result.message}`)
    }

    // Return a 200 response to acknowledge receipt
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
