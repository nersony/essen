import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// In a real app, you would use a database to store users
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@essen.sg",
    password: "password123", // In a real app, this would be hashed
  },
]

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
        const user = users.find((user) => user.email === credentials.email)

        // Check if user exists and password matches
        if (!user || user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  // Add a secret key for JWT encryption
  secret: process.env.NEXTAUTH_SECRET || "THIS_IS_AN_EXAMPLE_SECRET_THAT_SHOULD_BE_CHANGED",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ""
      }
      return session
    },
  },
  debug: true, // Enable debug mode to see more detailed logs
}
