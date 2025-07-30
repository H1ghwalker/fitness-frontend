import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Утилита для определения мобильных устройств
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Утилита для проверки авторизации с повторными попытками
export const checkAuthWithRetry = async (maxRetries = 3, delay = 500): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        return true;
      }
      
      // Если это не последняя попытка, ждем перед следующей
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.log(`Auth check attempt ${i + 1} failed:`, error);
      
      // Если это не последняя попытка, ждем перед следующей
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return false;
};

// Утилита для безопасного редиректа с проверкой авторизации
export const safeRedirect = async (router: any, targetPath: string) => {
  const isMobile = isMobileDevice();
  
  console.log('safeRedirect called for path:', targetPath);
  console.log('Is mobile device:', isMobile);
  
  if (isMobile) {
    // Для мобильных устройств проверяем авторизацию перед редиректом
    console.log('Checking authentication for mobile device...');
    const isAuthenticated = await checkAuthWithRetry();
    
    console.log('Authentication result:', isAuthenticated);
    console.log('Current cookies:', document.cookie);
    
    if (isAuthenticated) {
      console.log('User is authenticated, proceeding with redirect');
      router.push(targetPath);
    } else {
      console.log('User is not authenticated, but proceeding with redirect anyway');
      // Добавляем небольшую задержку для мобильных устройств
      setTimeout(() => {
        router.push(targetPath);
      }, 500);
    }
  } else {
    // Для десктопа сразу редиректим
    console.log('Desktop device, immediate redirect');
    router.push(targetPath);
  }
};
