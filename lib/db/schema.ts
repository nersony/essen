export type Product = {
  id: string
  name: string
  slug: string
  category: string
  price: number
  description: string
  features: string[]
  colors: string[]
  images: string[]
  dimensions?: {
    width: number
    depth: number
    height: number
  }
  materials?: string[]
  careInstructions?: string[]
  deliveryTime?: string
  returnPolicy?: string
  warranty?: string
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt"> & {
  id?: string
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "editor" | "customer"
  createdAt: Date
  updatedAt: Date
}

// New types for orders
export type OrderStatus =
  | "pending"
  | "payment_initiated"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export type OrderItem = {
  productId: string
  productName: string
  productSlug: string
  price: number
  quantity: number
  image?: string
}

export type ShippingAddress = {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone: string
}

export type Order = {
  id: string
  userId?: string // Optional for guest checkout
  customerEmail: string
  customerName: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentId?: string
  paymentProvider: "hitpay" | "cash" | "bank_transfer"
  referenceNumber: string
  notes?: string
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}

export type OrderFormData = Omit<Order, "id" | "createdAt" | "updatedAt"> & {
  id?: string
}
