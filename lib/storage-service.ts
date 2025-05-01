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

const BUCKET_NAME = "assets-xyzap"
const CDN_ENDPOINT = "https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com"

// Upload a file to DigitalOcean Spaces
export async function uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    // Generate a unique file name to prevent collisions
    const uniqueFileName = `${Date.now()}-${uuidv4()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    // Define the path in the bucket
    const filePath = `products/${uniqueFileName}`

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
    // Extract the file path from the CDN URL
    const filePath = fileUrl.replace(`${CDN_ENDPOINT}/`, "")

    // Delete the file
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
      }),
    )

    return true
  } catch (error) {
    console.error("Failed to delete file from DigitalOcean Spaces:", error)
    return false
  }
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
