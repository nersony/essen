"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { CategoryFormData } from "@/lib/db/schema"
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/category-actions"

// Define the form schema
const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  image: z.string().optional(),
  order: z.number().int().default(0),
})

interface CategoryFormProps {
  initialData?: CategoryFormData
  isEditing?: boolean
}

export function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values or initial data
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      parentId: "",
      image: "",
      order: 0,
    },
  })

  // Handle form submission
  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)

    try {
      if (isEditing && initialData?.id) {
        // Update existing category
        const result = await updateCategory(initialData.id, data)

        if (result.success) {
          toast({
            title: "Category updated",
            description: "Your category has been updated successfully.",
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
      } else {
        // Create new category
        const result = await createCategory(data)

        if (result.success) {
          toast({
            title: "Category created",
            description: "Your category has been created successfully.",
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

  // Handle category deletion
  const handleDelete = async () => {
    if (!initialData?.id) return

    setIsDeleting(true)

    try {
      const result = await deleteCategory(initialData.id)

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

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                rows={3}
                {...form.register("description")}
                error={form.formState.errors.description?.message}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input id="image" {...form.register("image")} error={form.formState.errors.image?.message} />
              {form.formState.errors.image && (
                <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>
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
