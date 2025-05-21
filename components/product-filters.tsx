"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/app/actions/category-actions"
import { getProducts } from "@/app/actions/product-actions"
import type { Category, Product } from "@/lib/db/schema"

// Add this import at the top of the file
import { CustomRangeSlider } from "@/components/ui/custom-range-slider"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  // Update default price range to 0-10000
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({})
  const [availableAttributes, setAvailableAttributes] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Initialize filters from URL params
  useEffect(() => {
    const initFromParams = () => {
      const categoryParam = searchParams.get("category")
      if (categoryParam) {
        setSelectedCategories(categoryParam.split(","))
      }

      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      if (minPrice && maxPrice) {
        setPriceRange([Number.parseInt(minPrice), Number.parseInt(maxPrice)])
      }

      // Handle attribute filters from URL
      const attributeParams = Array.from(searchParams.entries())
        .filter(([key]) => key.startsWith("attr_"))
        .reduce(
          (acc, [key, value]) => {
            const attrName = key.replace("attr_", "")
            acc[attrName] = value.split(",")
            return acc
          },
          {} as Record<string, string[]>,
        )

      setSelectedAttributes(attributeParams)
    }

    initFromParams()
  }, [searchParams])

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [categoriesData, productsResponse] = await Promise.all([getCategories(), getProducts()])

        setCategories(categoriesData)

        // Access the products array from the response
        const productsData = productsResponse.products

        setProducts(productsData)

        // Extract available attributes from products
        const attributes: Record<string, Set<string>> = {}

        productsData.forEach((product) => {
          if (product.attributes) {
            Object.entries(product.attributes).forEach(([key, values]) => {
              if (!attributes[key]) {
                attributes[key] = new Set()
              }

              values.forEach((value) => attributes[key].add(value))
            })
          }
        })

        // Convert Sets to arrays
        const attributesObj: Record<string, string[]> = {}
        Object.entries(attributes).forEach(([key, valueSet]) => {
          attributesObj[key] = Array.from(valueSet).sort()
        })

        setAvailableAttributes(attributesObj)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()

    // Add category filter
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    }

    // Add price range
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    // Add attribute filters
    Object.entries(selectedAttributes).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(`attr_${key}`, values.join(","))
      }
    })

    router.push(`/products?${params.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([])

    // Updated default reset range to 0-10000
    setPriceRange([0, 10000])

    setSelectedAttributes({})
    router.push("/products")
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Toggle attribute selection
  const toggleAttribute = (attribute: string, value: string) => {
    setSelectedAttributes((prev) => {
      const current = prev[attribute] || []
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

      return {
        ...prev,
        [attribute]: updated,
      }
    })
  }

  if (isLoading) {
    return (
      <div className="animate-pulse p-4 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Categories</h3>
        <div className="max-h-48 overflow-y-auto pr-2 space-y-2 scrollbar-thin">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => toggleCategory(category.name)}
              />
              <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Price Range</h3>
        <div className="px-2">
          <CustomRangeSlider
            defaultValue={priceRange}
            min={0}
            // Updated max value to 10000
            max={10000}
            step={10}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-6"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">${priceRange[0]}</span>
            <span className="text-sm">${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Attribute filters */}
      {Object.entries(availableAttributes).map(([attribute, values]) => (
        <div key={attribute}>
          <h3 className="text-lg font-medium mb-2 capitalize">{attribute}</h3>
          <div className="space-y-2">
            {values.map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`attr-${attribute}-${value}`}
                  checked={(selectedAttributes[attribute] || []).includes(value)}
                  onCheckedChange={() => toggleAttribute(attribute, value)}
                />
                <label htmlFor={`attr-${attribute}-${value}`} className="text-sm cursor-pointer">
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col space-y-2 pt-4">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
