import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getProducts } from "@/app/actions/product-actions"
import { getUsers } from "@/lib/user-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react"

// Helper function to get formatted price
function getFormattedPrice(product: any) {
  // Check if the product has variants with combinations
  if (
    product.variants &&
    product.variants.length > 0 &&
    product.variants[0].combinations &&
    product.variants[0].combinations.length > 0
  ) {
    // Filter out combinations that are in stock and have valid numeric prices
    const inStockCombinations = product.variants[0].combinations.filter(
      (combo: any) => combo.inStock && !isNaN(Number.parseFloat(combo.price)) && Number.parseFloat(combo.price) > 0,
    )

    if (inStockCombinations.length > 0) {
      // Get the minimum price from in-stock combinations
      const prices = inStockCombinations.map((combo: any) => Number.parseFloat(combo.price))
      const minPrice = Math.min(...prices)

      if (!isNaN(minPrice) && minPrice > 0) {
        return `From $${minPrice.toFixed(2)}`
      }
    }
  }

  // Fallback to base price if available and valid
  if (!isNaN(Number.parseFloat(product.price)) && Number.parseFloat(product.price) > 0) {
    return `$${Number.parseFloat(product.price).toFixed(2)}`
  }

  // If no valid price is found
  return "Price upon request"
}

export default async function AdminDashboard() {
  // Get the current user session
  const session = await getServerSession(authOptions)

  const products = await getProducts()
  const users = session?.user?.role === "super_admin" ? await getUsers() : []

  // In a real app, you would fetch this data from your database
  const stats = {
    totalProducts: products.length,
    totalUsers: users.length,
    totalOrders: 0,
    totalRevenue: 0,
  }

  // Check if user is super admin
  const isSuperAdmin = session?.user?.role === "super_admin"

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalProducts > 0 ? "+1 from last month" : "No change from last month"}
            </p>
          </CardContent>
        </Card>

        {isSuperAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? `${stats.totalUsers} active users` : "No users yet"}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">No revenue yet</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Products</h2>

        {products.length > 0 ? (
          <div className="border rounded-md">
            <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
              <div>Image</div>
              <div>Name</div>
              <div>Category</div>
              <div>Price</div>
              <div>Actions</div>
            </div>

            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="grid grid-cols-5 gap-4 p-4 items-center border-b last:border-0">
                <div className="w-12 h-12 relative rounded overflow-hidden">
                  <img
                    src={product.images[0] || "/placeholder.svg?height=48&width=48"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>{product.name}</div>
                <div>{product.category}</div>
                <div>{getFormattedPrice(product)}</div>
                <div>
                  <Link href={`/admin/products/${product.id}`} className="text-sm text-primary hover:underline">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground mb-4">No products found.</p>
            <Link href="/admin/products/new" className="text-primary hover:underline">
              Add your first product
            </Link>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products/new" className="border rounded-md p-4 hover:bg-secondary transition-colors">
            <h3 className="font-medium">Add New Product</h3>
            <p className="text-sm text-muted-foreground">Create a new product listing</p>
          </Link>

          <Link href="/admin/categories/new" className="border rounded-md p-4 hover:bg-secondary transition-colors">
            <h3 className="font-medium">Add New Category</h3>
            <p className="text-sm text-muted-foreground">Create a new category</p>
          </Link>

          <Link href="/admin/users/new" className="border rounded-md p-4 hover:bg-secondary transition-colors">
            <h3 className="font-medium">Add New User</h3>
            <p className="text-sm text-muted-foreground">Create a new user</p>
          </Link>

          {isSuperAdmin && (
            <Link href="/admin/logs" className="border rounded-md p-4 hover:bg-secondary transition-colors">
              <h3 className="font-medium">View Activity Logs</h3>
              <p className="text-sm text-muted-foreground">Monitor admin activity</p>
            </Link>
          )}

          {/* <Link href="/admin/settings" className="border rounded-md p-4 hover:bg-secondary transition-colors">
            <h3 className="font-medium">Settings</h3>
            <p className="text-sm text-muted-foreground">Configure store settings</p>
          </Link> */}
        </div>
      </div>
    </div>
  )
}
