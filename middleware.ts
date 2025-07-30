import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isPublicPage = request.nextUrl.pathname === '/'
  
  // Проверяем только главную страницу
  if (isPublicPage) {
    try {
      console.log('Middleware: Checking authentication...');
      console.log('Middleware: User agent:', request.headers.get('user-agent'));
      console.log('Middleware: Cookies:', request.headers.get('cookie'));
      
      // Проверяем авторизацию через API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });
      
      console.log('Middleware: Auth check response status:', response.status);
      
      // Если пользователь авторизован (статус 200)
      if (response.ok) {
        console.log('Middleware: User is authenticated, redirecting to /clients');
        // Редиректим на /clients (так как все пользователи - тренера)
        return NextResponse.redirect(new URL('/clients', request.url))
      } else {
        console.log('Middleware: User is not authenticated, showing homepage');
      }
    } catch (error) {
      // Если ошибка сети или API недоступен - показываем главную страницу
      console.log('Middleware: Backend недоступен, показываем главную страницу:', error);
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/']
} 