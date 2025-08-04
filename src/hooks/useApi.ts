import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export const useApi = () => {
  const { data: session, status } = useSession();

  const makeRequest = useCallback(async (
    endpoint: string, 
    options: RequestInit & { params?: Record<string, string | number> } = {}
  ) => {
    const { params, ...fetchOptions } = options;
    
    let url = `${API_URL}/api/${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => 
        searchParams.append(key, String(value))
      );
      url += `?${searchParams.toString()}`;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      // Добавляем токен авторизации если есть
      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
        console.log('Adding Authorization header with token');
      } else {
        console.log('No auth token found in session, status:', status);
        console.log('Session data:', session);
      }

      console.log(`🌐 Making ${fetchOptions.method || 'GET'} request to: ${url}`);
      const response = await fetch(url, {
        headers,
        ...fetchOptions
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized - redirecting to home page');
          window.location.href = '/';
          throw new Error('Unauthorized. Please log in.');
        }
        
        let errorMessage = `API Error: ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (parseError) {
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage += ` - ${errorText}`;
            }
          } catch (textError) {
            switch (response.status) {
              case 403:
                errorMessage += ' - Forbidden. Insufficient permissions.';
                break;
              case 404:
                errorMessage += ' - Not found.';
                break;
              case 500:
                errorMessage += ' - Internal server error. Please try again later.';
                break;
              default:
                errorMessage += ' - Request failed.';
            }
          }
        }
        
        console.error(`❌ API Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        console.log(`✅ DELETE request successful (204 No Content)`);
        return null;
      }
      
      const data = await response.json();
      console.log(`✅ Request successful, data:`, data);
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }, [session?.accessToken]);

  return { makeRequest };
}; 