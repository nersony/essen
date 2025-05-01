"use server"

import { getServerSession } from "next-auth/next"
import { authOptions, hasRequiredRole } from "@/lib/auth"
import { getActivityLogs, getActivityLogsCount, logActivity } from "@/lib/activity-logger"
import type { ActivityLog, ActivityLogAction } from "@/lib/db/schema"

// Get activity logs with pagination and filtering
export async function getActivityLogsAction(
  page = 1,
  limit = 50,
  filters?: {
    userId?: string
    action?: ActivityLogAction
    fromDate?: string
    toDate?: string
    entityId?: string
    entityType?: string
  },
): Promise<{
  success: boolean
  message: string
  logs?: ActivityLog[]
  total?: number
  pages?: number
}> {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized" }
    }

    // Check if user has super_admin role
    if (!hasRequiredRole(["super_admin"], session.user.role)) {
      return { success: false, message: "Forbidden" }
    }

    // Process date filters
    const processedFilters: any = { ...filters }
    if (filters?.fromDate) {
      processedFilters.fromDate = new Date(filters.fromDate)
    }
    if (filters?.toDate) {
      processedFilters.toDate = new Date(filters.toDate)
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Get logs
    const logs = await getActivityLogs(limit, skip, processedFilters)
    const total = await getActivityLogsCount(processedFilters)
    const pages = Math.ceil(total / limit)

    // Log the activity
    await logActivity(session.user.id, session.user.email, "view_logs", "Viewed activity logs", undefined, "logs")

    return {
      success: true,
      message: "Activity logs retrieved successfully",
      logs,
      total,
      pages,
    }
  } catch (error) {
    console.error("Failed to get activity logs:", error)
    return { success: false, message: "Failed to get activity logs" }
  }
}
