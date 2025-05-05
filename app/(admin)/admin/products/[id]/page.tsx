"use client"
// app/admin/products/[id]/page.tsx
import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import type { Product } from "@/lib/db/schema"

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  console.log('Edit Product Page - Params:', params)

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Get the id from the params
        const id = params.id as string
        console.log('Fetching product with ID:', id)
        
        // Fetch the product data
        const response = await fetch(`/api/admin/products/${id}`)
        
        console.log('Fetch Response Status:', response.status)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Fetched Product Data:', data)
        
        setProduct(data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  if (loading) {
    return <div>Loading product...</div>
  }

  if (error || !product) {
    return <div>Error loading product</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product: {product.name}</h1>
      <ProductForm initialData={product} isEditing />
    </div>
  )
}