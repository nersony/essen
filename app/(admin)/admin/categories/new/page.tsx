import { CategoryForm } from "@/components/category-form"

export default function NewCategoryPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Category</h1>
      <CategoryForm />
    </div>
  )
}
