export type Product = {
  id: string
  name: string
  slug: string
  category: string
  categoryId: string // Reference to the category
  price?: number // Make base price optional
  description: string
  features: string[]
  images: string[]
  careInstructions?: string[]
  deliveryTime?: string
  warranty?: string
  inStock: boolean
  isWeeklyBestSeller?: boolean // Add this field
  variants?: ProductVariant[]
  attributes?: Record<string, string[]> // Flexible attributes for filtering
  createdAt: Date
  updatedAt: Date
}

// Update the MaterialOption type
export type MaterialOption = {
  name: string
  description?: string
  image?: string
}

// Update the DimensionOption type
export type DimensionOption = {
  value: string
  description?: string
}

// Add a new type for material-dimension combinations
export type VariantCombination = {
  materialName: string
  dimensionValue: string
  price: number
  inStock: boolean
  sku?: string
  image?: string
}

export type AddOnOption = {
  id: string
  name: string
  description?: string
  price: number
}

// Update the ProductVariant type
export type ProductVariant = {
  id: string
  productId: string
  materials: MaterialOption[] // Available materials
  dimensions: DimensionOption[] // Available dimensions
  combinations: VariantCombination[] // Price and stock for each material-dimension combination
  addOns: AddOnOption[] // Available add-ons
}

export type Category = {
  id: string
  name: string
  slug: string
  parentId?: string // For hierarchical categories
  createdAt: Date
  updatedAt: Date
}

export type CategoryFormData = Omit<Category, "id" | "createdAt" | "updatedAt"> & {
  id?: string
}

export type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt"> & {
  id?: string
  variants?: Omit<ProductVariant, "id" | "productId">[]
  isWeeklyBestSeller?: boolean
}

export type UserRole = "super_admin" | "admin" | "editor" | "customer"

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export type ActivityLogAction =
  | "login"
  | "logout"
  | "create_product"
  | "update_product"
  | "delete_product"
  | "create_user"
  | "update_user"
  | "delete_user"
  | "view_logs"
  | "view_users"
  | "view_products"
  | "create_category"
  | "update_category"
  | "delete_category"

export type ActivityLog = {
  id: string
  userId: string
  userEmail: string
  action: ActivityLogAction
  details: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  entityId?: string // ID of the entity being acted upon (product, user, etc.)
  entityType?: string // Type of entity (product, user, etc.)
}

// New types for orders
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export type OrderItem = {
  productId: string
  productName: string
  productSlug: string
  price: number
  quantity: number
  image?: string
  variantId?: string
  variantName?: string
  variantAttributes?: Record<string, string>
  selectedMaterial?: string
  selectedDimension?: string
  selectedAddOns?: AddOnOption[] // Include selected add-ons
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
  referenceNumber: string
  notes?: string
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}

export type OrderFormData = Omit<Order, "id" | "createdAt" | "updatedAt"> & {
  id?: string
}
