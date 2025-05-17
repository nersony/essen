"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { logActivity } from "@/lib/activity-logger"
import type { ProductFormData, Category } from "@/lib/db/schema"
import { v4 as uuidv4 } from "uuid"

// Get categories for import
export async function getCategoriesForImport(): Promise<Category[]> {
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection("categories").find({}).toArray()

    return categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      createdAt: category.createdAt || new Date(),
      updatedAt: category.updatedAt || new Date(),
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw new Error("Failed to fetch categories")
  }
}

// Validate product data
export async function validateProduct(productData: ProductFormData): Promise<{
  valid: boolean
  errors: string[]
}> {
  const errors: string[] = []

  // Check required fields
  if (!productData.name) {
    errors.push("Product name is required")
  }

  if (!productData.category) {
    errors.push("Category is required")
  }

  if (!productData.description) {
    errors.push("Description is required")
  }

  // Check if category exists
  if (productData.category) {
    try {
      const { db } = await connectToDatabase()
      const category = await db.collection("categories").findOne({ name: productData.category })

      if (!category) {
        errors.push(`Category "${productData.category}" does not exist`)
      }
    } catch (error) {
      console.error("Error validating category:", error)
      errors.push("Failed to validate category")
    }
  }

  // Check if slug is unique (if provided)
  if (productData.slug) {
    try {
      const { db } = await connectToDatabase()
      const existingProduct = await db.collection("products").findOne({ slug: productData.slug })

      if (existingProduct) {
        errors.push(`A product with slug "${productData.slug}" already exists`)
      }
    } catch (error) {
      console.error("Error validating slug:", error)
      errors.push("Failed to validate slug uniqueness")
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Check if product exists by slug
export async function checkProductExists(slug: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const existingProduct = await db.collection("products").findOne({ slug })
    return !!existingProduct
  } catch (error) {
    console.error("Error checking product existence:", error)
    return false
  }
}

// Import products
export async function importProducts(
  products: ProductFormData[],
  overwriteExisting = false,
): Promise<{
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
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error("Unauthorized")
    }

    const { db } = await connectToDatabase()
    const results: Array<{
      index: number
      name: string
      success: boolean
      message: string
    }> = []

    let successCount = 0
    let failureCount = 0
    let skippedCount = 0
    let overwrittenCount = 0

    for (let i = 0; i < products.length; i++) {
      const product = products[i]

      try {
        // Check if product exists
        const exists = await checkProductExists(product.slug)

        // Determine if this product should be overwritten
        // If the global overwriteExisting flag is true OR
        // if this specific product was marked for overwrite (it was moved from invalid to valid)
        const shouldOverwrite = overwriteExisting

        if (exists && !shouldOverwrite) {
          // Skip if product exists and overwrite is not enabled
          results.push({
            index: i,
            name: product.name,
            success: false,
            message: `Product with slug "${product.slug}" already exists (skipped)`,
          })
          skippedCount++
          continue
        }

        // Find category ID if not provided
        if (!product.categoryId && product.category) {
          const category = await db.collection("categories").findOne({ name: product.category })
          if (category) {
            product.categoryId = category._id.toString()
          }
        }

        // Prepare product data for MongoDB
        const existingProduct = exists ? await db.collection("products").findOne({ slug: product.slug }) : null

        const productData = {
          ...product,
          _id: exists ? new ObjectId(existingProduct?._id) : new ObjectId(),
          // Ensure we have an id field (UUID) for each product
          id: exists ? existingProduct?.id || uuidv4() : uuidv4(),
          // Preserve existing images if the product exists and is being overwritten
          images: exists ? existingProduct?.images || [] : product.images || [],
          updatedAt: new Date(),
          createdAt: exists ? existingProduct?.createdAt || new Date() : new Date(),
        }

        if (exists && shouldOverwrite) {
          // Update existing product
          await db.collection("products").updateOne({ slug: product.slug }, { $set: productData })

          // Log activity
          await logActivity(
            session.user.id,
            session.user.email,
            "update",
            `Updated product "${product.name}" via import`,
            productData._id.toString(),
            "product",
            session.user.role, // Add the user's role here
          )

          results.push({
            index: i,
            name: product.name,
            success: true,
            message: `Product "${product.name}" updated successfully`,
          })
          overwrittenCount++
        } else {
          // Insert new product
          await db.collection("products").insertOne(productData)

          // Log activity
          await logActivity(
            session.user.id,
            session.user.email,
            "create",
            `Created product "${product.name}" via import`,
            productData._id.toString(),
            "product",
            session.user.role, // Add the user's role here
          )

          results.push({
            index: i,
            name: product.name,
            success: true,
            message: `Product "${product.name}" imported successfully`,
          })
          successCount++
        }
      } catch (error) {
        console.error(`Error importing product ${product.name}:`, error)
        results.push({
          index: i,
          name: product.name,
          success: false,
          message: `Failed to import product: ${error.message}`,
        })
        failureCount++
      }
    }

    // Revalidate products page
    revalidatePath("/admin/products")
    revalidatePath("/products")

    return {
      success: failureCount === 0,
      message: `Import completed: ${successCount} products imported successfully, ${overwrittenCount} overwritten, ${failureCount} failed, ${skippedCount} skipped.`,
      results,
    }
  } catch (error) {
    console.error("Error importing products:", error)
    return {
      success: false,
      message: `Failed to import products: ${error.message}`,
      results: [],
    }
  }
}
