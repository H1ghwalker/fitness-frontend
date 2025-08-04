import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log('Middleware called for:', req.nextUrl.pathname)
    
    // Если пользователь аутентифицирован и находится на главной странице с callbackUrl,
    // перенаправляем на указанный URL
    if (req.nextUrl.pathname === '/' && req.nextUrl.searchParams.get('callbackUrl')) {
      const callbackUrl = req.nextUrl.searchParams.get('callbackUrl')
      if (callbackUrl) {
        console.log('Found callbackUrl:', callbackUrl)
        // Проверяем, что callbackUrl безопасный (начинается с /)
        if (callbackUrl.startsWith('/')) {
          console.log('Redirecting to callback URL:', callbackUrl)
          return Response.redirect(new URL(callbackUrl, req.url))
        }
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Middleware authorized check - token:', token)
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
    "/",
    "/dashboard/:path*",
    "/clients/:path*",
    "/workouts/:path*",
    "/workout_templates/:path*",
    "/calendar/:path*",
    "/progress/:path*",
  ],
} 