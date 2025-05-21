"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"
import { logActivity } from "@/lib/activity-logger"
import type { Category, CategoryFormData } from "@/lib/db/schema"

// Collection name
const COLLECTION_NAME = process.env.MONGODB_CATEGORY_COLLECTION_NAME || "categories"

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const client = await clientPromise
    const db = client.db()
    const categories = await db.collection(COLLECTION_NAME).find({}).toArray()

    return categories.map((category) => ({
      ...category,
      id: category.id.toString(),
      _id: undefined,
    })) as Category[]
  } catch (error) {
    console.error("Failed to get categories:", error)
    return []
  }
}

// Get a category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const client = await clientPromise
    const db = client.db()
    const category = await db.collection(COLLECTION_NAME).findOne({ slug })

    if (!category) return null

    return {
      ...category,
      id: category.id.toString(),
      _id: undefined,
    } as Category
  } catch (error) {
    console.error(`Failed to get category with slug ${slug}:`, error)
    return null
  }
}

// Get a category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const category = await db.collection(COLLECTION_NAME).findOne({ id })

    if (!category) {
      return null
    }

    return {
      ...category,
      id: category.id.toString(),
      _id: undefined,
    } as Category
  } catch (error) {
    console.error(`Failed to get category with ID ${id}:`, error)
    return null
  }
}

// Create a new category
export async function createCategory(
  categoryData: CategoryFormData,
): Promise<{ success: boolean; message: string; category?: Category }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    const client = await clientPromise
    const db = client.db()

    // Check if a category with the same slug already exists
    const existingCategory = await db.collection(COLLECTION_NAME).findOne({ slug: categoryData.slug })
    if (existingCategory) {
      return { success: false, message: "A category with this slug already exists" }
    }

    const newCategory: Category = {
      ...categoryData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(COLLECTION_NAME).insertOne(newCategory)

    // Log the activity
    await logActivity(
      session.user.id,
      session.user.email,
      "create_category",
      `Created category: ${newCategory.name}`,
      newCategory.id,
      "category",
      session.user.role,
    )

    revalidatePath("/products")
    revalidatePath("/admin/categories")

    return { success: true, message: "Category created successfully", category: newCategory }
  } catch (error) {
    console.error("Failed to create category:", error)
    return { success: false, message: "Failed to create category" }
  }
}

// Update an existing category
export async function updateCategory(
  id: string,
  categoryData: CategoryFormData,
): Promise<{ success: boolean; message: string; category?: Category }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    const client = await clientPromise
    const db = client.db()

    // Check if the category exists
    const existingCategory = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!existingCategory) {
      return { success: false, message: "Category not found" }
    }

    // Check if slug is being changed and if it conflicts with another category
    if (
      categoryData.slug !== existingCategory.slug &&
      (await db.collection(COLLECTION_NAME).findOne({ slug: categoryData.slug, id: { $ne: id } }))
    ) {
      return { success: false, message: "A category with this slug already exists" }
    }

    const updatedCategory: Category = {
      ...categoryData,
      id,
      createdAt: existingCategory.createdAt,
      updatedAt: new Date(),
    }

    await db.collection(COLLECTION_NAME).updateOne({ id }, { $set: updatedCategory })

    // Log the activity
    await logActivity(
      session.user.id,
      session.user.email,
      "update_category",
      `Updated category: ${updatedCategory.name}`,
      updatedCategory.id,
      "category",
      session.user.role,
    )

    revalidatePath("/products")
    revalidatePath("/admin/categories")
    revalidatePath(`/admin/categories/${id}`)

    return { success: true, message: "Category updated successfully", category: updatedCategory }
  } catch (error) {
    console.error(`Failed to update category with ID ${id}:`, error)
    return { success: false, message: "Failed to update category" }
  }
}

// Delete a category
export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    const client = await clientPromise
    const db = client.db()

    // Check if the category exists
    const existingCategory = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!existingCategory) {
      return { success: false, message: "Category not found" }
    }

    // Check if there are products using this category
    const productsWithCategory = await db.collection("products").countDocuments({ categoryId: id })
    if (productsWithCategory > 0) {
      return {
        success: false,
        message: `Cannot delete category: ${productsWithCategory} product(s) are using this category. Please reassign these products first.`,
      }
    }

    await db.collection(COLLECTION_NAME).deleteOne({ id })

    // Log the activity
    await logActivity(
      session.user.id,
      session.user.email,
      "delete_category",
      `Deleted category: ${existingCategory.name}`,
      id,
      "category",
      session.user.role,
    )

    revalidatePath("/products")
    revalidatePath("/admin/categories")

    return { success: true, message: "Category deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete category with ID ${id}:`, error)
    return { success: false, message: "Failed to delete category" }
  }
}
