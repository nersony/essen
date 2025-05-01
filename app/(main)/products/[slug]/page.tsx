"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProductBySlug } from "@/app/actions/product-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clock, RefreshCcw, Shield } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/db/schema"
// Import the image utility at the top of the file
import { ensureCorrectImagePath } from "@/lib/image-utils"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      const slug = params?.slug || ""
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
        setSelectedVariant(productData.variants[0])
      }

      setIsLoading(false)
    }

    fetchProduct()
  }, [params, router])

  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)

    // If variant has images, select the first one
    if (variant.images && variant.images.length > 0) {
      setSelectedImage(variant.images[0])
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

  // Determine current price
  const currentPrice = selectedVariant ? selectedVariant.price : product.price

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
          <p className="text-2xl font-medium mb-6">${currentPrice.toFixed(2)}</p>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`border rounded-md px-4 py-2 text-sm transition-colors ${
                      selectedVariant?.id === variant.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => handleVariantSelect(variant)}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Options (if no variants) */}
          {(!product.variants || product.variants.length === 0) && product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <div key={color} className="border rounded-md px-4 py-2 text-sm">
                    {color}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button - Removed as requested */}
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
            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
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

          <TabsContent value="dimensions" className="py-6">
            {product.dimensions ? (
              <div>
                <h3 className="text-xl font-bold mb-4">Dimensions</h3>
                <ul className="space-y-2">
                  <li>Width: {product.dimensions.width} cm</li>
                  <li>Depth: {product.dimensions.depth} cm</li>
                  <li>Height: {product.dimensions.height} cm</li>
                </ul>
              </div>
            ) : (
              <p>Dimensions information not available.</p>
            )}
          </TabsContent>

          <TabsContent value="materials" className="py-6">
            {product.materials && product.materials.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold mb-4">Materials</h3>
                <ul className="space-y-2">
                  {product.materials.map((material, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Materials information not available.</p>
            )}
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
