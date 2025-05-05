"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"
import { logActivity } from "@/lib/activity-logger"
import type { Product, ProductFormData } from "@/lib/db/schema"
import { validateImageUrls, deleteMultipleFiles } from "@/lib/storage-service"

// Collection name
const COLLECTION_NAME = "products"

// Helper function to properly serialize MongoDB documents
function serializeMongoDocument(doc) {
  if (!doc) return null

  // If already a primitive value, return as is
  if (typeof doc !== "object" || doc === null) return doc

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map((item) => serializeMongoDocument(item))
  }

  // Create a plain object without MongoDB's special properties
  const serialized = {}

  for (const [key, value] of Object.entries(doc)) {
    // Skip MongoDB's internal _id field
    if (key === "_id") continue

    // Skip undefined values
    if (value === undefined) continue

    // Handle nested objects including dates
    if (value !== null && typeof value === "object") {
      if (value instanceof Date) {
        // Convert Date objects to ISO strings
        serialized[key] = value.toISOString()
      } else if (Array.isArray(value)) {
        // Handle nested arrays
        serialized[key] = serializeMongoDocument(value)
      } else if (value.buffer && value.buffer instanceof Buffer) {
        // Handle Buffer objects (common in MongoDB's ObjectId)
        serialized[key] = value.toString()
      } else {
        // Regular nested objects
        serialized[key] = serializeMongoDocument(value)
      }
    } else {
      // Primitive values
      serialized[key] = value
    }
  }

  return serialized
}

// Create a new product
export async function createProduct(
  productData: ProductFormData,
): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    // Validate image URLs
    if (productData.images && productData.images.length > 0) {
      const validationResult = await validateImageUrls(productData.images)
      if (!validationResult.valid) {
        return { success: false, message: validationResult.message || "Invalid image URLs" }
      }
    }

    const client = await clientPromise
    const db = client.db()

    // Check if a product with the same slug already exists
    const existingProduct = await db.collection(COLLECTION_NAME).findOne({ slug: productData.slug })
    if (existingProduct) {
      return { success: false, message: "A product with this slug already exists" }
    }

    // Create a new product
    const newProduct: Product = {
      id: uuidv4(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(COLLECTION_NAME).insertOne(newProduct)

    // Log the activity
    await logActivity(
      session.user.id,
      session.user.email,
      "create_product",
      `Created product: ${newProduct.name}`,
      newProduct.id,
      "product",
      session.user.role,
    )

    revalidatePath("/admin/products")
    revalidatePath("/products")

    // Serialize the product before returning
    return {
      success: true,
      message: "Product created successfully",
      product: serializeMongoDocument(newProduct),
    }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { success: false, message: "Failed to create product" }
  }
}

