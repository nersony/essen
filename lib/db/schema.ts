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
    role: "admin" | "editor"
    createdAt: Date
    updatedAt: Date
  }
  