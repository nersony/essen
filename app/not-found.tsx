// app/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-medium">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/" className="essen-button-primary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}