// Update an existing product
export async function updateProduct(
  id: string,
  productData: ProductFormData,
): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    // Validate image URLs
    if (productData.images && productData.images.length > 0) {
      const validationResult = await validateImageUrls(productData.images)
      if (!validationResult.valid) {
        return { success: false, message: validationResult.message || "Invalid image URLs" }
      }
    }

    const client = await clientPromise
    const db = client.db()

    // Check if the product exists
    const existingProduct = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!existingProduct) {
      return { success: false, message: "Product not found" }
    }

    // Check if another product with the same slug exists
    const duplicateSlug = await db.collection(COLLECTION_NAME).findOne({ slug: productData.slug, id: { $ne: id } })
    if (duplicateSlug) {
      return { success: false, message: "Another product with this slug already exists" }
    }

    // Find images that were removed and should be deleted
    const existingImages = existingProduct.images || []
    const newImages = productData.images || []
    const removedImages = existingImages.filter((img) => !newImages.includes(img))

    // Delete removed images from storage
    if (removedImages.length > 0) {
      console.log(`Deleting ${removedImages.length} removed images for product ${id}`)
      const deleteResult = await deleteMultipleFiles(removedImages)

      if (!deleteResult.success) {
        console.warn(`Failed to delete some images: ${deleteResult.failedUrls.join(", ")}`)
      }
    }

    // Update the product
    const updatedProduct: Product = {
      ...existingProduct,
      ...productData,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    }

    // Remove _id before updating
    delete updatedProduct._id

    await db.collection(COLLECTION_NAME).updateOne({ id }, { $set: updatedProduct })

    // Log the activity
    await logActivity(
      session.user.id,
      session.user.email,
      "update_product",
      `Updated product: ${updatedProduct.name}`,
      updatedProduct.id,
      "product",
      session.user.role,
    )

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${id}`)
    revalidatePath("/products")
    revalidatePath(`/products/${updatedProduct.slug}`)

    // Serialize the product before returning
    return {
      success: true,
      message: "Product updated successfully",
      product: serializeMongoDocument(updatedProduct),
    }
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error)
    return { success: false, message: "Failed to update product" }
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    const client = await clientPromise
    const db = client.db()

    // Check if the product exists
    const existingProduct = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!existingProduct) {
      return { success: false, message: "Product not found" }
    }

    // Get all images associated with the product
    const productImages = existingProduct.images || []

    // Delete the product from the database first
    await db.collection(COLLECTION_NAME).deleteOne({ id })

    // Log the activity
    await logActivity(
      session.user.id,
      session.user.email,
      "delete_product",
      `Deleted product: ${existingProduct.name}`,
      existingProduct.id,
      "product",
      session.user.role,
    )

    // Delete all associated images from storage
    console.log(`Deleting ${productImages.length} images for product ${id}`)
    const deleteResult = await deleteMultipleFiles(productImages)

    // Log the results of image deletion
    if (!deleteResult.success) {
      console.warn(`Failed to delete some images for product ${id}:`, {
        deletedCount: deleteResult.deletedCount,
        failedCount: deleteResult.failedCount,
        failedUrls: deleteResult.failedUrls,
      })

      // Consider sending a notification to the admin about failed image deletions
      // This could be an email, a system notification, or an entry in a separate log
    }

    revalidatePath("/admin/products")
    revalidatePath("/products")

    return {
      success: true,
      message: deleteResult.success
        ? "Product and all associated images deleted successfully"
        : `Product deleted successfully, but ${deleteResult.failedCount} images could not be deleted`,
    }
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error)
    return { success: false, message: "Failed to delete product" }
  }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const client = await clientPromise
    const db = client.db()

    const products = await db.collection(COLLECTION_NAME).find({}).sort({ createdAt: -1 }).toArray()

    // Serialize all products
    return products.map((product) => serializeMongoDocument(product)) as Product[]
  } catch (error) {
    console.error("Failed to get products:", error)
    return []
  }
}

// Get a product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const product = await db.collection(COLLECTION_NAME).findOne({ id })

    if (!product) {
      return null
    }

    // Serialize the product
    return serializeMongoDocument(product) as Product
  } catch (error) {
    console.error(`Failed to get product with ID ${id}:`, error)
    return null
  }
}

// Get a product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const product = await db.collection(COLLECTION_NAME).findOne({ slug })

    if (!product) {
      return null
    }

    // Serialize the product
    return serializeMongoDocument(product) as Product
  } catch (error) {
    console.error(`Failed to get product with slug ${slug}:`, error)
    return null
  }
}

// Get products with filters
export async function getProductsWithFilters(filters: any): Promise<Product[]> {
  try {
    const client = await clientPromise
    const db = client.db()

    const query: any = {}

    if (filters.category) {
      query.category = { $in: filters.category.split(",") }
    }

    if (filters.priceRange) {
      // Create a complex query that checks both legacy price field and variant combinations
      query.$or = [
        // Check prices in variant combinations
        {
          "variants.combinations": {
            $elemMatch: {
              price: {
                $gte: filters.priceRange.min,
                $lte: filters.priceRange.max,
              },
              inStock: true,
            },
          },
        },
      ]
    }

    if (filters.attributes) {
      for (const key in filters.attributes) {
        query[`attributes.${key}`] = { $in: filters.attributes[key] }
      }
    }

    const products = await db.collection(COLLECTION_NAME).find(query).sort({ createdAt: -1 }).toArray()

    // Serialize all products
    return products.map((product) => serializeMongoDocument(product)) as Product[]
  } catch (error) {
    console.error("Failed to get products with filters:", error)
    return []
  }
}

// Seed initial products (for development)
export async function seedInitialProducts(): Promise<{ success: boolean; message: string }> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if products already exist
    const count = await db.collection(COLLECTION_NAME).countDocuments()
    if (count > 0) {
      return { success: true, message: "Products already exist, skipping seed" }
    }

    const initialProducts: ProductFormData[] = [
      {
        name: "Minimalist Wooden Chair",
        slug: "minimalist-wooden-chair",
        category: "Living Room",
        categoryId: "living-room-id",
        price: 79.99,
        description: "A simple and elegant wooden chair for any modern living space.",
        features: ["Durable construction", "Easy to assemble", "Eco-friendly materials"],
        colors: ["Natural Wood", "Black", "White"],
        images: ["/images/vela.png"],
        dimensions: { width: 50, depth: 45, height: 80 },
        materials: ["Wood", "Fabric"],
        careInstructions: ["Wipe clean with a damp cloth"],
        deliveryTime: "5-7 business days",
        returnPolicy: "30-day return policy",
        warranty: "1-year warranty",
        inStock: true,
      },
      {
        name: "Modern Coffee Table",
        slug: "modern-coffee-table",
        category: "Living Room",
        categoryId: "living-room-id",
        price: 149.99,
        description: "A sleek and stylish coffee table to complement your living room decor.",
        features: ["Tempered glass top", "Chrome legs", "Easy to clean"],
        colors: ["Black", "Silver"],
        images: ["/images/aequus.png"],
        dimensions: { width: 120, depth: 60, height: 40 },
        materials: ["Glass", "Metal"],
        careInstructions: ["Wipe clean with glass cleaner"],
        deliveryTime: "7-10 business days",
        returnPolicy: "30-day return policy",
        warranty: "1-year warranty",
        inStock: true,
      },
    ]

    // Add IDs and timestamps
    const productsWithIds = initialProducts.map((product) => ({
      ...product,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await db.collection(COLLECTION_NAME).insertMany(productsWithIds)

    revalidatePath("/products")
    revalidatePath("/admin/products")

    return { success: true, message: "Initial products seeded successfully" }
  } catch (error) {
    console.error("Failed to seed initial products:", error)
    return { success: false, message: "Failed to seed initial products" }
  }
}
