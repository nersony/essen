"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUserAction, updateUserAction } from "@/app/actions/user-actions"
import type { UserRole } from "@/lib/db/schema"

// Define the form schema
const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["super_admin", "admin", "editor", "customer"] as const),
})

interface UserFormProps {
  initialData?: {
    id: string
    name: string
    email: string
    role: UserRole
  }
  currentUserRole: string
  isEditing?: boolean
}

export function UserForm({ initialData, currentUserRole, isEditing = false }: UserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values or initial data
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      password: "",
      role: "editor",
    },
  })

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
    setIsSubmitting(true)

    try {
      if (isEditing && initialData?.id) {
        // Update existing user
        const result = await updateUserAction(initialData.id, data)

        if (result.success) {
          toast({
            title: "User updated",
            description: "User has been updated successfully.",
          })
          router.push("/admin/users")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } else {
        // Create new user
        if (!data.password) {
          toast({
            title: "Error",
            description: "Password is required for new users",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }

        const result = await createUserAction(data.name, data.email, data.password, data.role as UserRole)

        if (result.success) {
          toast({
            title: "User created",
            description: "User has been created successfully.",
          })
          router.push("/admin/users")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine if user can edit roles
  const canEditRoles = currentUserRole === "super_admin"

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
          {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password{" "}
            {isEditing && <span className="text-xs text-muted-foreground">(Leave blank to keep current password)</span>}
          </Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            disabled={!canEditRoles}
            onValueChange={(value) => form.setValue("role", value as UserRole)}
            defaultValue={form.getValues("role")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {canEditRoles && <SelectItem value="super_admin">Super Admin</SelectItem>}
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              {/* <SelectItem value="customer">Customer</SelectItem> */}
            </SelectContent>
          </Select>
          {!canEditRoles && <p className="text-xs text-muted-foreground">Only super admins can change user roles</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  )
}
