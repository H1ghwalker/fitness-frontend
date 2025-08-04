import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Простая проверка iOS устройств
export const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// Простая проверка мобильных устройств
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Простая проверка авторизации
export const checkAuth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: 'include',
    });
    return res.ok;
  } catch (error) {
    console.log('Auth check failed:', error);
    return false;
  }
};

// Простой редирект с поддержкой iOS
export const redirectForIOS = (router: any, targetPath: string) => {
  const isIOS = isIOSDevice();
  
  console.log('Redirect for iOS:', isIOS, 'Target:', targetPath);
  
  if (isIOS) {
    // Для iOS используем window.location.href
    console.log('iOS device detected, using window.location');
    window.location.href = targetPath;
  } else {
    // Для остальных устройств используем router.push
    console.log('Desktop device, using router.push');
    router.push(targetPath);
  }
};
