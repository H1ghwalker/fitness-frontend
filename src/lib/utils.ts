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
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  console.log('safeRedirect called for path:', targetPath);
  console.log('Is mobile device:', isMobile);
  console.log('Is iOS device:', isIOS);
  
  if (isMobile) {
    // Для мобильных устройств, особенно iOS, используем более надежную логику
    console.log('Checking authentication for mobile device...');
    
    // Для iOS используем специальную функцию
    const isAuthenticated = isIOS ? await checkAuthForIOS() : await checkAuthWithRetry();
    
    console.log('Authentication result:', isAuthenticated);
    console.log('Current cookies:', document.cookie);
    
    if (isAuthenticated) {
      console.log('User is authenticated, proceeding with redirect');
      router.push(targetPath);
    } else {
      console.log('User is not authenticated, but proceeding with redirect anyway');
      // Для iOS добавляем большую задержку перед редиректом
      const redirectDelay = isIOS ? 1500 : 500;
      setTimeout(() => {
        console.log('Executing delayed redirect for mobile device');
        router.push(targetPath);
      }, redirectDelay);
    }
  } else {
    // Для десктопа сразу редиректим
    console.log('Desktop device, immediate redirect');
    router.push(targetPath);
  }
};

// Специальная функция для проверки авторизации на iOS устройствах
export const checkAuthForIOS = async (): Promise<boolean> => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (!isIOS) {
    return await checkAuthWithRetry();
  }
  
  console.log('iOS device detected, using enhanced auth check');
  
  // Для iOS используем более агрессивную стратегию проверки
  for (let i = 0; i < 6; i++) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        console.log(`iOS auth check successful on attempt ${i + 1}`);
        return true;
      }
      
      // Увеличиваем задержку с каждой попыткой для iOS
      const delay = Math.min(1000 + (i * 500), 3000);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.log(`iOS auth check attempt ${i + 1} failed:`, error);
      
      if (i < 5) {
        const delay = Math.min(1000 + (i * 500), 3000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return false;
};

// Функция для принудительного редиректа на iOS устройствах
export const forceRedirectForIOS = async (router: any, targetPath: string) => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (!isIOS) {
    router.push(targetPath);
    return;
  }
  
  console.log('Force redirect for iOS device to:', targetPath);
  
  // Для iOS используем несколько стратегий редиректа
  try {
    // Первая попытка - обычный редирект
    router.push(targetPath);
    
    // Вторая попытка через небольшую задержку
    setTimeout(() => {
      console.log('iOS: Second redirect attempt');
      router.push(targetPath);
    }, 1000);
    
    // Третья попытка через большую задержку
    setTimeout(() => {
      console.log('iOS: Third redirect attempt');
      router.push(targetPath);
    }, 3000);
    
  } catch (error) {
    console.error('iOS redirect error:', error);
    // Fallback - используем window.location
    window.location.href = targetPath;
  }
};

// Функция для проверки состояния cookies на iOS
export const checkCookiesForIOS = (): boolean => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (!isIOS) {
    return true; // Для не-iOS устройств считаем, что cookies работают нормально
  }
  
  console.log('Checking cookies for iOS device');
  console.log('Current cookies:', document.cookie);
  
  // Проверяем наличие любых cookies
  const hasCookies = document.cookie.length > 0;
  console.log('Has cookies:', hasCookies);
  
  return hasCookies;
};

// Итоговая функция для надежного редиректа на iOS
export const reliableIOSRedirect = async (router: any, targetPath: string) => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (!isIOS) {
    router.push(targetPath);
    return;
  }
  
  console.log('Reliable iOS redirect to:', targetPath);
  
  // Стратегия 1: Проверяем cookies
  const cookiesOk = checkCookiesForIOS();
  console.log('Cookies check result:', cookiesOk);
  
  // Стратегия 2: Проверяем авторизацию
  const isAuthenticated = await checkAuthForIOS();
  console.log('Auth check result:', isAuthenticated);
  
  // Стратегия 3: Выполняем редирект с множественными попытками
  try {
    // Первая попытка
    console.log('iOS redirect attempt 1');
    router.push(targetPath);
    
    // Вторая попытка через задержку
    setTimeout(() => {
      console.log('iOS redirect attempt 2');
      router.push(targetPath);
    }, 1000);
    
    // Третья попытка через большую задержку
    setTimeout(() => {
      console.log('iOS redirect attempt 3');
      router.push(targetPath);
    }, 3000);
    
    // Четвертая попытка с window.location как fallback
    setTimeout(() => {
      console.log('iOS redirect attempt 4 (window.location)');
      window.location.href = targetPath;
    }, 5000);
    
  } catch (error) {
    console.error('iOS redirect error:', error);
    // Fallback
    window.location.href = targetPath;
  }
};

// Функция для комплексного тестирования iOS редиректа
export const testIOSRedirect = async (router: any, targetPath: string) => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  console.log('=== iOS Redirect Test ===');
  console.log('Target path:', targetPath);
  console.log('Is iOS device:', isIOS);
  console.log('User agent:', navigator.userAgent);
  console.log('Current cookies:', document.cookie);
  
  if (!isIOS) {
    console.log('Not iOS device, using standard redirect');
    router.push(targetPath);
    return;
  }
  
  // Тест 1: Проверка cookies
  const cookiesOk = checkCookiesForIOS();
  console.log('Test 1 - Cookies check:', cookiesOk);
  
  // Тест 2: Проверка авторизации
  const isAuthenticated = await checkAuthForIOS();
  console.log('Test 2 - Auth check:', isAuthenticated);
  
  // Тест 3: Множественные попытки редиректа
  console.log('Test 3 - Multiple redirect attempts');
  
  const redirectAttempts = [
    { name: 'Immediate router.push', delay: 0 },
    { name: 'Delayed router.push (1s)', delay: 1000 },
    { name: 'Delayed router.push (3s)', delay: 3000 },
    { name: 'Window.location fallback (5s)', delay: 5000 }
  ];
  
  redirectAttempts.forEach((attempt, index) => {
    setTimeout(() => {
      console.log(`Attempt ${index + 1}: ${attempt.name}`);
      try {
        if (index === redirectAttempts.length - 1) {
          // Последняя попытка - используем window.location
          window.location.href = targetPath;
        } else {
          router.push(targetPath);
        }
      } catch (error) {
        console.error(`Attempt ${index + 1} failed:`, error);
      }
    }, attempt.delay);
  });
  
  console.log('=== iOS Redirect Test Complete ===');
};
