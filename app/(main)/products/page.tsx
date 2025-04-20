"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getProducts, seedInitialProducts } from "@/app/actions/product-actions"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/db/schema"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      // Seed initial products if none exist (for development)
      await seedInitialProducts()

      // Get all products
      const allProducts = await getProducts()
      setProducts(allProducts)

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(allProducts.map((product) => product.category))).sort()
      setCategories(uniqueCategories)

      setFilteredProducts(allProducts)
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  // Filter products by category
  const filterByCategory = (category: string) => {
    setSelectedCategory(category)
    if (category === "All") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === category))
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-2 uppercase">Our Furniture Collection</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
        Discover our curated selection of premium furniture pieces designed to transform your living spaces.
      </p>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b">
        <button
          onClick={() => filterByCategory("All")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === "All"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => filterByCategory(category)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-md mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col h-full">
              <div className="aspect-square relative overflow-hidden mb-4">
                <Image
                  src={product.images[0] || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-lg uppercase">{product.name}</h3>
                <p className="text-muted-foreground text-sm uppercase mb-2">{product.category}</p>
                <p className="font-medium mb-4">From ${product.price.toFixed(2)}</p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found in this category.</p>
          <Button onClick={() => filterByCategory("All")}>View All Products</Button>
        </div>
      )}
    </div>
  )
}
