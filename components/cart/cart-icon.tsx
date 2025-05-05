"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

interface CartIconProps {
  onClick: () => void
}

export function CartIcon({ onClick }: CartIconProps) {
  const { itemCount } = useCart()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  )
}
