import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserForm } from "@/components/user-form"

export default async function NewUserPage() {
  // Get the current user session
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect("/admin/login")
  }

  // Check if user has admin or super_admin role
  const userRole = session.user.role
  if (userRole !== "admin" && userRole !== "super_admin") {
    redirect("/admin")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New User</h1>
      <UserForm currentUserRole={userRole} />
    </div>
  )
}
