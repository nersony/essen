import Link from "next/link"
import { getOrders, getOrderStatistics } from "@/lib/order-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, DollarSign, Clock, CheckCircle } from "lucide-react"

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  const stats = await getOrderStatistics()

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
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="border rounded-md">
          <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
            <div>Order ID</div>
            <div>Customer</div>
            <div>Date</div>
            <div>Total</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {orders.map((order) => (
            <div key={order.id} className="grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0">
              <div className="font-medium">{order.referenceNumber}</div>
              <div>
                <div>{order.customerName}</div>
                <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
              </div>
              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              <div>${order.total.toFixed(2)}</div>
              <div>
                <Badge className={getStatusColor(order.status)}>{formatStatus(order.status)}</Badge>
              </div>
              <div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground mb-4">No orders found.</p>
        </div>
      )}
    </div>
  )
}
