import { notFound } from "next/navigation"
import { getCategoryById } from "@/app/actions/category-actions"
import { CategoryForm } from "@/components/category-form"

interface CategoryEditPageProps {
  params: {
    id: string
  }
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const category = await getCategoryById(params.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Category: {category.name}</h1>
      <CategoryForm initialData={category} isEditing />
    </div>
  )
}
