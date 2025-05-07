"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import type { ProductFormData } from "@/lib/db/schema"

interface DataPreviewProps {
  data: Array<{
    original: Record<string, any>
    processed: Partial<ProductFormData>
    errors: string[]
    valid: boolean
  }>
  onBack: () => void
  onImport: (products: ProductFormData[]) => void
  isImporting: boolean
}

export function DataPreview({ data, onBack, onImport, isImporting }: DataPreviewProps) {
  const [selectedTab, setSelectedTab] = useState<"overview" | "valid" | "invalid">("overview")

  // Count valid and invalid products
  const validProducts = data.filter((item) => item.valid)
  const invalidProducts = data.filter((item) => !item.valid)

  // Handle import
  const handleImport = () => {
    onImport(validProducts.map((item) => item.processed as ProductFormData))
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
                    <p className="text-3xl font-bold">{data.length}</p>
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
                        {validProducts.length} product(s) are valid and ready to be imported. Click the "Import
                        Products" button to proceed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="valid" className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border p-2 text-left">#</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-left">Price</th>
                    <th className="border p-2 text-left">Materials</th>
                    <th className="border p-2 text-left">Dimensions</th>
                    <th className="border p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {validProducts.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
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
                      </td>
                    </tr>
                  ))}
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
                  </tr>
                </thead>
                <tbody>
                  {invalidProducts.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2 font-medium">{item.processed.name || `Row ${index + 1}`}</td>
                      <td className="border p-2">
                        <ul className="list-disc pl-5 space-y-1">
                          {item.errors.map((error, errorIndex) => (
                            <li key={errorIndex} className="text-red-600 text-sm">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
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
          disabled={validProducts.length === 0 || isImporting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isImporting ? "Importing..." : `Import ${validProducts.length} Products`}
        </Button>
      </CardFooter>
    </Card>
  )
}
