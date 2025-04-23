"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { ShoppingCart, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/db/schema"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
}

export function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Add item to cart
    addItem(product, quantity)

    // Show success toast
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    // Reset button state after a short delay
    setTimeout(() => {
      setIsAdding(false)
    }, 1500)
  }

  return (
    <Button onClick={handleAddToCart} className="w-full" disabled={isAdding}>
      {isAdding ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
