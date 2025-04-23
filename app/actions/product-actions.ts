"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import type { Product, ProductFormData } from "@/lib/db/schema"
import { ObjectId } from 'mongodb'

// Collection name
const COLLECTION_NAME = "products"

function validateImageUrl(url: string): boolean {
    try {
        // Basic URL validation 
        if (!url) return false;

        // Check if it's a local upload or an external URL
        const isLocalUpload =
            url.startsWith('/uploads/') ||
            url.startsWith('/images/') ||
            url.startsWith('uploads/') ||
            url.startsWith('images/')

        const isExternalUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)

        return isLocalUpload || isExternalUrl
    } catch {
        return false
    }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
    try {
        const client = await clientPromise
        const db = client.db()
        const products = await db.collection(COLLECTION_NAME).find({}).toArray()

        // Convert MongoDB _id to id if needed
        return products.map((product) => ({
            ...product,
            id: product._id.toString(),
            _id: undefined,
        })) as Product[]
    } catch (error) {
        console.error("Failed to get products:", error)
        return []
    }
}

// Get a product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const client = await clientPromise
        const db = client.db()
        const product = await db.collection(COLLECTION_NAME).findOne({ slug })

        if (!product) return null

        return {
            ...product,
            id: product._id.toString(),
            _id: undefined,
        } as Product
    } catch (error) {
        console.error(`Failed to get product with slug ${slug}:`, error)
        return null
    }
}

// Get a product by ID
export async function getProductById(id: string): Promise<Product | null> {
    try {
        const client = await clientPromise
        const db = client.db()

        // Try multiple search strategies
        let product = null

        // 1. Try finding by string ID
        product = await db.collection(COLLECTION_NAME).findOne({ id: id })

        // 2. If not found, try MongoDB ObjectId
        if (!product) {
            try {
                product = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
            } catch (objectIdError) {
                console.log('Invalid ObjectId format:', objectIdError)
            }
        }

        // 3. Fallback: try finding by any ID-like field
        if (!product) {
            const allProducts = await db.collection(COLLECTION_NAME).find({}).toArray()
            product = allProducts.find(p =>
                p.id === id ||
                (p._id && p._id.toString() === id)
            )
        }

        if (!product) {
            console.error(`No product found with ID: ${id}`)
            return null
        }

        // Normalize the product object
        return {
            ...product,
            id: product.id || product._id.toString(),
            _id: undefined,
        } as Product
    } catch (error) {
        console.error(`Failed to get product with ID ${id}:`, error)
        return null
    }
}

