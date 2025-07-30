'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthWithRetry } from '@/lib/utils';

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
        const isAuthenticated = await checkAuthWithRetry(3, 500);
        
        if (isAuthenticated) {
          // Пользователь авторизован - редиректим на /clients
          console.log('User is authenticated, redirecting to /clients');
          router.push('/clients');
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