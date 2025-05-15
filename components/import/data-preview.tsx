"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, AlertTriangle, RefreshCw, Undo2 } from "lucide-react"
import type { ProductFormData } from "@/lib/db/schema"

interface DataPreviewProps {
  data: Array<{
    original: Record<string, any>
    processed: Partial<ProductFormData>
    errors: string[]
    valid: boolean
  }>
  onBack: () => void
  onImport: (products: ProductFormData[], overwriteExisting: boolean) => void
  isImporting: boolean
}

export function DataPreview({ data, onBack, onImport, isImporting }: DataPreviewProps) {
  // Create a mutable copy of the data for tracking changes
  const [productData, setProductData] = useState<
    Array<{
      original: Record<string, any>
      processed: Partial<ProductFormData>
      errors: string[]
      valid: boolean
      movedFromInvalid?: boolean
      originalErrors?: string[]
    }>
  >([])

  // Initialize product data from props
  useEffect(() => {
    setProductData(data.map((item) => ({ ...item })))
  }, [data])

  const [selectedTab, setSelectedTab] = useState<"overview" | "valid" | "invalid">("overview")
  const [selectedProducts, setSelectedProducts] = useState<Record<number, boolean>>({})

  // Update selected products when product data changes
  useEffect(() => {
    setSelectedProducts(
      productData.reduce(
        (acc, item, index) => {
          if (item.valid) {
            acc[index] = true
          }
          return acc
        },
        {} as Record<number, boolean>,
      ),
    )
  }, [productData])

  // Count valid and invalid products
  const validProducts = productData.filter((item) => item.valid)
  const invalidProducts = productData.filter((item) => !item.valid)

  // Count selected products
  const selectedCount = Object.values(selectedProducts).filter(Boolean).length

  // Count products that were moved from invalid to valid (overwritten)
  const overwrittenCount = productData.filter((item) => item.valid && item.movedFromInvalid).length

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    const newSelected: Record<number, boolean> = {}
    productData.forEach((item, index) => {
      if (item.valid) {
        newSelected[index] = checked
      }
    })
    setSelectedProducts(newSelected)
  }

  // Handle individual selection
  const handleSelectProduct = (index: number, checked: boolean) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [index]: checked,
    }))
  }

  // Handle import
  const handleImport = () => {
    const selectedProductsData = productData
      .filter((_, index) => selectedProducts[index])
      .map((item) => item.processed as ProductFormData)

    // Check if any products were moved from invalid to valid (overwritten)
    const hasOverwrittenProducts = productData.some(
      (item, index) => selectedProducts[index] && item.valid && item.movedFromInvalid,
    )

    // Pass the overwrite flag based on whether any selected products were explicitly overwritten
    onImport(selectedProductsData, hasOverwrittenProducts)
  }

  // Check if all valid products are selected
  const areAllSelected =
    validProducts.length > 0 &&
    validProducts.every((_, index) => {
      const dataIndex = productData.findIndex((item) => item === validProducts[index])
      return selectedProducts[dataIndex]
    })

  // Check if a product has a duplicate slug error
  const hasDuplicateSlugError = (errors: string[]): boolean => {
    return errors.some((error) => error.includes("A product with slug") && error.includes("already exists"))
  }

  // Handle overwrite button click
  const handleOverwrite = (index: number) => {
    const updatedData = [...productData]
    const item = updatedData[index]

    // Store original errors for potential undo
    item.originalErrors = [...item.errors]

    // Remove the duplicate slug error
    item.errors = item.errors.filter(
      (error) => !(error.includes("A product with slug") && error.includes("already exists")),
    )

    // Mark as valid and as moved from invalid
    item.valid = item.errors.length === 0
    item.movedFromInvalid = true

    setProductData(updatedData)

    // If we're on the invalid tab and this was the last invalid product, switch to valid tab
    if (selectedTab === "invalid" && updatedData.filter((item) => !item.valid).length === 0) {
      setSelectedTab("valid")
    }
  }

  // Handle undo button click
  const handleUndo = (index: number) => {
    const updatedData = [...productData]
    const item = updatedData[index]

    // Restore original errors
    if (item.originalErrors) {
      item.errors = [...item.originalErrors]
    }

    // Mark as invalid and remove moved flag
    item.valid = false
    item.movedFromInvalid = false

    setProductData(updatedData)

    // If we're on the valid tab and this was the last valid product, switch to invalid tab
    if (selectedTab === "valid" && updatedData.filter((item) => item.valid).length === 0) {
      setSelectedTab("invalid")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>Review Import Data</CardTitle>
        <CardDescription>Review the data before importing. Only valid products will be imported.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
          <TabsList className="w-full rounded-none border-b justify-start p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="valid"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500"
              disabled={validProducts.length === 0}
            >
              Valid Products ({validProducts.length})
            </TabsTrigger>
            <TabsTrigger
              value="invalid"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500"
              disabled={invalidProducts.length === 0}
            >
              Invalid Products ({invalidProducts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-slate-500">Total Products</p>
                    <p className="text-3xl font-bold">{productData.length}</p>
                  </CardContent>
                </Card>
                <Card className={`${validProducts.length > 0 ? "bg-green-50" : "bg-slate-50"}`}>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p
                      className={`text-sm font-medium ${validProducts.length > 0 ? "text-green-600" : "text-slate-500"}`}
                    >
                      Valid Products
                    </p>
                    <p
                      className={`text-3xl font-bold ${validProducts.length > 0 ? "text-green-600" : "text-slate-500"}`}
                    >
                      {validProducts.length}
                    </p>
                  </CardContent>
                </Card>
                <Card className={`${invalidProducts.length > 0 ? "bg-red-50" : "bg-slate-50"}`}>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p
                      className={`text-sm font-medium ${invalidProducts.length > 0 ? "text-red-600" : "text-slate-500"}`}
                    >
                      Invalid Products
                    </p>
                    <p
                      className={`text-3xl font-bold ${invalidProducts.length > 0 ? "text-red-600" : "text-slate-500"}`}
                    >
                      {invalidProducts.length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {invalidProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Attention Required</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        {invalidProducts.length} product(s) have validation errors and will not be imported. Please
                        review the "Invalid Products" tab for details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {validProducts.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Ready to Import</h4>
                      <p className="text-sm text-green-700 mt-1">
                        {validProducts.length} product(s) are valid and ready to be imported.
                        {selectedCount !== validProducts.length && (
                          <span className="font-medium"> You have selected {selectedCount} product(s) to import.</span>
                        )}
                        {overwrittenCount > 0 && (
                          <span className="font-medium"> {overwrittenCount} product(s) will be overwritten.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="valid" className="p-0">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={areAllSelected}
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select All
                </label>
              </div>
              <div className="text-sm text-slate-500">
                {selectedCount} of {validProducts.length} selected
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border p-2 text-left w-12"></th>
                    <th className="border p-2 text-left">#</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-left">Price</th>
                    <th className="border p-2 text-left">Materials</th>
                    <th className="border p-2 text-left">Dimensions</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {validProducts.map((item, index) => {
                    const dataIndex = productData.findIndex((d) => d === item)
                    return (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="border p-2">
                          <Checkbox
                            checked={selectedProducts[dataIndex] || false}
                            onCheckedChange={(checked) => handleSelectProduct(dataIndex, checked === true)}
                          />
                        </td>
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2 font-medium">{item.processed.name}</td>
                        <td className="border p-2">{item.processed.category}</td>
                        <td className="border p-2">
                          {item.processed.price ? `$${item.processed.price.toFixed(2)}` : "N/A"}
                        </td>
                        <td className="border p-2">
                          {item.processed.variants?.[0]?.materials?.map((m) => m.name).join(", ") || "N/A"}
                        </td>
                        <td className="border p-2">
                          {item.processed.variants?.[0]?.dimensions?.map((d) => d.value).join(", ") || "N/A"}
                        </td>
                        <td className="border p-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                          {item.movedFromInvalid && (
                            <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Overwritten
                            </Badge>
                          )}
                        </td>
                        <td className="border p-2">
                          {item.movedFromInvalid && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUndo(dataIndex)}
                              className="flex items-center text-amber-600 border-amber-200 hover:bg-amber-50"
                            >
                              <Undo2 className="h-3 w-3 mr-1" />
                              Undo
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="invalid" className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border p-2 text-left">#</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Errors</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invalidProducts.map((item, index) => {
                    const dataIndex = productData.findIndex((d) => d === item)
                    const hasDuplicateSlug = hasDuplicateSlugError(item.errors)

                    return (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2 font-medium">{item.processed.name || `Row ${index + 1}`}</td>
                        <td className="border p-2">
                          <ul className="list-disc pl-5 space-y-1">
                            {item.errors.map((error, errorIndex) => (
                              <li
                                key={errorIndex}
                                className={`text-sm ${
                                  error.includes("A product with slug") && error.includes("already exists")
                                    ? "text-amber-600"
                                    : "text-red-600"
                                }`}
                              >
                                {error}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="border p-2">
                          {hasDuplicateSlug && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOverwrite(dataIndex)}
                              className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Overwrite
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between bg-slate-50 border-t">
        <Button variant="outline" onClick={onBack} disabled={isImporting}>
          Back
        </Button>
        <Button
          onClick={handleImport}
          disabled={selectedCount === 0 || isImporting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isImporting ? "Importing..." : `Import ${selectedCount} Products`}
        </Button>
      </CardFooter>
    </Card>
  )
}
