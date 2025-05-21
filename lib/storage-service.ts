import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

// DigitalOcean Spaces configuration
const s3Client = new S3Client({
  region: "sgp1", // Singapore region
  endpoint: "https://sgp1.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || "",
    secretAccessKey: process.env.DO_SPACES_SECRET || "",
  },
})

const BUCKET_NAME = "assets-singabyte"
const CDN_ENDPOINT = "https://assets-singabyte.sgp1.cdn.digitaloceanspaces.com"
const PLACEHOLDER_IMAGE_URL = "https://assets-singabyte.sgp1.cdn.digitaloceanspaces.com/essen/products/placeholder.png"

// Check if an image URL is from DigitalOcean Spaces
export function isDigitalOceanImage(url: string): boolean {
  return url && typeof url === "string" && url.includes(CDN_ENDPOINT)
}

// Validate image URLs
export async function validateImageUrls(urls: string[]): Promise<{ valid: boolean; message?: string }> {
  // Check if all URLs are valid
  for (const url of urls) {
    // Allow the placeholder image URL
    if (url === "https://assets-singabyte.sgp1.cdn.digitaloceanspaces.com/essen/products/placeholder.png") {
      continue
    }

    // Check if URL is from DigitalOcean Spaces
    if (!url.includes("digitaloceanspaces.com")) {
      return {
        valid: false,
        message: `Invalid image URL: ${url}. URLs must be local paths or from approved domains.`,
      }
    }
  }

  return { valid: true }
}

// Helper function to validate a single image URL
function validateImageUrl(url: string): boolean {
  try {
    // Basic URL validation
    if (!url) return false

    // Check if it's a local upload, DigitalOcean CDN, or an external URL
    const isLocalUpload =
      url.startsWith("/uploads/") ||
      url.startsWith("/images/") ||
      url.startsWith("uploads/") ||
      url.startsWith("images/")

    const isDigitalOceanCDN =
      url.includes("assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen") ||
      url.includes("assets-xyzap.sgp1.cdn.digitaloceanspaces.com")

    const isExternalUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)

    return isLocalUpload || isDigitalOceanCDN || isExternalUrl
  } catch {
    return false
  }
}

// Upload a file to DigitalOcean Spaces
export async function uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    // Generate a unique file name to prevent collisions
    const uniqueFileName = `${Date.now()}-${uuidv4()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    // Define the path in the bucket
    const filePath = `essen/products/${uniqueFileName}`

    // Upload the file
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: file,
        ContentType: contentType,
        ACL: "public-read", // Make the file publicly accessible
      }),
    )

    // Return the CDN URL
    return `${CDN_ENDPOINT}/${filePath}`
  } catch (error) {
    console.error("Failed to upload file to DigitalOcean Spaces:", error)
    throw new Error("Failed to upload file")
  }
}

// Delete a file from DigitalOcean Spaces
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    // Skip deletion if this is the placeholder image
    if (fileUrl === PLACEHOLDER_IMAGE_URL) {
      console.log(`Skipping deletion of placeholder image: ${fileUrl}`)
      return true
    }

    // Check if the URL is from DigitalOcean Spaces
    if (!isDigitalOceanImage(fileUrl)) {
      console.log(`Skipping deletion of non-DigitalOcean image: ${fileUrl}`)
      return true // Not a failure, just not applicable
    }

    // Extract the file path from the CDN URL
    const filePath = fileUrl.replace(`${CDN_ENDPOINT}/`, "")

    console.log(`Deleting file from DigitalOcean Spaces: ${filePath}`)

    // Delete the file
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
      }),
    )

    console.log(`Successfully deleted file: ${filePath}`)
    return true
  } catch (error) {
    console.error("Failed to delete file from DigitalOcean Spaces:", error)
    return false
  }
}

// Delete multiple files from DigitalOcean Spaces
export async function deleteMultipleFiles(fileUrls: string[]): Promise<{
  success: boolean
  deletedCount: number
  failedCount: number
  failedUrls: string[]
}> {
  const results = {
    success: true,
    deletedCount: 0,
    failedCount: 0,
    failedUrls: [] as string[],
  }

  if (!fileUrls || fileUrls.length === 0) {
    return results
  }

  // Filter out the placeholder image and only include DigitalOcean images
  const filesToDelete = fileUrls.filter((url) => url !== PLACEHOLDER_IMAGE_URL && isDigitalOceanImage(url))

  console.log(`Attempting to delete ${filesToDelete.length} images from DigitalOcean Spaces`)

  for (const url of filesToDelete) {
    try {
      const deleted = await deleteFile(url)
      if (deleted) {
        results.deletedCount++
      } else {
        results.failedCount++
        results.failedUrls.push(url)
      }
    } catch (error) {
      console.error(`Error deleting file ${url}:`, error)
      results.failedCount++
      results.failedUrls.push(url)
    }
  }

  // If any deletions failed, mark the overall operation as failed
  if (results.failedCount > 0) {
    results.success = false
  }

  return results
}

// Update the uploadImage function to use the new path
export async function uploadImage(file: File): Promise<string> {
  try {
    // Create form data for upload
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "essen") // Specify the essen folder

    // Upload to DigitalOcean Spaces via our API
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}
