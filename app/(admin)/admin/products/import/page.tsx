"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { parseExcelFile, parseExcelSheet, convertRowToProductData, generateFormattedTemplate } from "@/lib/excel-utils"
import { validateProduct, importProducts, getCategoriesForImport } from "@/app/actions/import-actions"
import { FileUploader } from "@/components/import/file-uploader"
import { ColumnMapper } from "@/components/import/column-mapper"
import { DataPreview } from "@/components/import/data-preview"
import { ImportResults } from "@/components/import/import-results"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ProductFormData, Category } from "@/lib/db/schema"

export default function ImportProductsPage() {
  const router = useRouter()
  const [step, setStep] = useState<"upload" | "sheet-select" | "map" | "preview" | "results">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<any[]>([])
  const [sheets, setSheets] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>("")
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [processedData, setProcessedData] = useState<
    Array<{
      original: Record<string, any>
      processed: Partial<ProductFormData>
      errors: string[]
      valid: boolean
    }>
  >([])
  const [importResults, setImportResults] = useState<
    Array<{
      index: number
      name: string
      success: boolean
      message: string
    }>
  >([])
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoriesForImport()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast({
          title: "Error",
          description: "Failed to fetch categories. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchCategories()
  }, [])

  // Handle file selection
  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile)
    setIsProcessing(true)
    setErrors([])

    try {
      const { headers, rows, errors, sheets, selectedSheet: defaultSheet } = await parseExcelFile(selectedFile)

      if (errors.length > 0) {
        setErrors(errors)
        return
      }

      if (sheets.length === 0) {
        setErrors(["The Excel file contains no sheets"])
        return
      }

      setSheets(sheets)

      if (sheets.length > 1) {
        // If there are multiple sheets, let the user select one
        setSelectedSheet(defaultSheet || sheets[0])
        setStep("sheet-select")
      } else {
        // If there's only one sheet, use it directly
        setHeaders(headers)
        setRows(rows)
        setStep("map")
      }
    } catch (error) {
      setErrors([`Failed to parse Excel file: ${error.message}`])
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle sheet selection
  const handleSheetSelect = async (sheet: string) => {
    setSelectedSheet(sheet)
    setIsProcessing(true)
    setErrors([])

    try {
      const { headers, rows, errors } = await parseExcelSheet(file!, sheet)

      if (errors.length > 0) {
        setErrors(errors)
        return
      }

      if (headers.length === 0 || rows.length === 0) {
        setErrors([`The sheet "${sheet}" is empty or has no valid data`])
        return
      }

      setHeaders(headers)
      setRows(rows)
      setStep("map")
    } catch (error) {
      setErrors([`Failed to parse sheet "${sheet}": ${error.message}`])
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle template download
  const handleTemplateDownload = () => {
    try {
      const excelData = generateFormattedTemplate(categories)

      // Create a blob from the Excel data
      const blob = new Blob([excelData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "product_import_template.xlsx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Template Downloaded",
        description: "The product import template has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: `Failed to download template: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  // Handle mapping completion
  const handleMappingComplete = async (mapping: Record<string, string>) => {
    setColumnMapping(mapping)
    setIsProcessing(true)

    try {
      // Convert Excel rows to product data
      const convertedData = await Promise.all(
        rows.map(async (row) => {
          // Convert row array to object with headers as keys
          const rowObj: Record<string, any> = {}
          headers.forEach((header, index) => {
            rowObj[header] = row[index]
          })

          // Convert to product data
          const { productData, errors: conversionErrors } = convertRowToProductData(rowObj, mapping, categories)

          // Validate the product data
          const { valid, errors: validationErrors } = await validateProduct(productData as ProductFormData)

          return {
            original: rowObj,
            processed: productData,
            errors: [...conversionErrors, ...validationErrors],
            valid: valid && conversionErrors.length === 0,
          }
        }),
      )

      setProcessedData(convertedData)
      setStep("preview")
    } catch (error) {
      setErrors([`Failed to process data: ${error.message}`])
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle import
  const handleImport = async (products: ProductFormData[]) => {
    setIsProcessing(true)

    try {
      const result = await importProducts(products)

      if (result.success) {
        toast({
          title: "Import Successful",
          description: result.message,
        })
      } else {
        toast({
          title: "Import Failed",
          description: result.message,
          variant: "destructive",
        })
      }

      setImportResults(result.results)
      setStep("results")
    } catch (error) {
      toast({
        title: "Import Failed",
        description: `Failed to import products: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle finish
  const handleFinish = () => {
    router.push("/admin/products")
  }

  // Render sheet selection
  const renderSheetSelection = () => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Select Excel Sheet</CardTitle>
          <CardDescription>
            Your Excel file contains multiple sheets. Please select which sheet contains your product data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <FileSpreadsheet className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">{file?.name}</p>
                <p className="text-sm text-muted-foreground">{sheets.length} sheets available</p>
              </div>
            </div>

            <Select value={selectedSheet} onValueChange={setSelectedSheet}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a sheet" />
              </SelectTrigger>
              <SelectContent>
                {sheets.map((sheet) => (
                  <SelectItem key={sheet} value={sheet}>
                    {sheet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("upload")}>
            Back
          </Button>
          <Button onClick={() => handleSheetSelect(selectedSheet)} disabled={!selectedSheet || isProcessing}>
            {isProcessing ? "Processing..." : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case "upload":
        return (
          <FileUploader
            onFileSelected={handleFileSelected}
            onTemplateDownload={handleTemplateDownload}
            isProcessing={isProcessing}
            errors={errors}
          />
        )

      case "sheet-select":
        return renderSheetSelection()

      case "map":
        return (
          <ColumnMapper
            headers={headers}
            onMappingComplete={handleMappingComplete}
            onCancel={() => setStep(sheets.length > 1 ? "sheet-select" : "upload")}
          />
        )

      case "preview":
        return (
          <DataPreview
            data={processedData}
            onBack={() => setStep("map")}
            onImport={handleImport}
            isImporting={isProcessing}
          />
        )

      case "results":
        return <ImportResults results={importResults} onFinish={handleFinish} />
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Import Products</h1>
      {renderStep()}
    </div>
  )
}
