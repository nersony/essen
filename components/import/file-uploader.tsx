"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Upload, AlertCircle, Download } from "lucide-react"

interface FileUploaderProps {
  onFileSelected: (file: File) => void
  onTemplateDownload: () => void
  isProcessing: boolean
  errors: string[]
}

export function FileUploader({ onFileSelected, onTemplateDownload, isProcessing, errors }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  // Handle file selection
  const handleFile = (file: File) => {
    // Check if file is an Excel file
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.oasis.opendocument.spreadsheet",
    ]

    if (!validTypes.includes(file.type)) {
      alert("Please select a valid Excel file (.xls, .xlsx, or .ods)")
      return
    }

    setSelectedFile(file)
    onFileSelected(file)
  }

  // Handle button click to open file dialog
  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>Import Products from Excel</CardTitle>
        <CardDescription>Upload an Excel file (.xlsx, .xls, .ods) containing product data to import.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Template download button */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <Download className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Download Template</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Download our Excel template to ensure your data is formatted correctly for import.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={onTemplateDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>

          {/* File upload area */}
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-gray-300"
            } transition-colors`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.ods"
              onChange={handleChange}
              className="hidden"
              disabled={isProcessing}
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : "Drag and drop your Excel file here"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : "Supports .xlsx, .xls, and .ods files"}
                </p>
              </div>
              {!selectedFile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onButtonClick}
                  disabled={isProcessing}
                  className="mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
              )}
              {selectedFile && isProcessing && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Error messages */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t">
        <p className="text-sm text-muted-foreground">
          Need help? Check out our{" "}
          <a href="#" className="text-primary hover:underline">
            import guide
          </a>{" "}
          for detailed instructions.
        </p>
      </CardFooter>
    </Card>
  )
}
