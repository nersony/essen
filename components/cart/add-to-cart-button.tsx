"use client"

import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/db/schema"

interface AddToCartButtonProps {
  product: Product
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
}

export function AddToCartButton({ product, variant = "default", size = "default" }: AddToCartButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className="w-full"
      onClick={() => {
        // Open a modal or navigate to contact page
        window.location.href = "/contact?product=" + product.slug
      }}
    >
      Request Information
    </Button>
  )
}
