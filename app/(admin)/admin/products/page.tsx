"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Search, FileUp } from "lucide-react"
import { getProducts } from "@/app/actions/product-actions"
import type { Product } from "@/lib/db/schema"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/admin/products/import">
              <FileUp className="h-4 w-4" />
              Import Products
            </Link>
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product catalog. Add, edit, or remove products from your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? `No products match your search for "${searchTerm}"` : "You haven't added any products yet"}
          </p>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0] || "/placeholder.svg?height=400&width=600"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {product.isWeeklyBestSeller && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">Best Seller</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-1 line-clamp-1">{product.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                <p className="text-sm line-clamp-2 mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant={product.inStock ? "default" : "outline"} className="capitalize">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                    className="flex items-center"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
