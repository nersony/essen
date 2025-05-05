import Link from "next/link"
import { getCategories } from "@/app/actions/category-actions"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function CategoriesPage() {
  const categories = await getCategories()

  // Debug log
  console.log(`Fetched ${categories.length} categories`)

  // Log category IDs for debugging
  categories.forEach((cat) => {
    console.log(`Category: ${cat.name}, ID: ${cat.id}, Type: ${typeof cat.id}`)
  })

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No categories found. Create your first category to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/categories/${category.id}`}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
