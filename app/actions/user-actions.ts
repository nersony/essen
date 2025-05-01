"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions, hasRequiredRole } from "@/lib/auth"
import { createUser, updateUser, deleteUser, getUsers, getUserById } from "@/lib/user-service"
import { logActivity } from "@/lib/activity-logger"
import type { User, UserRole } from "@/lib/db/schema"

// Create a new user
export async function createUserAction(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): Promise<{ success: boolean; message: string; user?: Omit<User, "password"> }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    // Check if user has super_admin role for creating admin users
    if ((role === "admin" || role === "super_admin") && session.user.role !== "super_admin") {
      return { success: false, message: "Only super admins can create admin users" }
    }

    // Create the user
    const newUser = await createUser({ name, email, password, role }, session.user.id, session.user.email)

    if (!newUser) {
      return { success: false, message: "Failed to create user or user already exists" }
    }

    revalidatePath("/admin/users")

    return {
      success: true,
      message: "User created successfully",
      user: newUser,
    }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { success: false, message: "Failed to create user" }
  }
}

// Update a user
export async function updateUserAction(
  id: string,
  userData: {
    name?: string
    email?: string
    password?: string
    role?: UserRole
  },
): Promise<{ success: boolean; message: string; user?: Omit<User, "password"> }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    // Get the user to update
    const userToUpdate = await getUserById(id)
    if (!userToUpdate) {
      return { success: false, message: "User not found" }
    }

    // Check permissions
    const isSuperAdmin = session.user.role === "super_admin"
    const isUpdatingSelf = session.user.id === id

    // Only super admins can update other super admins
    if (userToUpdate.role === "super_admin" && !isSuperAdmin) {
      return { success: false, message: "Only super admins can update super admin accounts" }
    }

    // Only super admins can change roles
    if (userData.role && userData.role !== userToUpdate.role && !isSuperAdmin) {
      return { success: false, message: "Only super admins can change user roles" }
    }

    // Regular admins can only update themselves or non-admin users
    if (!isSuperAdmin && !isUpdatingSelf && userToUpdate.role === "admin") {
      return { success: false, message: "You don't have permission to update this user" }
    }

    // Update the user
    const updatedUser = await updateUser(id, userData, session.user.id, session.user.email)

    if (!updatedUser) {
      return { success: false, message: "Failed to update user" }
    }

    revalidatePath("/admin/users")

    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    }
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error)
    return { success: false, message: "Failed to update user" }
  }
}

// Delete a user
export async function deleteUserAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    // Get the user to delete
    const userToDelete = await getUserById(id)
    if (!userToDelete) {
      return { success: false, message: "User not found" }
    }

    // Check permissions
    const isSuperAdmin = session.user.role === "super_admin"
    const isDeletingSelf = session.user.id === id

    // Cannot delete yourself
    if (isDeletingSelf) {
      return { success: false, message: "You cannot delete your own account" }
    }

    // Only super admins can delete admin users
    if ((userToDelete.role === "admin" || userToDelete.role === "super_admin") && !isSuperAdmin) {
      return { success: false, message: "Only super admins can delete admin accounts" }
    }

    // Delete the user
    const success = await deleteUser(id, session.user.id, session.user.email)

    if (!success) {
      return { success: false, message: "Failed to delete user" }
    }

    revalidatePath("/admin/users")

    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error)
    return { success: false, message: "Failed to delete user" }
  }
}

// Get all users (with role-based filtering)
export async function getUsersAction(): Promise<{
  success: boolean
  message: string
  users?: Omit<User, "password">[]
}> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    // Check if user has admin or super_admin role
    if (!hasRequiredRole(["admin", "super_admin"], session.user.role)) {
      return { success: false, message: "Forbidden" }
    }

    // Log the activity
    await logActivity(session.user.id, session.user.email, "view_users", "Viewed user list", undefined, "user")

    // Get users based on role
    const isSuperAdmin = session.user.role === "super_admin"
    const users = await getUsers(!isSuperAdmin) // Exclude super admins for non-super admins

    return {
      success: true,
      message: "Users retrieved successfully",
      users,
    }
  } catch (error) {
    console.error("Failed to get users:", error)
    return { success: false, message: "Failed to get users" }
  }
}
