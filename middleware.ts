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
      
      const userAgent = request.headers.get('user-agent') || '';
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
      
      if (isIOS) {
        console.log('Middleware: iOS device detected, using enhanced auth check');
        
        // Для iOS добавляем дополнительную задержку перед проверкой
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
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
        
        // Для iOS добавляем дополнительную проверку через задержку
        if (isIOS) {
          console.log('Middleware: iOS device - performing delayed auth check');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const delayedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
              cookie: request.headers.get('cookie') || '',
            },
          });
          
          if (delayedResponse.ok) {
            console.log('Middleware: iOS delayed auth check successful, redirecting to /clients');
            return NextResponse.redirect(new URL('/clients', request.url))
          }
        }
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