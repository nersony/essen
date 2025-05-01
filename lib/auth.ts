import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail, updateLastLogin } from "@/lib/user-service"
import { verifyPassword } from "@/lib/user-service"
import { logActivity } from "@/lib/activity-logger"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user by email
        const user = await getUserByEmail(credentials.email)

        // Check if user exists
        if (!user) {
          return null
        }

        // Verify password
        const isPasswordValid = await verifyPassword(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Update last login time
        await updateLastLogin(user.id)

        // Log the login activity
        await logActivity(user.id, user.email, "login", `User logged in: ${user.email}`, user.id, "user")

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Middleware to check if user has required role
export function hasRequiredRole(requiredRoles: string[], userRole?: string): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}
