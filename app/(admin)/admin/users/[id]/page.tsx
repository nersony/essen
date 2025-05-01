import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserById } from "@/lib/user-service"
import { UserForm } from "@/components/user-form"
import { deleteUserAction } from "@/app/actions/user-actions"
import { Button } from "@/components/ui/button"

export default async function EditUserPage({ params }: { params: { id: string } }) {
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

  // Get the user to edit
  const user = await getUserById(params.id)
  if (!user) {
    redirect("/admin/users")
  }

  // Check permissions
  const isSuperAdmin = userRole === "super_admin"
  const isEditingSelf = session.user.id === user.id
  const isEditingAdmin = user.role === "admin" || user.role === "super_admin"

  // Only super admins can edit other admin users
  if (isEditingAdmin && !isSuperAdmin && !isEditingSelf) {
    redirect("/admin/users")
  }

  // Create delete user action
  async function deleteUser() {
    "use server"

    const result = await deleteUserAction(params.id)
    if (result.success) {
      redirect("/admin/users")
    }
    return result
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit User: {user.name}</h1>

        {/* Delete button - only show if not editing self and has permission */}
        {!isEditingSelf && (isSuperAdmin || (!isEditingAdmin && userRole === "admin")) && (
          <form action={deleteUser}>
            <Button type="submit" variant="destructive">
              Delete User
            </Button>
          </form>
        )}
      </div>

      <UserForm
        initialData={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }}
        currentUserRole={userRole}
        isEditing
      />
    </div>
  )
}
