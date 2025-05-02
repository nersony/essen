import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import type { ActivityLog, ActivityLogAction, UserRole } from "@/lib/db/schema"
import { headers } from "next/headers"

// Collection name
const COLLECTION_NAME = "activity_logs"

export async function logActivity(
  userId: string,
  userEmail: string,
  action: ActivityLogAction,
  details: string,
  entityId?: string,
  entityType?: string,
  userRole?: UserRole, // Add optional userRole parameter
): Promise<void> {
  try {
    // Skip logging for superadmin users
    if (userRole === "super_admin") {
      console.log(`Activity logging skipped for superadmin user: ${userEmail}, action: ${action}`)
      return
    }

    const client = await clientPromise
    const db = client.db()

    // Get IP and user agent from headers if available
    let ipAddress: string | undefined
    let userAgent: string | undefined

    try {
      const headersList = headers()
      ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
      userAgent = headersList.get("user-agent") || "unknown"
    } catch (error) {
      console.error("Failed to get request headers:", error)
    }

    const logEntry: ActivityLog = {
      id: uuidv4(),
      userId,
      userEmail,
      action,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      entityId,
      entityType,
    }

    await db.collection(COLLECTION_NAME).insertOne(logEntry)
  } catch (error) {
    console.error("Failed to log activity:", error)
    // Don't throw, just log the error to prevent disrupting the main flow
  }
}

export async function getActivityLogs(
  limit = 100,
  skip = 0,
  filters?: {
    userId?: string
    action?: ActivityLogAction
    fromDate?: Date
    toDate?: Date
    entityId?: string
    entityType?: string
  },
): Promise<ActivityLog[]> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Build query based on filters
    const query: any = {}

    if (filters) {
      if (filters.userId) query.userId = filters.userId
      if (filters.action) query.action = filters.action
      if (filters.entityId) query.entityId = filters.entityId
      if (filters.entityType) query.entityType = filters.entityType

      // Date range
      if (filters.fromDate || filters.toDate) {
        query.timestamp = {}
        if (filters.fromDate) query.timestamp.$gte = filters.fromDate
        if (filters.toDate) query.timestamp.$lte = filters.toDate
      }
    }

    const logs = await db
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ timestamp: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .toArray()

    return logs.map((log) => ({
      ...log,
      _id: undefined,
    })) as ActivityLog[]
  } catch (error) {
    console.error("Failed to get activity logs:", error)
    return []
  }
}

export async function getActivityLogsCount(filters?: {
  userId?: string
  action?: ActivityLogAction
  fromDate?: Date
  toDate?: Date
  entityId?: string
  entityType?: string
}): Promise<number> {
  try {
    const client = await clientPromise
    const db = client.db()

    // Build query based on filters
    const query: any = {}

    if (filters) {
      if (filters.userId) query.userId = filters.userId
      if (filters.action) query.action = filters.action
      if (filters.entityId) query.entityId = filters.entityId
      if (filters.entityType) query.entityType = filters.entityType

      // Date range
      if (filters.fromDate || filters.toDate) {
        query.timestamp = {}
        if (filters.fromDate) query.timestamp.$gte = filters.fromDate
        if (filters.toDate) query.timestamp.$lte = filters.toDate
      }
    }

    return await db.collection(COLLECTION_NAME).countDocuments(query)
  } catch (error) {
    console.error("Failed to get activity logs count:", error)
    return 0
  }
}
