"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import type { ProductFormData } from "@/lib/db/schema"
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/product-actions"

// Define the form schema
const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  colors: z.array(z.string()),
  images: z.array(z.string()),
  dimensions: z
    .object({
      width: z.coerce.number().min(0, "Width must be a positive number"),
      depth: z.coerce.number().min(0, "Depth must be a positive number"),
      height: z.coerce.number().min(0, "Height must be a positive number"),
    })
    .optional(),
  materials: z.array(z.string()).optional(),
  careInstructions: z.array(z.string()).optional(),
  deliveryTime: z.string().optional(),
  returnPolicy: z.string().optional(),
  warranty: z.string().optional(),
  inStock: z.boolean().default(true),
})

interface ProductFormProps {
  initialData?: ProductFormData
  isEditing?: boolean
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values or initial data
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      category: "",
      price: 0,
      description: "",
      features: [""],
      colors: [""],
      images: ["/placeholder.svg?height=600&width=600"],
      dimensions: {
        width: 0,
        depth: 0,
        height: 0,
      },
      materials: [""],
      careInstructions: [""],
      deliveryTime: "2-3 weeks",
      returnPolicy: "30-day return policy",
      warranty: "2-year warranty",
      inStock: true,
    },
  })

  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)

    try {
      if (isEditing && initialData?.id) {
        // Update existing product
        const result = await updateProduct(initialData.id, data)

        if (result.success) {
          toast({
            title: "Product updated",
            description: "Your product has been updated successfully.",
          })
          router.push("/admin/products")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          })
        }
      } else {
        // Create new product
        const result = await createProduct(data)

        if (result.success) {
          toast({
            title: "Product created",
            description: "Your product has been created successfully.",
          })
          router.push("/admin/products")
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

  // Handle product deletion
  const handleDelete = async () => {
    if (!initialData?.id) return

    setIsDeleting(true)

    try {
      const result = await deleteProduct(initialData.id)

      if (result.success) {
        toast({
          title: "Product deleted",
          description: "Your product has been deleted successfully.",
        })
        router.push("/admin/products")
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

  // Handle array field additions and removals
  const addArrayField = (field: keyof ProductFormData, value = "") => {
    const currentValues = form.getValues(field) as string[]
    form.setValue(field, [...currentValues, value])
  }

  const removeArrayField = (field: keyof ProductFormData, index: number) => {
    const currentValues = form.getValues(field) as string[]
    if (currentValues.length > 1) {
      form.setValue(
        field,
        currentValues.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Tabs defaultValue="basic">
        <TabsList className="w-full border-b rounded-none justify-start">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...form.register("name")} error={form.formState.errors.name?.message} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug
                <span className="text-xs text-muted-foreground ml-2">(used in URL, e.g., "dining-table")</span>
              </Label>
              <Input id="slug" {...form.register("slug")} error={form.formState.errors.slug?.message} />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...form.register("category")} error={form.formState.errors.category?.message} />
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register("price")}
                error={form.formState.errors.price?.message}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              {...form.register("description")}
              error={form.formState.errors.description?.message}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="inStock">In Stock</Label>
              <Switch
                id="inStock"
                checked={form.watch("inStock")}
                onCheckedChange={(checked) => form.setValue("inStock", checked)}
              />
            </div>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 py-4">
          {/* Features */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Features</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("features")}>
                    Add Feature
                  </Button>
                </div>

                {form.watch("features").map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...form.getValues("features")]
                        newFeatures[index] = e.target.value
                        form.setValue("features", newFeatures)
                      }}
                      placeholder={`Feature ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayField("features", index)}
                      disabled={form.watch("features").length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {form.formState.errors.features && (
                  <p className="text-sm text-red-500">{form.formState.errors.features.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Colors</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("colors")}>
                    Add Color
                  </Button>
                </div>

                {form.watch("colors").map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={color}
                      onChange={(e) => {
                        const newColors = [...form.getValues("colors")]
                        newColors[index] = e.target.value
                        form.setValue("colors", newColors)
                      }}
                      placeholder={`Color ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayField("colors", index)}
                      disabled={form.watch("colors").length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dimensions</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      {...form.register("dimensions.width")}
                      error={form.formState.errors.dimensions?.width?.message}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="depth">Depth (cm)</Label>
                    <Input
                      id="depth"
                      type="number"
                      {...form.register("dimensions.depth")}
                      error={form.formState.errors.dimensions?.depth?.message}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      {...form.register("dimensions.height")}
                      error={form.formState.errors.dimensions?.height?.message}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Materials */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Materials</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("materials")}>
                    Add Material
                  </Button>
                </div>

                {form.watch("materials")?.map((material, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={material}
                      onChange={(e) => {
                        const newMaterials = [...(form.getValues("materials") || [])]
                        newMaterials[index] = e.target.value
                        form.setValue("materials", newMaterials)
                      }}
                      placeholder={`Material ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayField("materials", index)}
                      disabled={(form.watch("materials") || []).length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Care Instructions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Care Instructions</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("careInstructions")}>
                    Add Instruction
                  </Button>
                </div>

                {form.watch("careInstructions")?.map((instruction, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...(form.getValues("careInstructions") || [])]
                        newInstructions[index] = e.target.value
                        form.setValue("careInstructions", newInstructions)
                      }}
                      placeholder={`Instruction ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayField("careInstructions", index)}
                      disabled={(form.watch("careInstructions") || []).length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Product Images</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField("images", "/placeholder.svg?height=600&width=600")}
                  >
                    Add Image
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.watch("images").map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-square relative border rounded-md overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={image}
                          onChange={(e) => {
                            const newImages = [...form.getValues("images")]
                            newImages[index] = e.target.value
                            form.setValue("images", newImages)
                          }}
                          placeholder="Image URL"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayField("images", index)}
                          disabled={form.watch("images").length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  Note: In a production environment, you would use an image upload component here. For this example,
                  please provide image URLs directly.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping & Returns Tab */}
        <TabsContent value="shipping" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input id="deliveryTime" {...form.register("deliveryTime")} placeholder="e.g., 2-3 weeks" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty</Label>
              <Input id="warranty" {...form.register("warranty")} placeholder="e.g., 2-year warranty" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnPolicy">Return Policy</Label>
            <Input id="returnPolicy" {...form.register("returnPolicy")} placeholder="e.g., 30-day return policy" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>

        <div className="flex space-x-2">
          {isEditing && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isSubmitting}>
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  )
}
