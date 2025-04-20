import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/db/schema"
import bcrypt from "bcryptjs"

// Collection name
const COLLECTION_NAME = "users"

// Get a user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection(COLLECTION_NAME).findOne({ email })

    if (!user) return null

    return {
      ...user,
      id: user._id.toString(),
      _id: undefined,
    } as User
  } catch (error) {
    console.error(`Failed to get user with email ${email}:`, error)
    return null
  }
}

// Create a new user
export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if a user with the same email already exists
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ email: userData.email })
    if (existingUser) {
      return null
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const newUser: User = {
      ...userData,
      password: hashedPassword,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(COLLECTION_NAME).insertOne(newUser)

    return newUser
  } catch (error) {
    console.error("Failed to create user:", error)
    return null
  }
}

// Verify password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// Seed initial admin user if none exists
export async function seedInitialAdmin(): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if any users exist
    const count = await db.collection(COLLECTION_NAME).countDocuments()
    if (count > 0) {
      return
    }

    // Create initial admin user
    await createUser({
      name: "Admin User",
      email: "admin@essen.sg",
      password: "password123", // This will be hashed by createUser
      role: "admin",
    })

    console.log("Initial admin user created")
  } catch (error) {
    console.error("Failed to seed initial admin user:", error)
  }
}
