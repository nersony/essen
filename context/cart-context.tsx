"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/db/schema"

export type CartItem = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

type CartProviderProps = {
  children: React.ReactNode
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("essen-cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("essen-cart", JSON.stringify(items))
    }
  }, [items, isInitialized])

  // Add item to cart
  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images[0] || "/placeholder.svg?height=100&width=100",
            quantity,
          },
        ]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
  }

  // Calculate total item count
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
