'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/lib/utils';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export default function AuthRedirect({ children }: AuthRedirectProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking authentication...');
        const isAuthenticated = await checkAuth();
        
        if (isAuthenticated) {
          console.log('User is authenticated, redirecting to /clients');
          router.push('/clients');
        } else {
          console.log('User is not authenticated, showing content');
          setIsChecking(false);
        }
      } catch (error) {
        console.log('Auth check error:', error);
        // При ошибке показываем содержимое
        setIsChecking(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  // Показываем загрузку пока проверяем авторизацию
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Показываем содержимое если пользователь не авторизован
  return <>{children}</>;
} 