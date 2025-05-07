"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { logActivity } from "@/lib/activity-logger"
import type { ProductFormData, Category } from "@/lib/db/schema"
import { createProduct } from "./product-actions"
import { getCategories } from "./category-actions"

// Get all categories for the import process
export async function getCategoriesForImport(): Promise<Category[]> {
  try {
    return await getCategories()
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

// Import products from validated data
export async function importProducts(products: ProductFormData[]): Promise<{
  success: boolean
  message: string
  results: Array<{
    index: number
    name: string
    success: boolean
    message: string
  }>
}> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized",
        results: [],
      }
    }

    // Track results for each product
    const results = []

    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i]

      try {
        // Create the product
        const result = await createProduct(product)

        results.push({
          index: i,
          name: product.name,
          success: result.success,
          message: result.message,
        })
      } catch (error) {
        console.error(`Error importing product at index ${i}:`, error)
        results.push({
          index: i,
          name: product.name || `Product ${i + 1}`,
          success: false,
          message: `Error: ${error.message}`,
        })
      }
    }

    // Log the activity
    await logActivity(
      session.user.id,
      session.user.email,
      "import_products",
      `Imported ${results.filter((r) => r.success).length} products`,
      "",
      "product",
      session.user.role,
    )

    revalidatePath("/admin/products")
    revalidatePath("/products")

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return {
      success: successCount > 0,
      message: `Successfully imported ${successCount} products. ${failureCount > 0 ? `Failed to import ${failureCount} products.` : ""}`,
      results,
    }
  } catch (error) {
    console.error("Failed to import products:", error)
    return {
      success: false,
      message: `Failed to import products: ${error.message}`,
      results: [],
    }
  }
}

// Validate a single product
export async function validateProduct(product: ProductFormData): Promise<{
  valid: boolean
  errors: string[]
}> {
  const errors: string[] = []

  // Check required fields
  if (!product.name) errors.push("Name is required")
  if (!product.slug) errors.push("Slug is required")
  if (!product.category) errors.push("Category is required")
  if (!product.description) errors.push("Description is required")

  // Check for duplicate slug
  try {
    const client = await clientPromise
    const db = client.db()

    const existingProduct = await db.collection("products").findOne({ slug: product.slug })
    if (existingProduct) {
      errors.push(`A product with the slug "${product.slug}" already exists`)
    }
  } catch (error) {
    errors.push(`Error checking for duplicate slug: ${error.message}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
