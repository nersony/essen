import Link from "next/link"
import { getProducts } from "@/app/actions/product-actions"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// Import the image utility at the top of the file
import { ensureCorrectImagePath } from "@/lib/image-utils"

// Helper function to get the formatted price
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

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="border rounded-md">
          <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
            <div>Image</div>
            <div>Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0">
              <div className="w-12 h-12 relative rounded overflow-hidden">
                {/* Update the image source in the product list */}
                <img
                  src={ensureCorrectImagePath(product.images[0] || "/placeholder.svg?height=48&width=48")}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>{product.name}</div>
              <div>{product.category}</div>
              <div>{getFormattedPrice(product)}</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link href={`/admin/products/${product.id}`} className="text-sm text-primary hover:underline">
                  Edit
                </Link>
                <Link
                  href={`/products/${product.slug}`}
                  className="text-sm text-muted-foreground hover:underline"
                  target="_blank"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground mb-4">No products found.</p>
          <Button asChild>
            <Link href="/admin/products/new">Add your first product</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
