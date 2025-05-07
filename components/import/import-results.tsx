"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"

interface ImportResultsProps {
  results: Array<{
    index: number
    name: string
    success: boolean
    message: string
  }>
  onFinish: () => void
}

export function ImportResults({ results, onFinish }: ImportResultsProps) {
  // Count successful and failed imports
  const successCount = results.filter((result) => result.success).length
  const failureCount = results.length - successCount

  return (
    <Card className="w-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>Import Results</CardTitle>
        <CardDescription>Summary of the product import process.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-50">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Total Products</p>
                <p className="text-3xl font-bold">{results.length}</p>
              </CardContent>
            </Card>
            <Card className={`${successCount > 0 ? "bg-green-50" : "bg-slate-50"}`}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className={`text-sm font-medium ${successCount > 0 ? "text-green-600" : "text-slate-500"}`}>
                  Successfully Imported
                </p>
                <p className={`text-3xl font-bold ${successCount > 0 ? "text-green-600" : "text-slate-500"}`}>
                  {successCount}
                </p>
              </CardContent>
            </Card>
            <Card className={`${failureCount > 0 ? "bg-red-50" : "bg-slate-50"}`}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <p className={`text-sm font-medium ${failureCount > 0 ? "text-red-600" : "text-slate-500"}`}>
                  Failed to Import
                </p>
                <p className={`text-3xl font-bold ${failureCount > 0 ? "text-red-600" : "text-slate-500"}`}>
                  {failureCount}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results table */}
          <div className="overflow-x-auto border rounded-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border-b p-2 text-left">#</th>
                  <th className="border-b p-2 text-left">Product Name</th>
                  <th className="border-b p-2 text-left">Status</th>
                  <th className="border-b p-2 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className={`hover:bg-slate-50 ${result.success ? "" : "bg-red-50"}`}>
                    <td className="border-b p-2">{result.index + 1}</td>
                    <td className="border-b p-2 font-medium">{result.name}</td>
                    <td className="border-b p-2">
                      {result.success ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Success
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td className="border-b p-2">
                      <span className={result.success ? "text-green-600" : "text-red-600"}>{result.message}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end bg-slate-50 border-t">
        <Button onClick={onFinish} className="flex items-center">
          Go to Products
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
