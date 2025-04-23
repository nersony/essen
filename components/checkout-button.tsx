"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface CheckoutButtonProps {
  productSlug: string
  productName: string
  productPrice: number
}

export function CheckoutButton({ productSlug, productName, productPrice }: CheckoutButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productSlug,
          quantity,
          customerEmail: email,
          customerName: name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment")
      }

      // Redirect to HitPay payment page
      window.location.href = data.paymentUrl
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your purchase of {productName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total</Label>
            <div className="col-span-3 font-medium">${(productPrice * quantity).toFixed(2)} SGD</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