// Create a new product
export async function createProduct(
    productData: ProductFormData,
): Promise<{ success: boolean; message: string; product?: Product }> {
    try {
        const client = await clientPromise
        const db = client.db()

        // Validate image URLs
        const validatedImages = productData.images.filter(validateImageUrl)

        if (validatedImages.length === 0) {
            return {
                success: false,
                message: "At least one valid image URL is required"
            }
        }

        // Check if a product with the same slug already exists
        const existingProduct = await db.collection(COLLECTION_NAME).findOne({ slug: productData.slug })
        if (existingProduct) {
            return { success: false, message: "A product with this slug already exists" }
        }

        const newProduct: Product = {
            ...productData,
            images: validatedImages, // Use validated images
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await db.collection(COLLECTION_NAME).insertOne(newProduct)

        revalidatePath("/products")
        revalidatePath("/admin/products")

        return { success: true, message: "Product created successfully", product: newProduct }
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
        const client = await clientPromise
        const db = client.db()

        // Log input for debugging
        console.log('Update Product - Input ID:', id)
        console.log('Product Data:', JSON.stringify(productData, null, 2))

        // Validate image URLs
        const validatedImages = productData.images.filter(validateImageUrl)

        if (validatedImages.length === 0) {
            return {
                success: false,
                message: "At least one valid image URL is required"
            }
        }

        // Try multiple ways to find the product
        let existingProduct = await db.collection(COLLECTION_NAME).findOne({ id })

        // If not found by id, try finding by _id
        if (!existingProduct) {
            try {
                // If using MongoDB ObjectId
                const { ObjectId } = require('mongodb')
                existingProduct = await db.collection(COLLECTION_NAME).findOne({
                    _id: new ObjectId(id)
                })
            } catch (objectIdError) {
                console.error('Error finding product by ObjectId:', objectIdError)
            }
        }

        // Additional logging for debugging
        if (!existingProduct) {
            // Log all products to help diagnose the issue
            const allProducts = await db.collection(COLLECTION_NAME).find({}).toArray()
            console.error('Product Not Found - Debug Info:', {
                searchId: id,
                totalProducts: allProducts.length,
                productIds: allProducts.map(p => p.id || p._id.toString())
            })

            return { success: false, message: "Product not found" }
        }

        // Check if slug is being changed and if it conflicts with another product
        if (
            productData.slug !== existingProduct.slug &&
            (await db.collection(COLLECTION_NAME).findOne({ slug: productData.slug, id: { $ne: id } }))
        ) {
            return { success: false, message: "A product with this slug already exists" }
        }

        const updatedProduct: Product = {
            ...productData,
            images: validatedImages, // Use validated images
            id: existingProduct.id || id, // Ensure we use the correct ID
            createdAt: existingProduct.createdAt,
            updatedAt: new Date(),
        }

        // Determine the correct filter for update
        const updateFilter = existingProduct._id
            ? { _id: existingProduct._id }
            : { id: id }

        await db.collection(COLLECTION_NAME).updateOne(
            updateFilter,
            { $set: updatedProduct }
        )

        revalidatePath("/products")
        revalidatePath(`/products/${productData.slug}`)
        revalidatePath("/admin/products")
        revalidatePath(`/admin/products/${id}`)

        return { success: true, message: "Product updated successfully", product: updatedProduct }
    } catch (error) {
        console.error(`Failed to update product with ID ${id}:`, error)
        return { success: false, message: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
}

// Delete a product
export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
        const client = await clientPromise
        const db = client.db()

        const result = await db.collection(COLLECTION_NAME).deleteOne({ id })

        if (result.deletedCount === 0) {
            return { success: false, message: "Product not found" }
        }

        revalidatePath("/products")
        revalidatePath("/admin/products")

        return { success: true, message: "Product deleted successfully" }
    } catch (error) {
        console.error(`Failed to delete product with ID ${id}:`, error)
        return { success: false, message: "Failed to delete product" }
    }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
    try {
        const client = await clientPromise
        const db = client.db()

        const products = await db
            .collection(COLLECTION_NAME)
            .find({ category: { $regex: new RegExp(category, "i") } })
            .toArray()

        return products.map((product) => ({
            ...product,
            id: product._id.toString(),
            _id: undefined,
        })) as Product[]
    } catch (error) {
        console.error(`Failed to get products in category ${category}:`, error)
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
                name: "LUXORA",
                slug: "luxora",
                category: "Dining",
                price: 2288.0,
                description:
                    "The Luxora dining table combines sleek design with practical functionality. Its tempered glass top and sturdy metal frame create a contemporary aesthetic that complements any dining space.",
                features: [
                    "Tempered glass tabletop",
                    "Sturdy metal frame",
                    "Seats up to 6 people",
                    "Easy assembly",
                    "Scratch-resistant surface",
                ],
                colors: ["Black", "White", "Grey"],
                images: ["/images/luxora.jpg"],
                dimensions: {
                    width: 180,
                    depth: 90,
                    height: 75,
                },
                materials: ["Tempered glass", "Powder-coated steel"],
                careInstructions: ["Wipe clean with a damp cloth", "Avoid abrasive cleaners"],
                deliveryTime: "2-3 weeks",
                returnPolicy: "30-day return policy",
                warranty: "2-year warranty",
                inStock: true,
            },
            {
                name: "VELA",
                slug: "vela",
                category: "Dining",
                price: 1288.0,
                description:
                    "The Vela dining table features a solid wood construction with a natural finish that showcases the beautiful grain patterns. Its timeless design makes it a versatile addition to any dining area.",
                features: [
                    "Solid wood construction",
                    "Natural finish",
                    "Seats up to 4 people",
                    "Sturdy and durable",
                    "Environmentally friendly materials",
                ],
                colors: ["Natural", "Walnut", "Oak"],
                images: ["/images/vela.png"],
                dimensions: {
                    width: 150,
                    depth: 80,
                    height: 75,
                },
                materials: ["Solid oak", "Engineered wood"],
                careInstructions: ["Dust regularly", "Clean spills immediately", "Use coasters for hot items"],
                deliveryTime: "3-4 weeks",
                returnPolicy: "30-day return policy",
                warranty: "3-year warranty",
                inStock: true,
            },
            {
                name: "AEQUUS",
                slug: "aequus",
                category: "Living",
                price: 2688.0,
                description:
                    "The Aequus sofa combines comfort and style with its plush cushions and clean lines. The premium fabric upholstery is both durable and soft to the touch, making it perfect for everyday relaxation.",
                features: [
                    "Premium fabric upholstery",
                    "High-density foam cushions",
                    "Solid wood frame",
                    "Removable and washable covers",
                    "Available in multiple configurations",
                ],
                colors: ["Beige", "Grey", "Blue"],
                images: ["/images/aequus.png"],
                dimensions: {
                    width: 220,
                    depth: 95,
                    height: 85,
                },
                materials: ["Premium fabric", "High-density foam", "Solid wood"],
                careInstructions: ["Vacuum regularly", "Spot clean with mild detergent", "Professional cleaning recommended"],
                deliveryTime: "4-6 weeks",
                returnPolicy: "30-day return policy",
                warranty: "5-year frame warranty",
                inStock: true,
            },
            {
                name: "ECLAT",
                slug: "eclat",
                category: "Bedroom",
                price: 1998.0,
                description:
                    "The Eclat bed frame features a sleek design with a padded headboard for comfort and style. Its sturdy construction ensures durability, while the neutral upholstery complements any bedroom decor.",
                features: [
                    "Padded headboard",
                    "Sturdy wooden slats",
                    "No box spring required",
                    "Easy assembly",
                    "Noise-free design",
                ],
                colors: ["Light Grey", "Dark Grey", "Beige"],
                images: ["/images/eclat.jpg"],
                dimensions: {
                    width: 165,
                    depth: 215,
                    height: 110,
                },
                materials: ["Engineered wood", "Polyester fabric", "Metal supports"],
                careInstructions: ["Vacuum regularly", "Spot clean with mild detergent"],
                deliveryTime: "2-3 weeks",
                returnPolicy: "30-day return policy",
                warranty: "2-year warranty",
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
