"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProductBySlug } from "@/app/actions/product-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clock, Shield, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Product, ProductVariant } from "@/lib/db/schema"
// Import the image utility at the top of the file
import { ensureCorrectImagePath } from "@/lib/image-utils"
// Import React's use function
import { use } from "react"
import { toast } from "@/components/ui/use-toast"

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

        // Only set dimension if dimensions exist and are not empty
        if (variant.dimensions && variant.dimensions.length > 0) {
          // Find first valid dimension (that has at least one valid combination)
          let defaultDimension = ""
          for (const dimension of variant.dimensions) {
            const hasValidCombination = variant.combinations.some(
              (c) => c.dimensionValue === dimension.value && c.price > 0 && c.inStock === true,
            )

            if (hasValidCombination) {
              defaultDimension = dimension.value
              break
            }
          }

          // If no valid dimension found, just use the first one
          if (!defaultDimension && variant.dimensions.length > 0) {
            defaultDimension = variant.dimensions[0].value
          }

          setSelectedDimension(defaultDimension)
        }

        // Only set material if materials exist and are not empty
        if (variant.materials && variant.materials.length > 0) {
          // If we have a dimension, find valid materials for it
          if (selectedDimension) {
            const validMaterials = variant.materials.filter((material) =>
              variant.combinations.some(
                (c) =>
                  c.dimensionValue === selectedDimension &&
                  c.materialName === material.name &&
                  c.price > 0 &&
                  c.inStock === true,
              ),
            )

            // Set default material to first valid one
            if (validMaterials.length > 0) {
              setSelectedMaterial(validMaterials[0].name)

              // Find the combination for the selected dimension and material
              const combination = variant.combinations.find(
                (c) => c.dimensionValue === selectedDimension && c.materialName === validMaterials[0].name,
              )

              if (combination) {
                setCurrentCombination(combination)
              }
            } else if (variant.materials.length > 0) {
              // If no valid materials, just use the first one
              setSelectedMaterial(variant.materials[0].name)

              // Find any combination for this dimension and material
              const combination = variant.combinations.find(
                (c) => c.dimensionValue === selectedDimension && c.materialName === variant.materials[0].name,
              )

              if (combination) {
                setCurrentCombination(combination)
              }
            }
          } else {
            // No dimension, just set the first material
            setSelectedMaterial(variant.materials[0].name)

            // Find any combination for this material with empty dimension
            const combination = variant.combinations.find((c) => c.materialName === variant.materials[0].name)

            if (combination) {
              setCurrentCombination(combination)
            }
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

  // Get available materials for the selected dimension
  const availableMaterials = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) {
      return []
    }

    const variant = product.variants[0]

    // If no dimensions, return all materials
    if (!variant.dimensions || variant.dimensions.length === 0) {
      return variant.materials || []
    }

    // If no selected dimension, return empty array
    if (!selectedDimension) {
      return []
    }

    // Filter materials that have valid combinations with the selected dimension
    return variant.materials.filter((material) =>
      variant.combinations.some(
        (c) =>
          c.dimensionValue === selectedDimension &&
          c.materialName === material.name &&
          c.price > 0 &&
          c.inStock === true,
      ),
    )
  }, [product, selectedDimension])

  // Get all materials (for display purposes)
  const allMaterials = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) {
      return []
    }
    return product.variants[0].materials || []
  }, [product])

  // Check if a dimension has any valid combinations
  const hasDimensionValidCombinations = (dimensionValue: string) => {
    if (!product?.variants || product.variants.length === 0) return false

    const variant = product.variants[0]
    return variant.combinations.some((c) => c.dimensionValue === dimensionValue && c.price > 0 && c.inStock === true)
  }

  // Handle dimension selection
  const handleDimensionSelect = (dimensionValue: string) => {
    setSelectedDimension(dimensionValue)

    // Find valid materials for this dimension
    if (product?.variants && product.variants.length > 0) {
      const variant = product.variants[0]

      const validMaterials = variant.materials.filter((material) =>
        variant.combinations.some(
          (c) =>
            c.dimensionValue === dimensionValue &&
            c.materialName === material.name &&
            c.price > 0 &&
            c.inStock === true,
        ),
      )

      // Check if current material is valid for the new dimension
      const isCurrentMaterialValid = validMaterials.some((m) => m.name === selectedMaterial)

      // If current material is not valid for the new dimension, select the first valid material
      if (!isCurrentMaterialValid && validMaterials.length > 0) {
        setSelectedMaterial(validMaterials[0].name)

        // Update the current combination
        const combination = variant.combinations.find(
          (c) => c.dimensionValue === dimensionValue && c.materialName === validMaterials[0].name,
        )

        if (combination) {
          setCurrentCombination(combination)
        }
      } else {
        // Update the current combination for the existing material
        const combination = variant.combinations.find(
          (c) => c.dimensionValue === dimensionValue && c.materialName === selectedMaterial,
        )

        if (combination) {
          setCurrentCombination(combination)
        }
      }
    }
  }

  // Handle material selection
  const handleMaterialSelect = (materialName: string) => {
    setSelectedMaterial(materialName)

    // Update the current combination
    if (product?.variants && product.variants.length > 0) {
      const variant = product.variants[0]
      const combination = variant.combinations.find(
        (c) =>
          // If we have a dimension, match both
          (selectedDimension ? c.dimensionValue === selectedDimension : true) && c.materialName === materialName,
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
    let total = currentCombination?.price || product.price || 0

    // Add price of selected add-ons
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0]

      if (variant.addOns) {
        variant.addOns.forEach((addon) => {
          if (selectedAddOns[addon.name]) {
            total += addon.price || 0
          }
        })
      }
    }

    return total
  }

  // Check if the current combination is valid (has price > 0 and is in stock)
  const isCurrentCombinationValid = () => {
    // If no variants or combinations, just check if product has a price
    if (!product?.variants || product.variants.length === 0 || !currentCombination) {
      return product?.price > 0
    }

    return currentCombination.price > 0 && currentCombination.inStock === true
  }

  // Check if product has dimensions
  const hasDimensions = () => {
    return (
      product?.variants &&
      product.variants.length > 0 &&
      product.variants[0].dimensions &&
      product.variants[0].dimensions.length > 0
    )
  }

  // Check if product has materials
  const hasMaterials = () => {
    return (
      product?.variants &&
      product.variants.length > 0 &&
      product.variants[0].materials &&
      product.variants[0].materials.length > 0
    )
  }

  // Handle request information
  const handleRequestInformation = () => {
    if (!product) return

    try {
      // Get the current URL for the product page
      const productUrl = window.location.href

      // Get the selected add-ons
      const addOns = product.variants?.[0]?.addOns
        ?.filter((addon) => selectedAddOns[addon.name])
        .map((addon) => addon.name)
        .join(", ")

      // Create WhatsApp message with product details
      const message = `
*Product Information Request*

I'm interested in the following product:

*Product:* ${product.name}
*Price:* $${calculateTotalPrice().toFixed(2)}
${selectedDimension ? `*Dimension:* ${selectedDimension}` : ""}
${selectedMaterial ? `*Material:* ${selectedMaterial}` : ""}
${addOns ? `*Add-ons:* ${addOns}` : ""}

*Product Link:* ${productUrl}

Please provide more information about this product.
`.trim()

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message)

      // WhatsApp phone number - replace with your business WhatsApp number
      const phoneNumber = "6560190775" // Singapore number format

      // Generate WhatsApp URL
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank")

      // Show success message
      toast({
        title: "Request Sent",
        description: "WhatsApp is opening with your product inquiry. Please send the message to complete your request.",
      })
    } catch (error) {
      console.error("Error processing request:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    }
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
              src={
                ensureCorrectImagePath(
                  selectedImage ||
                    product.images[0] ||
                    "https://assets-singabyte.sgp1.cdn.digitaloceanspaces.com/essen/products/placeholder.png",
                ) || "/placeholder.svg"
              }
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
                    src={
                      ensureCorrectImagePath(
                        image ||
                          "https://assets-singabyte.sgp1.cdn.digitaloceanspaces.com/essen/products/placeholder.png",
                      ) || "/placeholder.svg"
                    }
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

          {/* Dimension Selection - Only show if dimensions exist */}
          {hasDimensions() && (
            <div className="space-y-3 mb-6">
              <h3 className="font-medium">Dimension</h3>
              <RadioGroup
                value={selectedDimension}
                onValueChange={handleDimensionSelect}
                className="grid grid-cols-2 gap-2"
              >
                {product.variants[0].dimensions.map((dimension, index) => {
                  const hasValidCombinations = hasDimensionValidCombinations(dimension.value)

                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-2 border rounded-md p-3 ${
                        !hasValidCombinations ? "opacity-50" : ""
                      }`}
                    >
                      <RadioGroupItem value={dimension.value} id={`dimension-${index}`} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={`dimension-${index}`} className="font-medium cursor-pointer">
                          {dimension.value}
                          {!hasValidCombinations && (
                            <div className="flex items-center text-xs text-amber-600 mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Limited options available
                            </div>
                          )}
                        </Label>
                        {dimension.description && (
                          <p className="text-sm text-muted-foreground">{dimension.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
          )}

          {/* Material Selection - Only show if materials exist */}
          {hasMaterials() && (
            <div className="space-y-3 mb-6">
              <h3 className="font-medium">Material</h3>

              {hasDimensions() && availableMaterials.length === 0 && (
                <div className="p-4 border border-amber-200 bg-amber-50 rounded-md mb-4">
                  <div className="flex items-center text-amber-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p>No available materials for the selected dimension. Please select a different dimension.</p>
                  </div>
                </div>
              )}

              <RadioGroup
                value={selectedMaterial}
                onValueChange={handleMaterialSelect}
                className="grid grid-cols-2 gap-2"
              >
                {allMaterials.map((material, index) => {
                  // Check if this material is available for the selected dimension
                  // If no dimensions, all materials are available
                  const isAvailable = !hasDimensions() || availableMaterials.some((m) => m.name === material.name)

                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-2 border rounded-md p-3 ${!isAvailable ? "opacity-50" : ""}`}
                    >
                      <RadioGroupItem
                        value={material.name}
                        id={`material-${index}`}
                        className="mt-1"
                        disabled={!isAvailable}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`material-${index}`}
                          className={`font-medium cursor-pointer ${!isAvailable ? "text-muted-foreground" : ""}`}
                        >
                          {material.name}
                          {!isAvailable && (
                            <div className="flex items-center text-xs text-red-500 mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Not available with selected dimension
                            </div>
                          )}
                        </Label>
                        {material.description && (
                          <p className="text-sm text-muted-foreground">{material.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
          )}

          {/* Warning if current combination is not valid */}
          {currentCombination && !isCurrentCombinationValid() && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-md mb-6">
              <div className="flex items-center text-red-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>
                  {currentCombination.price === 0
                    ? "This combination is not available for purchase."
                    : "This combination is currently out of stock."}
                </p>
              </div>
            </div>
          )}

          {/* Add-ons - Only show if add-ons exist */}
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
                      disabled={!isCurrentCombinationValid()}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`addon-${index}`} className="font-medium cursor-pointer">
                        {addon.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">+${(addon.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Information Button */}
          <div className="mb-6">
            <Button className="w-full" onClick={handleRequestInformation} disabled={!isCurrentCombinationValid()}>
              Request Information
            </Button>

            {!isCurrentCombinationValid() && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Cannot request information for unavailable combinations
              </p>
            )}
          </div>

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
              {product.features && product.features.length > 0 ? (
                product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))
              ) : (
                <li>No features listed for this product.</li>
              )}
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
