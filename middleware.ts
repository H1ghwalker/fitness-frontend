import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isPublicPage = request.nextUrl.pathname === '/'
  
  if (isPublicPage) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });
      
      if (response.ok) {
        const session = await response.json();
        
        if (session && session.user) {
          return NextResponse.redirect(new URL('/clients', request.url))
        }
      }
    } catch (error) {
      // При ошибке показываем главную страницу
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/']
} 