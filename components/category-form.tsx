"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/category-actions"

// Define the form schema
const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  parentId: z.string().optional().nullable(),
})

// Define the CategoryFormData type
interface CategoryFormData {
  name: string
  slug: string
  parentId?: string | null
  id?: string
}

interface CategoryFormProps {
  initialData?: CategoryFormData
  isEditing?: boolean
}

export function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Debug log for initial data
  useEffect(() => {
    console.log("CategoryForm initialData:", initialData)
  }, [initialData])

  // Initialize form with default values or initial data
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      parentId: initialData?.parentId || "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    setFormError(null)

    try {
      console.log("Form submission data:", data)
      console.log("Is editing:", isEditing)
      console.log("Initial data ID:", initialData?.id)

      if (isEditing && initialData?.id) {
        // Update existing category
        console.log(`Updating category with ID: ${initialData.id}`)
        const result = await updateCategory(initialData.id, data)
        console.log("Update result:", result)

        if (result.success) {
          toast({
            title: "Category updated",
            description: "Your category has been updated successfully.",
          })
          router.push("/admin/categories")
          router.refresh()
        } else {
          setFormError(result.message)
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } else {
        // Create new category
        console.log("Creating new category")
        const result = await createCategory(data)
        console.log("Create result:", result)

        if (result.success) {
          toast({
            title: "Category created",
            description: "Your category has been created successfully.",
          })
          router.push("/admin/categories")
          router.refresh()
        } else {
          setFormError(result.message)
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setFormError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle category deletion
  const handleDelete = async () => {
    if (!initialData?.id) return

    setIsDeleting(true)

    try {
      console.log(`Deleting category with ID: ${initialData.id}`)
      const result = await deleteCategory(initialData.id)
      console.log("Delete result:", result)

      if (result.success) {
        toast({
          title: "Category deleted",
          description: "Your category has been deleted successfully.",
        })
        router.push("/admin/categories")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Generate slug from name
  const generateSlug = () => {
    const name = form.getValues("name")
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      form.setValue("slug", slug)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                error={form.formState.errors.name?.message}
                onBlur={() => {
                  if (!isEditing && !form.getValues("slug")) {
                    generateSlug()
                  }
                }}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">
                  Slug
                  <span className="text-xs text-muted-foreground ml-2">(used in URL, e.g., "living-room")</span>
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={generateSlug} className="h-8">
                  Generate
                </Button>
              </div>
              <Input id="slug" {...form.register("slug")} error={form.formState.errors.slug?.message} />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
          Cancel
        </Button>

        <div className="flex space-x-2">
          {isEditing && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isSubmitting}>
              {isDeleting ? "Deleting..." : "Delete Category"}
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </div>
    </form>
  )
}
