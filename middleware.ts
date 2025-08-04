import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isPublicPage = request.nextUrl.pathname === '/'
  
  // Проверяем только главную страницу
  if (isPublicPage) {
    try {
      // Проверяем авторизацию через API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });
      
      // Если пользователь авторизован (статус 200)
      if (response.ok) {
        console.log('Middleware: User is authenticated, redirecting to /clients');
        return NextResponse.redirect(new URL('/clients', request.url))
      }
    } catch (error) {
      // При ошибке показываем главную страницу
      console.log('Middleware: Auth check failed, showing homepage');
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/']
} 