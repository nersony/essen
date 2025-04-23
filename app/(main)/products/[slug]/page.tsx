import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProductBySlug } from "@/app/actions/product-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, RefreshCcw, Shield } from "lucide-react"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Fix: Ensure params.slug is properly handled
  const slug = params?.slug || ""
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
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
              src={product.images[0] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square relative border rounded-md overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg?height=150&width=150"}
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
          <p className="text-2xl font-medium mb-6">${product.price.toFixed(2)}</p>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
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

          {/* Add to Cart Button - Replace CheckoutButton with AddToCartButton */}
          <AddToCartButton product={product} />

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
