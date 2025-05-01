import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/db/schema"
import bcrypt from "bcryptjs"
import { logActivity } from "@/lib/activity-logger"

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

// Get a user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection(COLLECTION_NAME).findOne({ id })

    if (!user) return null

    return {
      ...user,
      id: user._id.toString(),
      _id: undefined,
    } as User
  } catch (error) {
    console.error(`Failed to get user with ID ${id}:`, error)
    return null
  }
}

// Get all users
export async function getUsers(excludeSuperAdmin = false): Promise<User[]> {
  try {
    const client = await clientPromise
    const db = client.db()

    const query = excludeSuperAdmin ? { role: { $ne: "super_admin" } } : {}

    const users = await db.collection(COLLECTION_NAME).find(query).toArray()

    return users.map((user) => ({
      ...user,
      id: user._id.toString(),
      _id: undefined,
      password: undefined, // Don't return passwords
    })) as User[]
  } catch (error) {
    console.error("Failed to get users:", error)
    return []
  }
}

// Create a new user
export async function createUser(
  userData: Omit<User, "id" | "createdAt" | "updatedAt">,
  creatorId?: string,
  creatorEmail?: string,
): Promise<User | null> {
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

    // Log the activity if creator info is provided
    if (creatorId && creatorEmail) {
      await logActivity(
        creatorId,
        creatorEmail,
        "create_user",
        `Created user: ${newUser.email} with role: ${newUser.role}`,
        newUser.id,
        "user",
      )
    }

    // Return user without password
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword as User
  } catch (error) {
    console.error("Failed to create user:", error)
    return null
  }
}

// Update a user
export async function updateUser(
  id: string,
  userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  updaterId?: string,
  updaterEmail?: string,
): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Get the existing user
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!existingUser) {
      return null
    }

    // Prepare update data
    const updateData: any = {
      ...userData,
      updatedAt: new Date(),
    }

    // If password is being updated, hash it
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10)
    }

    await db.collection(COLLECTION_NAME).updateOne({ id }, { $set: updateData })

    // Get the updated user
    const updatedUser = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!updatedUser) {
      return null
    }

    // Log the activity if updater info is provided
    if (updaterId && updaterEmail) {
      const details = Object.keys(userData)
        .filter((key) => key !== "password") // Don't log password changes
        .map((key) => `${key}: ${userData[key as keyof typeof userData]}`)
        .join(", ")

      await logActivity(
        updaterId,
        updaterEmail,
        "update_user",
        `Updated user: ${updatedUser.email}, fields changed: ${details}`,
        id,
        "user",
      )
    }

    // Return user without password
    return {
      ...updatedUser,
      id: updatedUser._id.toString(),
      _id: undefined,
      password: undefined,
    } as User
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error)
    return null
  }
}

// Delete a user
export async function deleteUser(id: string, deleterId?: string, deleterEmail?: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Get the user before deletion for logging
    const userToDelete = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!userToDelete) {
      return false
    }

    // Don't allow deletion of super_admin users
    if (userToDelete.role === "super_admin") {
      return false
    }

    const result = await db.collection(COLLECTION_NAME).deleteOne({ id })

    if (result.deletedCount === 0) {
      return false
    }

    // Log the activity if deleter info is provided
    if (deleterId && deleterEmail) {
      await logActivity(
        deleterId,
        deleterEmail,
        "delete_user",
        `Deleted user: ${userToDelete.email} with role: ${userToDelete.role}`,
        id,
        "user",
      )
    }

    return true
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error)
    return false
  }
}

// Verify password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// Update last login time
export async function updateLastLogin(id: string): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()

    await db.collection(COLLECTION_NAME).updateOne({ id }, { $set: { lastLogin: new Date() } })
  } catch (error) {
    console.error(`Failed to update last login for user with ID ${id}:`, error)
  }
}

// Seed initial admin users if none exist
export async function seedInitialAdmins(): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if any users exist
    const count = await db.collection(COLLECTION_NAME).countDocuments()
    if (count > 0) {
      // Check if super admin exists
      const superAdmin = await db.collection(COLLECTION_NAME).findOne({ email: "dillon@essen.sg" })
      if (!superAdmin) {
        // Create super admin
        await createUser({
          name: "Dillon",
          email: "dillon@essen.sg",
          password: "SuperSecurePassword123!", // This will be hashed by createUser
          role: "super_admin",
        })
        console.log("Super admin user created")
      }
      return
    }

    // Create super admin
    await createUser({
      name: "Dillon",
      email: "dillon@essen.sg",
      password: "SuperSecurePassword123!", // This will be hashed by createUser
      role: "super_admin",
    })

    // Create regular admin
    await createUser({
      name: "Admin User",
      email: "admin@essen.sg",
      password: "password123", // This will be hashed by createUser
      role: "admin",
    })

    console.log("Initial admin users created")
  } catch (error) {
    console.error("Failed to seed initial admin users:", error)
  }
}
