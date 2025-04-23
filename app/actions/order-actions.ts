"use server"

import { revalidatePath } from "next/cache"
import { updateOrderStatus as updateOrderStatusService } from "@/lib/order-service"
import type { OrderStatus } from "@/lib/db/schema"

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingNumber?: string,
  notes?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await updateOrderStatusService(id, status, trackingNumber, notes)

    if (result.success) {
      // Revalidate relevant paths
      revalidatePath("/admin/orders")
      revalidatePath(`/admin/orders/${id}`)

      return { success: true, message: "Order status updated successfully" }
    } else {
      return { success: false, message: result.message }
    }
  } catch (error) {
    console.error("Error updating order status:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
