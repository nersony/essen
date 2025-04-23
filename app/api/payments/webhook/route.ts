import { NextResponse } from "next/server"
import { verifyHmac } from "@/lib/hitpay"
import { updateOrderByPaymentId } from "@/lib/order-service"

export async function POST(request: Request) {
  try {
    // Get the HMAC signature from the header
    const hmacSignature = request.headers.get("X-HITPAY-HMAC-SHA256") || ""

    // Parse the request body
    const requestBody = await request.json()

    // Verify the HMAC signature
    const isValid = verifyHmac(hmacSignature, requestBody)

    if (!isValid) {
      console.error("Invalid HMAC signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Process the webhook payload
    const { payment_id, payment_request_id, reference_number, status } = requestBody

    console.log(`Payment ${payment_id} status: ${status}`)

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
    const result = await updateOrderByPaymentId(payment_id, orderStatus)

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
