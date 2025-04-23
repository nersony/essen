import crypto from "crypto"

// HitPay API configuration
const HITPAY_API_KEY = process.env.HITPAY_API_KEY || ""
const HITPAY_SALT = process.env.HITPAY_SALT || ""
const HITPAY_WEBHOOK_SALT = process.env.HITPAY_WEBHOOK_SALT || ""
const HITPAY_API_URL ="https://api.sandbox.hit-pay.com/v1"

// Types for HitPay API
export interface CreatePaymentRequest {
  amount: number
  currency: string
  email?: string
  name?: string
  purpose: string
  reference_number: string
  redirect_url: string
  webhook: string
}

export interface HitPayPaymentResponse {
  id: string
  url: string
  status: string
  reference_number: string
}

/**
 * Create a payment request with HitPay
 */
export async function createPayment(paymentData: CreatePaymentRequest): Promise<HitPayPaymentResponse> {
  try {
    const response = await fetch(`${HITPAY_API_URL}/payment-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-BUSINESS-API-KEY": HITPAY_API_KEY,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: new URLSearchParams(paymentData as any).toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HitPay API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating HitPay payment:", error)
    throw error
  }
}

/**
 * Verify HitPay webhook signature using the webhook salt
 */
export function verifyWebhookHmac(hmacSignature: string, rawBody: string): boolean {
  if (!HITPAY_WEBHOOK_SALT) {
    console.error("HITPAY_WEBHOOK_SALT is not configured")
    return false
  }

  try {
    // Create HMAC using the webhook salt
    const generatedSignature = crypto.createHmac("sha256", HITPAY_WEBHOOK_SALT).update(rawBody).digest("hex")

    // Compare signatures (case insensitive)
    return hmacSignature.toLowerCase() === generatedSignature.toLowerCase()
  } catch (error) {
    console.error("Error verifying webhook HMAC:", error)
    return false
  }
}

/**
 * Verify HitPay payment signature using the payment salt
 * This is used for other operations, not webhooks
 */
export function verifyPaymentHmac(hmacSignature: string, payload: any): boolean {
  if (!HITPAY_SALT) {
    console.error("HITPAY_SALT is not configured")
    return false
  }

  try {
    // Convert payload to string if it's an object
    const payloadString = typeof payload === "string" ? payload : JSON.stringify(payload)

    // Create HMAC using the payment salt
    const generatedSignature = crypto.createHmac("sha256", HITPAY_SALT).update(payloadString).digest("hex")

    // Compare signatures (case insensitive)
    return hmacSignature.toLowerCase() === generatedSignature.toLowerCase()
  } catch (error) {
    console.error("Error verifying payment HMAC:", error)
    return false
  }
}

/**
 * Get payment status from HitPay
 */
export async function getPaymentStatus(paymentId: string): Promise<any> {
  try {
    const response = await fetch(`${HITPAY_API_URL}/payment-requests/${paymentId}`, {
      method: "GET",
      headers: {
        "X-BUSINESS-API-KEY": HITPAY_API_KEY,
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    if (!response.ok) {
      throw new Error(`HitPay API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting payment status:", error)
    throw error
  }
}
