import { v4 as uuidv4 } from "uuid"
import { hash, compare } from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { logActivity } from "@/lib/activity-logger"
import type { User, UserRole } from "@/lib/db/schema"

// Collection name
const COLLECTION_NAME = "users"

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

// Verify a password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

// Create a new user
export async function createUser(
  userData: {
    name: string
    email: string
    password: string
    role: UserRole
  },
  actorId: string,
  actorEmail: string,
  actorRole?: UserRole,
): Promise<Omit<User, "password"> | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if a user with the same email already exists
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ email: userData.email })
    if (existingUser) {
      return null
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password)

    // Create a new user
    const newUser: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(COLLECTION_NAME).insertOne(newUser)

    // Log the activity
    await logActivity(
      actorId,
      actorEmail,
      "create_user",
      `Created user: ${newUser.email} with role: ${newUser.role}`,
      newUser.id,
      "user",
      actorRole,
    )

    // Return the user without the password
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  } catch (error) {
    console.error("Failed to create user:", error)
    return null
  }
}

// Update a user
export async function updateUser(
  id: string,
  userData: {
    name?: string
    email?: string
    password?: string
    role?: UserRole
  },
  actorId: string,
  actorEmail: string,
  actorRole?: UserRole,
): Promise<Omit<User, "password"> | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if the user exists
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!existingUser) {
      return null
    }

    // Check if another user with the same email exists
    if (userData.email && userData.email !== existingUser.email) {
      const duplicateEmail = await db.collection(COLLECTION_NAME).findOne({ email: userData.email, id: { $ne: id } })
      if (duplicateEmail) {
        return null
      }
    }

    // Prepare update data
    const updateData: any = {
      ...userData,
      updatedAt: new Date(),
    }

    // Hash the password if provided
    if (userData.password) {
      updateData.password = await hashPassword(userData.password)
    }

    // Update the user
    await db.collection(COLLECTION_NAME).updateOne({ id }, { $set: updateData })

    // Get the updated user
    const updatedUser = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!updatedUser) {
      return null
    }

    // Log the activity
    await logActivity(
      actorId,
      actorEmail,
      "update_user",
      `Updated user: ${updatedUser.email}`,
      updatedUser.id,
      "user",
      actorRole,
    )

    // Return the user without the password
    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error)
    return null
  }
}

// Delete a user
export async function deleteUser(
  id: string,
  actorId: string,
  actorEmail: string,
  actorRole?: UserRole,
): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Check if the user exists
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ id })
    if (!existingUser) {
      return false
    }

    // Delete the user
    await db.collection(COLLECTION_NAME).deleteOne({ id })

    // Log the activity
    await logActivity(
      actorId,
      actorEmail,
      "delete_user",
      `Deleted user: ${existingUser.email}`,
      existingUser.id,
      "user",
      actorRole,
    )

    return true
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error)
    return false
  }
}

// Get all users
export async function getUsers(excludeSuperAdmins = true): Promise<Omit<User, "password">[]> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Build query to exclude super admins if needed
    const query: any = {}
    if (excludeSuperAdmins) {
      query.role = { $ne: "super_admin" }
    }

    const users = await db.collection(COLLECTION_NAME).find(query).sort({ createdAt: -1 }).toArray()

    // Return users without passwords
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return {
        ...userWithoutPassword,
        _id: undefined,
      }
    }) as Omit<User, "password">[]
  } catch (error) {
    console.error("Failed to get users:", error)
    return []
  }
}

// Get a user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection(COLLECTION_NAME).findOne({ id })

    if (!user) {
      return null
    }

    return {
      ...user,
      _id: undefined,
    } as User
  } catch (error) {
    console.error(`Failed to get user with ID ${id}:`, error)
    return null
  }
}

// Get a user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const client = await clientPromise
    const db = client.db()

    const user = await db.collection(COLLECTION_NAME).findOne({ email })

    if (!user) {
      return null
    }

    return {
      ...user,
      _id: undefined,
    } as User
  } catch (error) {
    console.error(`Failed to get user with email ${email}:`, error)
    return null
  }
}

// Update last login time
export async function updateLastLogin(id: string): Promise<boolean> {
  try {
    const client = await clientPromise
    const db = client.db()

    await db.collection(COLLECTION_NAME).updateOne({ id }, { $set: { lastLogin: new Date() } })

    return true
  } catch (error) {
    console.error(`Failed to update last login for user with ID ${id}:`, error)
    return false
  }
}
