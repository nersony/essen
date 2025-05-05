import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ActivityLogTable } from "@/components/activity-log-table"

export default async function ActivityLogsPage() {
  // Get the current user session
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect("/admin/login")
  }

  // Check if user has super_admin role
  if (session.user.role !== "super_admin") {
    redirect("/admin")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>
      <p className="text-muted-foreground mb-6">
        View all activity logs for the admin panel. This includes user logins, product changes, and user management
        actions.
      </p>

      <ActivityLogTable />
    </div>
  )
}
