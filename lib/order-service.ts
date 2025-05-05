import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import type { Order, OrderStatus } from "@/lib/db/schema"
import { ObjectId } from "mongodb"
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from "@/lib/email-service"

// Collection name
const COLLECTION_NAME = "orders"

// Get all orders
export async function getOrders(): Promise<Order[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const orders = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray()

    // Convert MongoDB _id to id if needed
    return orders.map((order) => ({
      ...order,
      id: order._id.toString(),
      _id: undefined,
    })) as Order[]
  } catch (error) {
    console.error("Failed to get orders:", error)
    return []
  }
}

// Get an order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Try multiple search strategies
    let order = null

    // 1. Try finding by string ID
    order = await db.collection(COLLECTION_NAME).findOne({ id: id })

    // 2. If not found, try MongoDB ObjectId
    if (!order) {
      try {
        order = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
      } catch (objectIdError) {
        console.log("Invalid ObjectId format:", objectIdError)
      }
    }

    // 3. Try finding by reference number
    if (!order) {
      order = await db.collection(COLLECTION_NAME).findOne({ referenceNumber: id })
    }

    if (!order) {
      console.error(`No order found with ID: ${id}`)
      return null
    }

    // Normalize the order object
    return {
      ...order,
      id: order.id || order._id.toString(),
      _id: undefined,
    } as Order
  } catch (error) {
    console.error(`Failed to get order with ID ${id}:`, error)
    return null
  }
}

// Get orders by customer email
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const orders = await db.collection(COLLECTION_NAME).find({ customerEmail: email }).sort({ createdAt: -1 }).toArray()

    return orders.map((order) => ({
      ...order,
      id: order._id.toString(),
      _id: undefined,
    })) as Order[]
  } catch (error) {
    console.error(`Failed to get orders for email ${email}:`, error)
    return []
  }
}

// Create a new order
export async function createOrder(
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; message: string; order?: Order }> {
  try {
    const client = await clientPromise
    const db = client.db()

    const newOrder: Order = {
      ...orderData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(COLLECTION_NAME).insertOne(newOrder)

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(newOrder)
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError)
      // Continue with order creation even if email fails
    }

    return { success: true, message: "Order created successfully", order: newOrder }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { success: false, message: "Failed to create order" }
  }
}

// Update order status
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingNumber?: string,
  notes?: string,
): Promise<{ success: boolean; message: string; order?: Order }> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Find the order first
    const existingOrder = await getOrderById(id)
    if (!existingOrder) {
      return { success: false, message: "Order not found" }
    }

    // Prepare update data
    const updateData: Partial<Order> = {
      status,
      updatedAt: new Date(),
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }

    if (notes) {
      updateData.notes = notes
    }

    // Determine the correct filter for update
    const updateFilter = existingOrder._id ? { _id: existingOrder._id } : { id: id }

    await db.collection(COLLECTION_NAME).updateOne(updateFilter, { $set: updateData })

    // Get the updated order
    const updatedOrder = await getOrderById(id)
    if (!updatedOrder) {
      return { success: true, message: "Order status updated but could not retrieve updated order" }
    }

    // Send status update email
    try {
      await sendOrderStatusUpdateEmail(updatedOrder)
    } catch (emailError) {
      console.error("Failed to send order status update email:", emailError)
      // Continue with order update even if email fails
    }

    return {
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    }
  } catch (error) {
    console.error(`Failed to update order status for ID ${id}:`, error)
    return { success: false, message: "Failed to update order status" }
  }
}

// Update order by payment ID (for webhook handling)
export async function updateOrderByPaymentId(
  paymentId: string,
  status: OrderStatus,
): Promise<{ success: boolean; message: string; order?: Order }> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Find the order by payment ID
    const existingOrder = await db.collection(COLLECTION_NAME).findOne({ paymentId })
    if (!existingOrder) {
      return { success: false, message: "Order not found with this payment ID" }
    }

    // Update the order status
    await db.collection(COLLECTION_NAME).updateOne(
      { paymentId },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    // Get the updated order
    const updatedOrder = await db.collection(COLLECTION_NAME).findOne({ paymentId })
    if (!updatedOrder) {
      return { success: true, message: "Order status updated but could not retrieve updated order" }
    }

    const normalizedOrder = {
      ...updatedOrder,
      id: updatedOrder._id.toString(),
      _id: undefined,
    } as Order

    // Send status update email
    try {
      await sendOrderStatusUpdateEmail(normalizedOrder)
    } catch (emailError) {
      console.error("Failed to send order status update email:", emailError)
      // Continue with order update even if email fails
    }

    return {
      success: true,
      message: "Order status updated successfully",
      order: normalizedOrder,
    }
  } catch (error) {
    console.error(`Failed to update order with payment ID ${paymentId}:`, error)
    return { success: false, message: "Failed to update order" }
  }
}

// Get order statistics
export async function getOrderStatistics(): Promise<{
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}> {
  try {
    const client = await clientPromise
    const db = client.db()

    const totalOrders = await db.collection(COLLECTION_NAME).countDocuments()

    const allOrders = await db.collection(COLLECTION_NAME).find({}).toArray()
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0)

    const pendingOrders = await db.collection(COLLECTION_NAME).countDocuments({
      status: { $in: ["pending", "payment_initiated", "paid", "processing"] },
    })

    const completedOrders = await db.collection(COLLECTION_NAME).countDocuments({
      status: "delivered",
    })

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    }
  } catch (error) {
    console.error("Failed to get order statistics:", error)
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
    }
  }
}

export async function getAllOrders(pageSize: number, skip: number): Promise<Order[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const orders = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(pageSize)
      .toArray()

    // Convert MongoDB _id to id if needed
    return orders.map((order) => ({
      ...order,
      id: order._id.toString(),
      _id: undefined,
    })) as Order[]
  } catch (error) {
    console.error("Failed to get orders:", error)
    return []
  }
}

export async function getOrdersCount(): Promise<number> {
  try {
    const client = await clientPromise
    const db = client.db()
    const count = await db.collection(COLLECTION_NAME).countDocuments()
    return count
  } catch (error) {
    console.error("Failed to get orders count:", error)
    return 0
  }
}
