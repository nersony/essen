import { notFound } from "next/navigation"
import { getProductById } from "@/app/actions/product-actions"
import { ProductForm } from "@/components/product-form"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product: {product.name}</h1>
      <ProductForm initialData={product} isEditing />
    </div>
  )
}
