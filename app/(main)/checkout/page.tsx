"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Shipping cost calculation (simplified)
  const shipping = subtotal > 500 ? 0 : 50

  // Tax calculation (7% GST in Singapore)
  const tax = subtotal * 0.07

  // Total calculation
  const total = subtotal + shipping + tax

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    shippingAddress: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Singapore",
      phone: "",
    },
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.startsWith("shipping.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          shippingAddress: formData.shippingAddress,
          subtotal,
          shipping,
          tax,
          total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment")
      }

      // Clear the cart after successful order creation
      clearCart()

      // Redirect to HitPay payment page
      window.location.href = data.paymentUrl
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Redirect to products page if cart is empty
  if (items.length === 0) {
    return (
      <div className="container py-12 max-w-3xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to your cart before checking out.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/products" className="text-primary hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 order-2 lg:order-2">
          <div className="bg-secondary p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (7% GST)</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Contact Information</h2>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Shipping Address</h2>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping.fullName">Full Name</Label>
                  <Input
                    id="shipping.fullName"
                    name="shipping.fullName"
                    value={formData.shippingAddress.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping.addressLine1">Address Line 1</Label>
                  <Input
                    id="shipping.addressLine1"
                    name="shipping.addressLine1"
                    value={formData.shippingAddress.addressLine1}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping.addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="shipping.addressLine2"
                    name="shipping.addressLine2"
                    value={formData.shippingAddress.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping.city">City</Label>
                    <Input
                      id="shipping.city"
                      name="shipping.city"
                      value={formData.shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping.state">State/Province (Optional)</Label>
                    <Input
                      id="shipping.state"
                      name="shipping.state"
                      value={formData.shippingAddress.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping.postalCode">Postal Code</Label>
                    <Input
                      id="shipping.postalCode"
                      name="shipping.postalCode"
                      value={formData.shippingAddress.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping.country">Country</Label>
                    <Input
                      id="shipping.country"
                      name="shipping.country"
                      value={formData.shippingAddress.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping.phone">Phone Number</Label>
                  <Input
                    id="shipping.phone"
                    name="shipping.phone"
                    value={formData.shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              <CreditCard className="mr-2 h-4 w-4" />
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
