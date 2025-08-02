'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthWithRetry, checkAuthForIOS, forceRedirectForIOS, reliableIOSRedirect } from '@/lib/utils';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export default function AuthRedirect({ children }: AuthRedirectProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const maxRetries = isIOS ? 5 : 3;
        const delay = isIOS ? 1000 : 500;
        
        console.log('AuthRedirect: iOS device detected:', isIOS);
        const isAuthenticated = isIOS ? await checkAuthForIOS() : await checkAuthWithRetry(maxRetries, delay);
        
        if (isAuthenticated) {
          // Пользователь авторизован - редиректим на /clients
          console.log('User is authenticated, redirecting to /clients');
          if (isIOS) {
            await reliableIOSRedirect(router, '/clients');
          } else {
            router.push('/clients');
          }
        } else {
          // Пользователь не авторизован - показываем содержимое
          console.log('User is not authenticated, showing content');
          setIsChecking(false);
        }
      } catch (error) {
        console.log('Auth check error:', error);
        // Ошибка сети или backend недоступен - показываем содержимое
        console.log('Backend недоступен, показываем главную страницу');
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Показываем загрузку пока проверяем авторизацию
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
          <p className="text-gray-600">
            {retryCount > 0 ? `Checking authorization... (${retryCount})` : 'Authorization check...'}
          </p>
        </div>
      </div>
    );
  }

  // Показываем содержимое если пользователь не авторизован
  return <>{children}</>;
} 