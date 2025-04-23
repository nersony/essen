"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { updateOrderStatus } from "@/app/actions/order-actions"
import type { Order, OrderStatus } from "@/lib/db/schema"

interface OrderStatusFormProps {
  order: Order
}

export function OrderStatusForm({ order }: OrderStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "")
  const [notes, setNotes] = useState(order.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateOrderStatus(order.id, status, trackingNumber, notes)

      if (result.success) {
        toast({
          title: "Order Updated",
          description: "The order status has been updated successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Update Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)} disabled={isSubmitting}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="payment_initiated">Payment Initiated</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trackingNumber">Tracking Number</Label>
        <Input
          id="trackingNumber"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this order"
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Order"}
      </Button>
    </form>
  )
}
