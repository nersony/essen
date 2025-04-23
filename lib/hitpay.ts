import crypto from "crypto"

// HitPay API configuration
const HITPAY_API_KEY = process.env.HITPAY_API_KEY || ""
const HITPAY_SALT = process.env.HITPAY_SALT || ""
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
 * Verify HitPay webhook signature
 */
export function verifyHmac(hmacSignature: string, requestBody: any): boolean {
  const generatedSignature = crypto.createHmac("sha256", HITPAY_SALT).update(JSON.stringify(requestBody)).digest("hex")

  return hmacSignature === generatedSignature
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
