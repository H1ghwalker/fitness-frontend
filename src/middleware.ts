import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Дополнительная логика middleware если нужна
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token
      },
    },
    pages: {
      signIn: '/',
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/workouts/:path*",
    "/workout_templates/:path*",
    "/calendar/:path*",
    "/progress/:path*",
  ],
} 