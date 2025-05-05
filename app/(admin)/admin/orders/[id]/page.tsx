import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getOrderById } from "@/lib/order-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderStatusForm } from "@/components/order-status-form"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await getOrderById(params.id)

  if (!order) {
    notFound()
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      payment_initiated: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    }

    return statusColors[status] || "bg-gray-100 text-gray-800"
  }

  // Function to format status for display
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/orders" className="text-primary hover:underline flex items-center mb-2">
            &larr; Back to Orders
          </Link>
          <h1 className="text-3xl font-bold">Order #{order.referenceNumber}</h1>
        </div>
        <Badge className={`${getStatusColor(order.status)} text-base px-3 py-1`}>{formatStatus(order.status)}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 py-3 border-b last:border-0">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={item.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.productName}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.productSlug}`} className="font-medium hover:text-primary">
                        {item.productName}
                      </Link>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${order.subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>${order.shipping.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>${order.tax.toFixed(2)}</p>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state && `, ${order.shippingAddress.state}`} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle>Tracking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Tracking Number: {order.trackingNumber}</p>
              </CardContent>
            </Card>
          )}

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Customer and Order Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{order.paymentProvider === "hitpay" ? "HitPay" : order.paymentProvider}</p>
                </div>
                {order.paymentId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="font-medium">{order.paymentId}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusForm order={order} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
