"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { getProducts, getProductsWithFilters } from "@/app/actions/product-actions"
import { Button } from "@/components/ui/button"
import { ProductFilters } from "@/components/product-filters"
import type { Product } from "@/lib/db/schema"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Import the image utility at the top of the file
import { ensureCorrectImagePath } from "@/lib/image-utils"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)

      // Parse filters from URL
      const categoryParam = searchParams.get("category")
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")

      // Parse attribute filters
      const attributeFilters: Record<string, string[]> = {}
      Array.from(searchParams.entries())
        .filter(([key]) => key.startsWith("attr_"))
        .forEach(([key, value]) => {
          const attrName = key.replace("attr_", "")
          attributeFilters[attrName] = value.split(",")
        })

      // Build filter object
      const filters: any = {}

      if (categoryParam) {
        filters.category = categoryParam
      }

      if (minPrice && maxPrice) {
        filters.priceRange = {
          min: Number.parseInt(minPrice),
          max: Number.parseInt(maxPrice),
        }
      }

      if (Object.keys(attributeFilters).length > 0) {
        filters.attributes = attributeFilters
      }

      // Get filtered products or all products if no filters
      const productsData = Object.keys(filters).length > 0 ? await getProductsWithFilters(filters) : await getProducts()

      setProducts(productsData)
      setIsLoading(false)
    }

    fetchProducts()
  }, [searchParams])

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0

    if (searchParams.has("category")) count++
    if (searchParams.has("minPrice") || searchParams.has("maxPrice")) count++

    // Count attribute filters
    Array.from(searchParams.keys())
      .filter((key) => key.startsWith("attr_"))
      .forEach(() => count++)

    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-2 uppercase">Our Furniture Collection</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Discover our curated selection of premium furniture pieces designed to transform your living spaces.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <div className="py-4">
                <ProductFilters />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-md mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
                  <Button asChild variant="outline">
                    <Link href="/products">Clear Filters</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="flex flex-col h-full">
                      <div className="aspect-square relative overflow-hidden mb-4">
                        <Image
                          src={ensureCorrectImagePath(product.images[0] || "/placeholder.svg?height=600&width=600")}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-lg uppercase">{product.name}</h3>
                        <p className="text-muted-foreground text-sm uppercase mb-2">{product.category}</p>
                        <p className="font-medium mb-4">
                          {product.variants && product.variants.length > 0 && product.variants[0].combinations
                            ? (() => {
                                // Filter for in-stock combinations only
                                const inStockCombinations = product.variants[0].combinations.filter((c) => c.inStock)

                                // Get valid prices (ensure they're numbers and greater than 0)
                                const validPrices = inStockCombinations
                                  .map((c) => c.price)
                                  .filter((price) => typeof price === "number" && !isNaN(price) && price > 0)

                                if (validPrices.length > 0) {
                                  return `From $${Math.min(...validPrices).toFixed(2)}`
                                } else {
                                  return "Price upon request"
                                }
                              })()
                            : product.price
                              ? `$${product.price.toFixed(2)}`
                              : "Price upon request"}
                        </p>
                        <Button asChild variant="outline" className="mt-auto">
                          <Link href={`/products/${product.slug}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
