// app/products/[slug]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProductBySlug } from "@/app/actions/product-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clock, RefreshCcw, Shield } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Product, ProductVariant } from "@/lib/db/schema"
// Import the image utility at the top of the file
import { ensureCorrectImagePath } from "@/lib/image-utils"
// Import React's use function
import { use } from "react"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

interface VariantCombination {
  id: string
  materialName: string
  dimensionValue: string
  price: number
  inStock: boolean
}

export default function ProductPage({ params }: ProductPageProps) {
  // Use React.use() to unwrap the params Promise
  const { slug } = use(params)

  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedMaterial, setSelectedMaterial] = useState<string>("")
  const [selectedDimension, setSelectedDimension] = useState<string>("")
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({})
  const [currentCombination, setCurrentCombination] = useState<VariantCombination | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      const productData = await getProductBySlug(slug)

      if (!productData) {
        router.push("/not-found")
        return
      }

      setProduct(productData)

      // Set default selected image
      if (productData.images && productData.images.length > 0) {
        setSelectedImage(productData.images[0])
      }

      // Set default selected variant if variants exist
      if (productData.variants && productData.variants.length > 0) {
        const variant = productData.variants[0]

        // Set default material and dimension
        if (variant.materials && variant.materials.length > 0) {
          setSelectedMaterial(variant.materials[0].name)
        }

        if (variant.dimensions && variant.dimensions.length > 0) {
          setSelectedDimension(variant.dimensions[0].value)
        }

        // Find the combination for the selected material and dimension
        if (variant.combinations && variant.combinations.length > 0) {
          const defaultMaterial = variant.materials[0]?.name
          const defaultDimension = variant.dimensions[0]?.value

          const combination = variant.combinations.find(
            (c) => c.materialName === defaultMaterial && c.dimensionValue === defaultDimension,
          )

          if (combination) {
            setCurrentCombination(combination)
          }
        }

        // Initialize selected add-ons
        if (variant.addOns) {
          const initialAddOns: Record<string, boolean> = {}
          variant.addOns.forEach((addon) => {
            initialAddOns[addon.name] = addon.selected || false
          })
          setSelectedAddOns(initialAddOns)
        }
      }

      setIsLoading(false)
    }

    fetchProduct()
  }, [slug, router])

  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setSelectedMaterial(variant.material)
    setSelectedDimension(variant.dimension)

    // If variant has images, select the first one
    if (variant.images && variant.images.length > 0) {
      setSelectedImage(variant.images[0])
    }

    // Update selected add-ons for this variant
    if (variant.addOns) {
      const variantAddOns: Record<string, boolean> = {}
      variant.addOns.forEach((addon) => {
        variantAddOns[addon.name] = addon.selected || false
      })
      setSelectedAddOns(variantAddOns)
    } else {
      setSelectedAddOns({})
    }
  }

  // Handle material selection
  const handleMaterialSelect = (materialName: string) => {
    setSelectedMaterial(materialName)

    // Update the current combination
    if (product?.variants && product.variants.length > 0) {
      const variant = product.variants[0]
      const combination = variant.combinations.find(
        (c) => c.materialName === materialName && c.dimensionValue === selectedDimension,
      )

      if (combination) {
        setCurrentCombination(combination)
      }
    }
  }

  // Handle dimension selection
  const handleDimensionSelect = (dimensionValue: string) => {
    setSelectedDimension(dimensionValue)

    // Update the current combination
    if (product?.variants && product.variants.length > 0) {
      const variant = product.variants[0]
      const combination = variant.combinations.find(
        (c) => c.materialName === selectedMaterial && c.dimensionValue === dimensionValue,
      )

      if (combination) {
        setCurrentCombination(combination)
      }
    }
  }

  // Handle add-on selection
  const handleAddOnChange = (name: string, checked: boolean) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Calculate total price including material, dimension, and add-ons
  const calculateTotalPrice = () => {
    if (!product) return 0

    // Start with the combination price or product base price
    let total = currentCombination?.price || product.price

    // Add price of selected add-ons
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0]

      if (variant.addOns) {
        variant.addOns.forEach((addon) => {
          if (selectedAddOns[addon.name]) {
            total += addon.price
          }
        })
      }
    }

    return total
  }

  // Add a function to check if the current combination is in stock
  const isCurrentCombinationInStock = () => {
    return currentCombination?.inStock ?? true
  }

  if (isLoading || !product) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-md"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-muted rounded w-1/5 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-10 bg-muted rounded w-1/3 mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-6">
        <Link href="/products" className="text-primary hover:underline flex items-center">
          &larr; Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative border rounded-md overflow-hidden">
            <Image
              src={ensureCorrectImagePath(
                selectedImage || product.images[0] || "/placeholder.svg?height=600&width=600",
              )}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square relative border rounded-md overflow-hidden cursor-pointer ${
                    selectedImage === image ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={ensureCorrectImagePath(image || "/placeholder.svg?height=150&width=150")}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2 uppercase">{product.name}</h1>
          <p className="text-sm text-muted-foreground uppercase mb-4">{product.category}</p>
          <p className="text-2xl font-medium mb-6">${calculateTotalPrice().toFixed(2)}</p>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Material Selection */}
          {product.variants && product.variants[0]?.materials && product.variants[0].materials.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="font-medium">Material</h3>
              <RadioGroup
                value={selectedMaterial}
                onValueChange={handleMaterialSelect}
                className="grid grid-cols-2 gap-2"
              >
                {product.variants[0].materials.map((material, index) => (
                  <div key={index} className="flex items-start space-x-2 border rounded-md p-3">
                    <RadioGroupItem value={material.name} id={`material-${index}`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`material-${index}`} className="font-medium cursor-pointer">
                        {material.name}
                      </Label>
                      {material.description && <p className="text-sm text-muted-foreground">{material.description}</p>}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Dimension Selection */}
          {product.variants && product.variants[0]?.dimensions && product.variants[0].dimensions.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="font-medium">Dimension</h3>
              <RadioGroup
                value={selectedDimension}
                onValueChange={handleDimensionSelect}
                className="grid grid-cols-2 gap-2"
              >
                {product.variants[0].dimensions.map((dimension, index) => (
                  <div key={index} className="flex items-start space-x-2 border rounded-md p-3">
                    <RadioGroupItem value={dimension.value} id={`dimension-${index}`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`dimension-${index}`} className="font-medium cursor-pointer">
                        {dimension.value}
                      </Label>
                      {dimension.description && (
                        <p className="text-sm text-muted-foreground">{dimension.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Add-ons */}
          {product.variants && product.variants[0]?.addOns && product.variants[0].addOns.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="font-medium uppercase">Add-ons</h3>
              <div className="space-y-2">
                {product.variants[0].addOns.map((addon, index) => (
                  <div key={index} className="flex items-start space-x-2 border rounded-md p-3">
                    <Checkbox
                      id={`addon-${index}`}
                      checked={selectedAddOns[addon.name] || false}
                      onCheckedChange={(checked) => handleAddOnChange(addon.name, checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`addon-${index}`} className="font-medium cursor-pointer">
                        {addon.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">+${addon.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          {selectedVariant && (
            <div className="mb-6 border rounded-md p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Price Breakdown</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>${selectedVariant.basePrice.toFixed(2)}</span>
                </div>

                {/* Material adjustment */}
                {selectedVariant.materialOptions &&
                  (() => {
                    const materialOption = selectedVariant.materialOptions.find((m) => m.name === selectedMaterial)
                    if (materialOption && materialOption.priceAdjustment !== 0) {
                      return (
                        <div className="flex justify-between">
                          <span>{selectedMaterial} Adjustment:</span>
                          <span>
                            {materialOption.priceAdjustment > 0
                              ? `+$${materialOption.priceAdjustment.toFixed(2)}`
                              : `-$${Math.abs(materialOption.priceAdjustment).toFixed(2)}`}
                          </span>
                        </div>
                      )
                    }
                    return null
                  })()}

                {/* Dimension adjustment */}
                {selectedVariant.dimensionOptions &&
                  (() => {
                    const dimensionOption = selectedVariant.dimensionOptions.find((d) => d.value === selectedDimension)
                    if (dimensionOption && dimensionOption.priceAdjustment !== 0) {
                      return (
                        <div className="flex justify-between">
                          <span>{selectedDimension} Adjustment:</span>
                          <span>
                            {dimensionOption.priceAdjustment > 0
                              ? `+$${dimensionOption.priceAdjustment.toFixed(2)}`
                              : `-$${Math.abs(dimensionOption.priceAdjustment).toFixed(2)}`}
                          </span>
                        </div>
                      )
                    }
                    return null
                  })()}

                {/* Add-ons */}
                {selectedVariant.addOns && selectedVariant.addOns.some((addon) => selectedAddOns[addon.name]) && (
                  <>
                    {selectedVariant.addOns.map((addon, index) =>
                      selectedAddOns[addon.name] ? (
                        <div key={index} className="flex justify-between">
                          <span>{addon.name}:</span>
                          <span>+${addon.price.toFixed(2)}</span>
                        </div>
                      ) : null,
                    )}
                  </>
                )}

                <div className="border-t pt-1 mt-1 font-bold flex justify-between">
                  <span>Total:</span>
                  <span>${calculateTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Request Information Button */}
          <Button className="w-full mb-6">Request Information</Button>

          {/* Delivery, Returns, Warranty */}
          <div className="space-y-4 border-t pt-6 mt-6">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery time: {product.deliveryTime || "2-3 weeks"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RefreshCcw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Returns</h3>
                <p className="text-sm text-muted-foreground">{product.returnPolicy || "30-day return policy"}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Warranty</h3>
                <p className="text-sm text-muted-foreground">{product.warranty || "2-year warranty"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full border-b rounded-none justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="py-6">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="care" className="py-6">
            {product.careInstructions && product.careInstructions.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold mb-4">Care Instructions</h3>
                <ul className="space-y-2">
                  {product.careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Care instructions not available.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
