import { NextResponse } from "next/server"
import { createPayment } from "@/lib/hitpay"
import { createOrder } from "@/lib/order-service"
import { v4 as uuidv4 } from "uuid"
import type { CartItem } from "@/context/cart-context"
import type { OrderItem, ShippingAddress } from "@/lib/db/schema"

export async function POST(request: Request) {
  try {
    const { items, customerEmail, customerName, shippingAddress, subtotal, shipping, tax, total } = await request.json()

    // Validate request
    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart items are required" }, { status: 400 })
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json({ error: "Customer information is required" }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    // Generate a unique reference number
    const referenceNumber = `ORDER-${uuidv4().substring(0, 8)}`

    // Create order items from cart items
    const orderItems: OrderItem[] = (items as CartItem[]).map((item) => ({
      productId: item.id,
      productName: item.name,
      productSlug: item.slug,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }))

    // Create payment request
    const paymentData = {
      amount: total.toFixed(2),
      currency: "SGD",
      email: customerEmail,
      name: customerName,
      purpose: `ESSEN Order #${referenceNumber}`,
      reference_number: referenceNumber,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/result`,
      webhook: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/webhook`,
    }

    const paymentResponse = await createPayment(paymentData)

    // Store order in database
    await createOrder({
      customerEmail,
      customerName,
      items: orderItems,
      shippingAddress: shippingAddress as ShippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      status: "payment_initiated",
      paymentId: paymentResponse.id,
      paymentProvider: "hitpay",
      referenceNumber,
    })

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.url,
      referenceNumber,
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
