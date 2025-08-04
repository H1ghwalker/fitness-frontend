import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
          const endpoint = credentials.name ? '/jwt' : '/jwt'
          
          console.log('Making auth request to:', `${apiUrl}/api/auth${endpoint}`)
          console.log('Credentials:', { email: credentials.email, name: credentials.name, role: credentials.role })
          
          const res = await fetch(`${apiUrl}/api/auth${endpoint}`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              name: credentials.name,
              role: credentials.role || 'Trainer'
            }),
          })

          console.log('Auth response status:', res.status)

          if (res.ok) {
            const user = await res.json()
            console.log('Auth successful, user:', user)
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken: user.accessToken,
            }
          } else {
            const errorText = await res.text()
            console.log('Auth failed:', errorText)
          }
          
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - user:', user, 'token:', token)
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token, 'session:', session)
      if (token) {
        session.user.role = token.role
        session.user.id = token.id
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
  debug: process.env.NODE_ENV === 'development',
} 