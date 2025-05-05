import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { logActivity } from "@/lib/activity-logger"
import { uploadFile } from "@/lib/storage-service"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "default"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 })
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to DigitalOcean Spaces
    const imageUrl = await uploadFile(buffer, file.name, file.type)

    // Log the activity - ensure user role is passed
    await logActivity(
      session.user.id,
      session.user.email,
      "upload_image",
      `Uploaded image: ${file.name}`,
      undefined,
      "image",
      session.user.role,
    )

    return NextResponse.json({ success: true, imageUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
