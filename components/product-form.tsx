"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Plus, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ProductFormData, ProductVariant, MaterialOption, DimensionOption, AddOnOption } from "@/lib/db/schema"
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/product-actions"
import { getCategories } from "@/app/actions/category-actions"

// Define the placeholder image URL
const PLACEHOLDER_IMAGE_URL = "https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/products/placeholder.png"

// Define the form schema
const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, "Slug must contain only letters, numbers, and hyphens"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  images: z.array(z.string()),
  careInstructions: z.array(z.string()).optional(),
  deliveryTime: z.string().optional(),
  warranty: z.string().optional(),
  inStock: z.boolean().default(true),
  isWeeklyBestSeller: z.boolean().default(false),
})

interface ProductFormProps {
  initialData?: ProductFormData
  isEditing?: boolean
}

// Helper function to safely handle potentially null values
const safeValue = (value: any) => {
  return value === null ? "" : value
}

// SafeInput component that handles null values
const SafeInput = ({ value, ...props }: any) => {
  return <Input value={safeValue(value)} {...props} />
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmSlug, setConfirmSlug] = useState("")
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [materialErrors, setMaterialErrors] = useState<string[]>([])
  const [dimensionErrors, setDimensionErrors] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  // Default material options
  const defaultMaterialOptions: MaterialOption[] = [
    { name: "Fabric", priceAdjustment: 0 },
    { name: "Leather", priceAdjustment: 300 },
    { name: "Velvet", priceAdjustment: 200 },
    { name: "Linen", priceAdjustment: 150 },
  ]

  // Default dimension options
  const defaultDimensionOptions: DimensionOption[] = [
    { value: "2600mm", priceAdjustment: 0 },
    { value: "3000mm", priceAdjustment: 200 },
    { value: "3400mm", priceAdjustment: 400 },
  ]

  // Default add-on options
  const defaultAddOns: AddOnOption[] = [
    { name: "Metal Frame", price: 200, selected: false },
    { name: "Premium Cushions", price: 150, selected: false },
  ]

  // Initialize form with default values or initial data
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      category: "",
      description: "",
      features: [""],
      images: [PLACEHOLDER_IMAGE_URL],
      careInstructions: [""],
      deliveryTime: "2-3 weeks",
      warranty: "2-year warranty",
      inStock: true,
      isWeeklyBestSeller: false,
    },
  })

  // Replace the existing variant state with our new structure
  const [variants, setVariants] = useState<Omit<ProductVariant, "id" | "productId">>({
    materials: initialData?.variants?.[0]?.materials || [],
    dimensions: initialData?.variants?.[0]?.dimensions || [],
    combinations: initialData?.variants?.[0]?.combinations || [],
    addOns: initialData?.variants?.[0]?.addOns || [],
  })

  // Replace the calculateVariantPrice function with a new one that uses combinations
  const getVariantPrice = (materialName: string, dimensionValue: string): number => {
    const combination = variants.combinations.find(
      (c) => c.materialName === materialName && c.dimensionValue === dimensionValue,
    )
    return combination?.price || 0 // Use 0 as default instead of form.getValues("price")
  }

  // Replace the isInStock function
  const isInStock = (materialName: string, dimensionValue: string): boolean => {
    const combination = variants.combinations.find(
      (c) => c.materialName === materialName && c.dimensionValue === dimensionValue,
    )
    return combination?.inStock ?? true
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories()
      setCategories(categoriesData.map((c) => ({ id: c.id, name: c.name })))
    }

    fetchCategories()
  }, [])

  // Handle variant changes
  const handleVariantChange = (index: number, field: string, value: any) => {
    // const updatedVariants = [...variants]
    // updatedVariants[index] = {
    //   ...updatedVariants[index],
    //   [field]: value,
    // }
    // setVariants(updatedVariants)
  }

  // Handle material selection
  const handleMaterialSelect = (index: number, materialName: string) => {
    // const updatedVariants = [...variants]
    // updatedVariants[index].material = materialName
    // setVariants(updatedVariants)
  }

  // Handle dimension selection
  const handleDimensionSelect = (index: number, dimensionValue: string) => {
    // const updatedVariants = [...variants]
    // updatedVariants[index].dimension = dimensionValue
    // setVariants(updatedVariants)
  }

  // Handle add-on selection
  const handleAddOnChange = (variantIndex: number, addOnIndex: number, selected: boolean) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].addOns[addOnIndex].selected = selected
    // setVariants(updatedVariants)
  }

  // Add a new material option to a variant
  const addMaterialOption = (variantIndex: number) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].materialOptions.push({
    //   name: "",
    //   priceAdjustment: 0,
    // })
    // setVariants(updatedVariants)
  }

  // Remove a material option from a variant
  const removeMaterialOption = (variantIndex: number, materialIndex: number) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].materialOptions = updatedVariants[variantIndex].materialOptions.filter(
    //   (_, i) => i !== materialIndex,
    // )
    // setVariants(updatedVariants)
  }

  // Update a material option
  const updateMaterialOption = (
    variantIndex: number,
    materialIndex: number,
    field: keyof MaterialOption,
    value: any,
  ) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].materialOptions[materialIndex][field] = value
    // setVariants(updatedVariants)
  }

  // Add a new dimension option to a variant
  const addDimensionOption = (variantIndex: number) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].dimensionOptions.push({
    //   value: "",
    //   priceAdjustment: 0,
    // })
    // setVariants(updatedVariants)
  }

  // Remove a dimension option from a variant
  const removeDimensionOption = (variantIndex: number, dimensionIndex: number) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].dimensionOptions = updatedVariants[variantIndex].dimensionOptions.filter(
    //   (_, i) => i !== dimensionIndex,
    // )
    // setVariants(updatedVariants)
  }

  // Update a dimension option
  const updateDimensionOption = (
    variantIndex: number,
    dimensionIndex: number,
    field: keyof DimensionOption,
    value: any,
  ) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].dimensionOptions[dimensionIndex][field] = value
    // setVariants(updatedVariants)
  }

  // Add a new add-on option to a variant
  const addAddOnOption = (variantIndex: number) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].addOns.push({
    //   name: "",
    //   price: 0,
    //   selected: false,
    // })
    // setVariants(updatedVariants)
  }

  // Remove an add-on option from a variant
  const removeAddOnOption = (variantIndex: number, addOnIndex: number) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].addOns = updatedVariants[variantIndex].addOns.filter((_, i) => i !== addOnIndex)
    // setVariants(updatedVariants)
  }

  // Update an add-on option
  const updateAddOnOption = (variantIndex: number, addOnIndex: number, field: keyof AddOnOption, value: any) => {
    // const updatedVariants = [...variants]
    // updatedVariants[variantIndex].addOns[addOnIndex][field] = value
    // setVariants(updatedVariants)
  }

  // Add a new variant
  const addVariant = () => {
    // const basePrice = form.getValues("price")
    // setVariants([
    //   ...variants,
    //   {
    //     name: "",
    //     sku: "",
    //     basePrice: basePrice,
    //     material: defaultMaterialOptions[0].name,
    //     materialOptions: [...defaultMaterialOptions],
    //     dimension: defaultDimensionOptions[0].value,
    //     dimensionOptions: [...defaultDimensionOptions],
    //     addOns: [...defaultAddOns],
    //     attributes: {},
    //     inStock: true,
    //   },
    // ])
  }

  // Remove a variant
  const removeVariant = (index: number) => {
    // setVariants(variants.filter((_, i) => i !== index))
  }

  // Validate materials and dimensions
  const validateMaterials = () => {
    const errors: string[] = []
    variants.materials.forEach((material, index) => {
      if (!material.name.trim()) {
        errors[index] = "Material name cannot be empty"
      }
    })
    setMaterialErrors(errors)
    return errors.length === 0
  }

  const validateDimensions = () => {
    const errors: string[] = []
    variants.dimensions.forEach((dimension, index) => {
      if (!dimension.value.trim()) {
        errors[index] = "Dimension value cannot be empty"
      }
    })
    setDimensionErrors(errors)
    return errors.length === 0
  }

  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    // Reset validation errors
    setMaterialErrors([])
    setDimensionErrors([])
    setFormError(null)

    // Validate materials and dimensions
    const materialsValid = validateMaterials()
    const dimensionsValid = validateDimensions()

    if (!materialsValid || !dimensionsValid) {
      setFormError("Please fix the errors in materials and dimensions before submitting.")
      return
    }

    setIsSubmitting(true)

    try {
      // Ensure all material-dimension combinations have prices
      const allCombinations = []

      // Create combinations for any missing material-dimension pairs
      // Include combinations with blank material or dimension values
      if (variants.materials.length > 0 && variants.dimensions.length > 0) {
        variants.materials.forEach((material) => {
          variants.dimensions.forEach((dimension) => {
            const existingCombination = variants.combinations.find(
              (c) => c.materialName === material.name && c.dimensionValue === dimension.value,
            )

            if (!existingCombination) {
              allCombinations.push({
                materialName: material.name,
                dimensionValue: dimension.value,
                price: 0, // Default to 0 instead of data.price
                inStock: true,
              })
            } else {
              allCombinations.push(existingCombination)
            }
          })
        })
      } else if (variants.materials.length > 0 && variants.dimensions.length === 0) {
        // Handle case with only materials, no dimensions
        variants.materials.forEach((material) => {
          const existingCombination = variants.combinations.find(
            (c) => c.materialName === material.name && !c.dimensionValue,
          )

          if (!existingCombination) {
            allCombinations.push({
              materialName: material.name,
              dimensionValue: "",
              price: 0,
              inStock: true,
            })
          } else {
            allCombinations.push(existingCombination)
          }
        })
      } else if (variants.materials.length === 0 && variants.dimensions.length > 0) {
        // Handle case with only dimensions, no materials
        variants.dimensions.forEach((dimension) => {
          const existingCombination = variants.combinations.find(
            (c) => !c.materialName && c.dimensionValue === dimension.value,
          )

          if (!existingCombination) {
            allCombinations.push({
              materialName: "",
              dimensionValue: dimension.value,
              price: 0,
              inStock: true,
            })
          } else {
            allCombinations.push(existingCombination)
          }
        })
      } else {
        // Handle case with no materials and no dimensions
        const existingCombination = variants.combinations.find((c) => !c.materialName && !c.dimensionValue)

        if (!existingCombination && variants.combinations.length === 0) {
          allCombinations.push({
            materialName: "",
            dimensionValue: "",
            price: 0,
            inStock: true,
          })
        } else {
          // Use existing combinations
          allCombinations.push(...variants.combinations)
        }
      }

      // Create a single variant with all materials, dimensions, and combinations
      const formDataWithVariants = {
        ...data,
        variants: [
          {
            materials: variants.materials,
            dimensions: variants.dimensions,
            combinations: allCombinations,
            addOns: variants.addOns,
          },
        ],
      }

      if (isEditing && initialData?.id) {
        // Update existing product
        const result = await updateProduct(initialData.id, formDataWithVariants)

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
        const result = await createProduct(formDataWithVariants)

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

  // Open delete confirmation dialog
  const openDeleteDialog = () => {
    setConfirmSlug("")
    setDeleteError(null)
    setDeleteDialogOpen(true)
  }

  // Handle product deletion
  const handleDelete = async () => {
    if (!initialData?.id) return

    // Check if the entered slug matches the product slug
    if (confirmSlug !== initialData.slug) {
      setDeleteError("The slug you entered does not match the product slug.")
      return
    }

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const result = await deleteProduct(initialData.id)

      if (result.success) {
        setDeleteDialogOpen(false)
        toast({
          title: "Product deleted",
          description: "Your product has been deleted successfully.",
        })
        router.push("/admin/products")
        router.refresh()
      } else {
        setDeleteError(result.message)
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setDeleteError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
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

  // Handle image upload
  const handleMultiImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newUploadProgress = { ...uploadProgress }

    // Track upload progress
    const uploadPromises = Array.from(files).map(async (file, index) => {
      try {
        // Create form data for upload
        const formData = new FormData()
        formData.append("file", file) // Use "file" instead of "image" to match the API
        formData.append("folder", "essen/products") // Specify the correct folder

        // Initialize progress for this file
        const progressKey = `${Date.now()}-${index}`
        newUploadProgress[progressKey] = 0
        setUploadProgress(newUploadProgress)

        // Upload image with credentials
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include", // Include session cookies
        })

        if (!response.ok) {
          // Get detailed error information
          const errorText = await response.text().catch(() => "Unknown error")
          console.error("Upload response error:", response.status, errorText)
          throw new Error(`Image upload failed with status: ${response.status}`)
        }

        const { imageUrl } = await response.json()

        // Update progress to complete
        newUploadProgress[progressKey] = 100
        setUploadProgress(newUploadProgress)

        return imageUrl
      } catch (error) {
        console.error("Image upload error:", error)
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        })
        return null
      }
    })

    try {
      // Wait for all uploads to complete
      const uploadedImages = await Promise.all(uploadPromises)

      // Filter out any failed uploads
      const validImages = uploadedImages.filter((img) => img !== null) as string[]

      if (validImages.length > 0) {
        // Get current images and add new ones
        const currentImages = form.getValues("images")

        // Remove placeholder if it's the only image
        const imagesToUpdate =
          currentImages.length === 1 &&
          (currentImages[0].includes("/placeholder.svg") || currentImages[0] === PLACEHOLDER_IMAGE_URL)
            ? []
            : currentImages

        const updatedImages = [...imagesToUpdate, ...validImages]

        form.setValue("images", updatedImages)

        toast({
          title: "Images Uploaded",
          description: `${validImages.length} image(s) uploaded successfully`,
        })
      }
    } catch (error) {
      console.error("Multi-image upload error:", error)
      toast({
        title: "Upload Error",
        description: "Failed to process uploaded images",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  }

  // Generate slug from name
  const generateSlug = () => {
    const name = form.getValues("name")
    if (name) {
      const slug = name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      form.setValue("slug", slug)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Tabs defaultValue="basic">
        <TabsList className="w-full border-b rounded-none justify-start">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Warranty</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <SafeInput
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
                  <span className="text-xs text-muted-foreground ml-2">(used in URL, e.g., "dining-table")</span>
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={generateSlug} className="h-8">
                  Generate
                </Button>
              </div>
              <SafeInput id="slug" {...form.register("slug")} error={form.formState.errors.slug?.message} />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full p-2 border rounded-md"
                {...form.register("category")}
                onChange={(e) => {
                  form.setValue("category", e.target.value)
                  // Find the category ID for the selected category
                  const selectedCategory = categories.find((c) => c.name === e.target.value)
                  if (selectedCategory) {
                    form.setValue("categoryId", selectedCategory.id)
                  }
                }}
                value={safeValue(form.watch("category"))}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
              <input type="hidden" {...form.register("categoryId")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isWeeklyBestSeller">Weekly Best Seller</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isWeeklyBestSeller"
                  checked={form.watch("isWeeklyBestSeller")}
                  onCheckedChange={(checked) => form.setValue("isWeeklyBestSeller", checked)}
                />
                <Label htmlFor="isWeeklyBestSeller" className="text-sm text-muted-foreground">
                  Feature this product on the home page as a weekly best seller
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              {...form.register("description")}
              value={safeValue(form.watch("description"))}
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
                    <SafeInput
                      value={feature}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                    <SafeInput
                      value={instruction}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="image-upload"
                    onChange={handleMultiImageUpload}
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Images"}
                  </Button>
                </div>

                {/* Upload Progress */}
                {isUploading && Object.keys(uploadProgress).length > 0 && (
                  <div className="mt-2 space-y-2">
                    {Object.entries(uploadProgress).map(([key, progress]) => (
                      <div key={key} className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {form.watch("images").map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative border rounded-md overflow-hidden">
                        <img
                          src={image || PLACEHOLDER_IMAGE_URL}
                          alt={`Product image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        {/* Remove Image Button */}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const currentImages = form.getValues("images")
                            const updatedImages = currentImages.filter((_, i) => i !== index)
                            form.setValue("images", updatedImages.length > 0 ? updatedImages : [PLACEHOLDER_IMAGE_URL])
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* Image URL display */}
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {image.includes("digitaloceanspaces.com/essen")
                          ? `DO Spaces: ${image.split("/essen/").pop()}`
                          : image.includes("digitaloceanspaces.com")
                            ? `DO Spaces: ${image.split("/").pop()}`
                            : image}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  Images are automatically uploaded to DigitalOcean Spaces. For best results, use images with a 1:1
                  aspect ratio.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Replace the variant section in the TabsContent with value="variants" */}
        <TabsContent value="variants" className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Materials Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Materials</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setVariants({
                          ...variants,
                          materials: [...variants.materials, { name: "", description: "" }],
                        })
                      }}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Material
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {variants.materials.map((material, materialIndex) => (
                      <div key={materialIndex} className="flex items-center space-x-2 border p-3 rounded-md">
                        <div className="flex-grow grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`material-name-${materialIndex}`} className="text-xs">
                              Material Name
                            </Label>
                            <SafeInput
                              id={`material-name-${materialIndex}`}
                              value={material.name}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const updatedMaterials = [...variants.materials]
                                updatedMaterials[materialIndex].name = e.target.value
                                setVariants({
                                  ...variants,
                                  materials: updatedMaterials,
                                })
                                // Clear error when typing
                                if (materialErrors[materialIndex]) {
                                  const newErrors = [...materialErrors]
                                  newErrors[materialIndex] = ""
                                  setMaterialErrors(newErrors)
                                }
                              }}
                              placeholder="e.g., Fabric"
                              className={materialErrors[materialIndex] ? "border-red-500" : ""}
                            />
                            {materialErrors[materialIndex] && (
                              <p className="text-xs text-red-500 mt-1">{materialErrors[materialIndex]}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor={`material-desc-${materialIndex}`} className="text-xs">
                              Description (Optional)
                            </Label>
                            <SafeInput
                              id={`material-desc-${materialIndex}`}
                              value={material.description || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const updatedMaterials = [...variants.materials]
                                updatedMaterials[materialIndex].description = e.target.value
                                setVariants({
                                  ...variants,
                                  materials: updatedMaterials,
                                })
                              }}
                              placeholder="e.g., Premium quality fabric"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Remove material and any combinations using it
                            const materialName = variants.materials[materialIndex].name
                            const updatedMaterials = variants.materials.filter((_, i) => i !== materialIndex)
                            const updatedCombinations = variants.combinations.filter(
                              (c) => c.materialName !== materialName,
                            )

                            setVariants({
                              ...variants,
                              materials: updatedMaterials,
                              combinations: updatedCombinations,
                            })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dimensions Management */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Dimensions</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setVariants({
                          ...variants,
                          dimensions: [...variants.dimensions, { value: "", description: "" }],
                        })
                      }}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Dimension
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {variants.dimensions.map((dimension, dimensionIndex) => (
                      <div key={dimensionIndex} className="flex items-center space-x-2 border p-3 rounded-md">
                        <div className="flex-grow grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`dimension-value-${dimensionIndex}`} className="text-xs">
                              Dimension Value
                            </Label>
                            <SafeInput
                              id={`dimension-value-${dimensionIndex}`}
                              value={dimension.value}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const updatedDimensions = [...variants.dimensions]
                                updatedDimensions[dimensionIndex].value = e.target.value
                                setVariants({
                                  ...variants,
                                  dimensions: updatedDimensions,
                                })
                                // Clear error when typing
                                if (dimensionErrors[dimensionIndex]) {
                                  const newErrors = [...dimensionErrors]
                                  newErrors[dimensionIndex] = ""
                                  setDimensionErrors(newErrors)
                                }
                              }}
                              placeholder="e.g., 2600mm"
                              className={dimensionErrors[dimensionIndex] ? "border-red-500" : ""}
                            />
                            {dimensionErrors[dimensionIndex] && (
                              <p className="text-xs text-red-500 mt-1">{dimensionErrors[dimensionIndex]}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor={`dimension-desc-${dimensionIndex}`} className="text-xs">
                              Description (Optional)
                            </Label>
                            <SafeInput
                              id={`dimension-desc-${dimensionIndex}`}
                              value={dimension.description || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const updatedDimensions = [...variants.dimensions]
                                updatedDimensions[dimensionIndex].description = e.target.value
                                setVariants({
                                  ...variants,
                                  dimensions: updatedDimensions,
                                })
                              }}
                              placeholder="e.g., Standard size"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Remove dimension and any combinations using it
                            const dimensionValue = variants.dimensions[dimensionIndex].value
                            const updatedDimensions = variants.dimensions.filter((_, i) => i !== dimensionIndex)
                            const updatedCombinations = variants.combinations.filter(
                              (c) => c.dimensionValue !== dimensionValue,
                            )

                            setVariants({
                              ...variants,
                              dimensions: updatedDimensions,
                              combinations: updatedCombinations,
                            })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material-Dimension Combinations Matrix */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-medium">Pricing & Stock Matrix</h3>
                  <p className="text-sm text-muted-foreground">
                    Set prices and stock status for each material and dimension combination. You can leave material or
                    dimension blank if needed.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-muted"></th>
                          {variants.dimensions.length > 0 ? (
                            variants.dimensions.map((dimension, i) => (
                              <th key={i} className="border p-2 bg-muted text-center">
                                {dimension.value || "Blank Dimension"}
                              </th>
                            ))
                          ) : (
                            <th className="border p-2 bg-muted text-center">No Dimension</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {variants.materials.length > 0 ? (
                          variants.materials.map((material, materialIndex) => (
                            <tr key={materialIndex}>
                              <td className="border p-2 font-medium bg-muted">{material.name || "Blank Material"}</td>
                              {variants.dimensions.length > 0 ? (
                                variants.dimensions.map((dimension, dimensionIndex) => {
                                  // Find existing combination or create default
                                  const combination = variants.combinations.find(
                                    (c) => c.materialName === material.name && c.dimensionValue === dimension.value,
                                  ) || {
                                    materialName: material.name,
                                    dimensionValue: dimension.value,
                                    price: 0,
                                    inStock: true,
                                  }

                                  return (
                                    <td key={dimensionIndex} className="border p-2">
                                      <div className="space-y-2">
                                        <div>
                                          <Label
                                            htmlFor={`price-${materialIndex}-${dimensionIndex}`}
                                            className="text-xs"
                                          >
                                            Price ($)
                                          </Label>
                                          <SafeInput
                                            id={`price-${materialIndex}-${dimensionIndex}`}
                                            type="number"
                                            step="0.01"
                                            value={combination.price}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                              const price = Number.parseFloat(e.target.value)
                                              const updatedCombinations = [...variants.combinations]

                                              // Find if this combination already exists
                                              const existingIndex = updatedCombinations.findIndex(
                                                (c) =>
                                                  c.materialName === material.name &&
                                                  c.dimensionValue === dimension.value,
                                              )

                                              if (existingIndex >= 0) {
                                                // Update existing combination
                                                updatedCombinations[existingIndex] = {
                                                  ...updatedCombinations[existingIndex],
                                                  price,
                                                }
                                              } else {
                                                // Add new combination
                                                updatedCombinations.push({
                                                  materialName: material.name,
                                                  dimensionValue: dimension.value,
                                                  price,
                                                  inStock: true,
                                                })
                                              }

                                              setVariants({
                                                ...variants,
                                                combinations: updatedCombinations,
                                              })
                                            }}
                                          />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id={`stock-${materialIndex}-${dimensionIndex}`}
                                            checked={combination.inStock}
                                            onCheckedChange={(checked) => {
                                              const updatedCombinations = [...variants.combinations]

                                              // Find if this combination already exists
                                              const existingIndex = updatedCombinations.findIndex(
                                                (c) =>
                                                  c.materialName === material.name &&
                                                  c.dimensionValue === dimension.value,
                                              )

                                              if (existingIndex >= 0) {
                                                // Update existing combination
                                                updatedCombinations[existingIndex] = {
                                                  ...updatedCombinations[existingIndex],
                                                  inStock: checked,
                                                }
                                              } else {
                                                // Add new combination
                                                updatedCombinations.push({
                                                  materialName: material.name,
                                                  dimensionValue: dimension.value,
                                                  price: 0,
                                                  inStock: checked,
                                                })
                                              }

                                              setVariants({
                                                ...variants,
                                                combinations: updatedCombinations,
                                              })
                                            }}
                                          />
                                          <Label
                                            htmlFor={`stock-${materialIndex}-${dimensionIndex}`}
                                            className="text-xs"
                                          >
                                            In Stock
                                          </Label>
                                        </div>
                                      </div>
                                    </td>
                                  )
                                })
                              ) : (
                                <td className="border p-2">
                                  <div className="space-y-2">
                                    <div>
                                      <Label htmlFor={`price-${materialIndex}-0`} className="text-xs">
                                        Price ($)
                                      </Label>
                                      <SafeInput
                                        id={`price-${materialIndex}-0`}
                                        type="number"
                                        step="0.01"
                                        value={
                                          variants.combinations.find(
                                            (c) => c.materialName === material.name && !c.dimensionValue,
                                          )?.price || 0
                                        }
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          const price = Number.parseFloat(e.target.value)
                                          const updatedCombinations = [...variants.combinations]

                                          // Find if this combination already exists
                                          const existingIndex = updatedCombinations.findIndex(
                                            (c) => c.materialName === material.name && !c.dimensionValue,
                                          )

                                          if (existingIndex >= 0) {
                                            // Update existing combination
                                            updatedCombinations[existingIndex] = {
                                              ...updatedCombinations[existingIndex],
                                              price,
                                            }
                                          } else {
                                            // Add new combination
                                            updatedCombinations.push({
                                              materialName: material.name,
                                              dimensionValue: "",
                                              price,
                                              inStock: true,
                                            })
                                          }

                                          setVariants({
                                            ...variants,
                                            combinations: updatedCombinations,
                                          })
                                        }}
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id={`stock-${materialIndex}-0`}
                                        checked={
                                          variants.combinations.find(
                                            (c) => c.materialName === material.name && !c.dimensionValue,
                                          )?.inStock ?? true
                                        }
                                        onCheckedChange={(checked) => {
                                          const updatedCombinations = [...variants.combinations]

                                          // Find if this combination already exists
                                          const existingIndex = updatedCombinations.findIndex(
                                            (c) => c.materialName === material.name && !c.dimensionValue,
                                          )

                                          if (existingIndex >= 0) {
                                            // Update existing combination
                                            updatedCombinations[existingIndex] = {
                                              ...updatedCombinations[existingIndex],
                                              inStock: checked,
                                            }
                                          } else {
                                            // Add new combination
                                            updatedCombinations.push({
                                              materialName: material.name,
                                              dimensionValue: "",
                                              price: 0,
                                              inStock: checked,
                                            })
                                          }

                                          setVariants({
                                            ...variants,
                                            combinations: updatedCombinations,
                                          })
                                        }}
                                      />
                                      <Label htmlFor={`stock-${materialIndex}-0`} className="text-xs">
                                        In Stock
                                      </Label>
                                    </div>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="border p-2 font-medium bg-muted">No Material</td>
                            {variants.dimensions.length > 0 ? (
                              variants.dimensions.map((dimension, dimensionIndex) => (
                                <td key={dimensionIndex} className="border p-2">
                                  <div className="space-y-2">
                                    <div>
                                      <Label htmlFor={`price-0-${dimensionIndex}`} className="text-xs">
                                        Price ($)
                                      </Label>
                                      <SafeInput
                                        id={`price-0-${dimensionIndex}`}
                                        type="number"
                                        step="0.01"
                                        value={
                                          variants.combinations.find(
                                            (c) => !c.materialName && c.dimensionValue === dimension.value,
                                          )?.price || 0
                                        }
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          const price = Number.parseFloat(e.target.value)
                                          const updatedCombinations = [...variants.combinations]

                                          // Find if this combination already exists
                                          const existingIndex = updatedCombinations.findIndex(
                                            (c) => !c.materialName && c.dimensionValue === dimension.value,
                                          )

                                          if (existingIndex >= 0) {
                                            // Update existing combination
                                            updatedCombinations[existingIndex] = {
                                              ...updatedCombinations[existingIndex],
                                              price,
                                            }
                                          } else {
                                            // Add new combination
                                            updatedCombinations.push({
                                              materialName: "",
                                              dimensionValue: dimension.value,
                                              price: 0,
                                              inStock: true,
                                            })
                                          }

                                          setVariants({
                                            ...variants,
                                            combinations: updatedCombinations,
                                          })
                                        }}
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id={`stock-0-${dimensionIndex}`}
                                        checked={
                                          variants.combinations.find(
                                            (c) => !c.materialName && c.dimensionValue === dimension.value,
                                          )?.inStock ?? true
                                        }
                                        onCheckedChange={(checked) => {
                                          const updatedCombinations = [...variants.combinations]

                                          // Find if this combination already exists
                                          const existingIndex = updatedCombinations.findIndex(
                                            (c) => !c.materialName && c.dimensionValue === dimension.value,
                                          )

                                          if (existingIndex >= 0) {
                                            // Update existing combination
                                            updatedCombinations[existingIndex] = {
                                              ...updatedCombinations[existingIndex],
                                              inStock: checked,
                                            }
                                          } else {
                                            // Add new combination
                                            updatedCombinations.push({
                                              materialName: "",
                                              dimensionValue: dimension.value,
                                              price: 0,
                                              inStock: true,
                                            })
                                          }

                                          setVariants({
                                            ...variants,
                                            combinations: updatedCombinations,
                                          })
                                        }}
                                      />
                                      <Label htmlFor={`stock-0-${dimensionIndex}`} className="text-xs">
                                        In Stock
                                      </Label>
                                    </div>
                                  </div>
                                </td>
                              ))
                            ) : (
                              <td className="border p-2">
                                <div className="space-y-2">
                                  <div>
                                    <Label htmlFor="price-0-0" className="text-xs">
                                      Price ($)
                                    </Label>
                                    <SafeInput
                                      id="price-0-0"
                                      type="number"
                                      step="0.01"
                                      value={
                                        variants.combinations.find((c) => !c.materialName && !c.dimensionValue)
                                          ?.price || 0
                                      }
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const price = Number.parseFloat(e.target.value)
                                        const updatedCombinations = [...variants.combinations]

                                        // Find if this combination already exists
                                        const existingIndex = updatedCombinations.findIndex(
                                          (c) => !c.materialName && !c.dimensionValue,
                                        )

                                        if (existingIndex >= 0) {
                                          // Update existing combination
                                          updatedCombinations[existingIndex] = {
                                            ...updatedCombinations[existingIndex],
                                            price,
                                          }
                                        } else {
                                          // Add new combination
                                          updatedCombinations.push({
                                            materialName: "",
                                            dimensionValue: "",
                                            price: 0,
                                            inStock: true,
                                          })
                                        }

                                        setVariants({
                                          ...variants,
                                          combinations: updatedCombinations,
                                        })
                                      }}
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="stock-0-0"
                                      checked={
                                        variants.combinations.find((c) => !c.materialName && !c.dimensionValue)
                                          ?.inStock ?? true
                                      }
                                      onCheckedChange={(checked) => {
                                        const updatedCombinations = [...variants.combinations]

                                        // Find if this combination already exists
                                        const existingIndex = updatedCombinations.findIndex(
                                          (c) => !c.materialName && !c.dimensionValue,
                                        )

                                        if (existingIndex >= 0) {
                                          // Update existing combination
                                          updatedCombinations[existingIndex] = {
                                            ...updatedCombinations[existingIndex],
                                            inStock: checked,
                                          }
                                        } else {
                                          // Add new combination
                                          updatedCombinations.push({
                                            materialName: "",
                                            dimensionValue: "",
                                            price: 0,
                                            inStock: true,
                                          })
                                        }

                                        setVariants({
                                          ...variants,
                                          combinations: updatedCombinations,
                                        })
                                      }}
                                    />
                                    <Label htmlFor="stock-0-0" className="text-xs">
                                      In Stock
                                    </Label>
                                  </div>
                                </div>
                              </td>
                            )}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add-ons Section */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Add-ons</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setVariants({
                          ...variants,
                          addOns: [...variants.addOns, { name: "", price: 0, selected: false }],
                        })
                      }}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Add-on
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {variants.addOns.map((addon, addonIndex) => (
                      <div key={addonIndex} className="flex items-center space-x-2 border p-3 rounded-md">
                        <div className="flex-grow grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`addon-name-${addonIndex}`} className="text-xs">
                              Add-on Name
                            </Label>
                            <SafeInput
                              id={`addon-name-${addonIndex}`}
                              value={addon.name}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const updatedAddOns = [...variants.addOns]
                                updatedAddOns[addonIndex].name = e.target.value
                                setVariants({
                                  ...variants,
                                  addOns: updatedAddOns,
                                })
                              }}
                              placeholder="e.g., Metal Frame"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`addon-price-${addonIndex}`} className="text-xs">
                              Price ($)
                            </Label>
                            <SafeInput
                              id={`addon-price-${addonIndex}`}
                              type="number"
                              step="0.01"
                              value={addon.price}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const updatedAddOns = [...variants.addOns]
                                updatedAddOns[addonIndex].price = Number.parseFloat(e.target.value)
                                setVariants({
                                  ...variants,
                                  addOns: updatedAddOns,
                                })
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`addon-selected-${addonIndex}`}
                              checked={addon.selected || false}
                              onCheckedChange={(checked) => {
                                const updatedAddOns = [...variants.addOns]
                                updatedAddOns[addonIndex].selected = checked === true
                                setVariants({
                                  ...variants,
                                  addOns: updatedAddOns,
                                })
                              }}
                            />
                            <Label htmlFor={`addon-selected-${addonIndex}`} className="text-xs cursor-pointer">
                              Default
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updatedAddOns = variants.addOns.filter((_, i) => i !== addonIndex)
                              setVariants({
                                ...variants,
                                addOns: updatedAddOns,
                              })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {formError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {formError}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping & Warranty Tab (renamed from Shipping & Returns) */}
        <TabsContent value="shipping" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <SafeInput id="deliveryTime" {...form.register("deliveryTime")} placeholder="e.g., 2-3 weeks" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty</Label>
              <SafeInput id="warranty" {...form.register("warranty")} placeholder="e.g., 2-year warranty" />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>

        <div className="flex space-x-2">
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={openDeleteDialog}
              disabled={isDeleting || isSubmitting}
            >
              Delete Product
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Confirm Product Deletion
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product
              <span className="font-semibold"> {initialData?.name}</span> and remove all associated data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-slug" className="text-sm font-medium">
                To confirm, type the product slug: <span className="font-bold">{initialData?.slug}</span>
              </Label>
              <Input
                id="confirm-slug"
                value={confirmSlug}
                onChange={(e) => setConfirmSlug(e.target.value)}
                placeholder={initialData?.slug}
                className={deleteError ? "border-red-500" : ""}
              />
              {deleteError && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3" /> {deleteError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmSlug !== initialData?.slug || isDeleting}
              className="gap-1"
            >
              {isDeleting ? (
                <>Deleting...</>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" /> Delete Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
