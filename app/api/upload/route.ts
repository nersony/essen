import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { logActivity } from "@/lib/activity-logger"

// Configure S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  region: "sgp1", // Singapore region
  endpoint: "https://sgp1.digitaloceanspaces.com",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || "",
    secretAccessKey: process.env.DO_SPACES_SECRET || "",
  },
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin or super_admin role
    const userRole = session.user.role
    if (userRole !== "admin" && userRole !== "super_admin" && userRole !== "editor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    // Validate file type
    const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"]
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Generate unique filename
    const fileName = `${uuidv4()}.${fileExtension}`

    // Set the folder path to 'essen'
    const folderPath = "essen"
    const key = `${folderPath}/${fileName}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to DigitalOcean Spaces
    await s3Client.send(
      new PutObjectCommand({
        Bucket: "assets-xyzap",
        Key: key,
        Body: buffer,
        ACL: "public-read",
        ContentType: file.type,
      }),
    )

    // Return the URL to the uploaded file
    const imageUrl = `https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/${key}`

    // Log the activity
    await logActivity(
      session.user.id,
      session.user.email,
      "create_product", // Using create_product as a general action for uploads
      `Uploaded image: ${file.name}`,
      undefined,
      "image",
    )

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
