import { signOut, getSession } from 'next-auth/react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Импортируем типы
import { 
  Exercise, 
  CreateExerciseData, 
  Session, 
  CreateSessionData, 
  WorkoutTemplate,
  CreateWorkoutTemplateData,
  ServerWorkoutTemplate,
  Progress,
  CreateProgressData,
  ProgressStats,
  Client
} from '../types/types';

// Функция для получения токена из NextAuth сессии
const getAuthToken = async (): Promise<string | null> => {
  try {
    const session = await getSession();
    return session?.accessToken || null;
  } catch (error) {
    return null;
  }
};

// Универсальная функция для всех API запросов
const makeRequest = async (endpoint: string, options: RequestInit & { params?: Record<string, string | number> } = {}) => {
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
    const token = await getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      ...fetchOptions
    });

    if (!response.ok) {
      if (response.status === 401) {
        await signOut({ redirect: false });
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
      
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// ---------------------------------------------------------------------------------------CLIENTS------------------------------------------------------------------------------------------------
// Оптимизированные функции для клиентов (пример)
export const getClients = (): Promise<Client[]> => makeRequest('clients');

export const createClient = (data: { name: string; email: string }) => 
  makeRequest('clients', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const deleteClient = (id: number) => 
  makeRequest(`clients/${id}`, { method: 'DELETE' }).then(() => {
    return;
  });

export const getClientById = (id: number): Promise<Client> => 
  makeRequest(`clients/${id}`);

export const updateClient = (id: number, data: Record<string, any>) => 
  makeRequest(`clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const assignTemplateToClient = (clientId: number, templateId: number) => 
  makeRequest(`clients/${clientId}/assign-template`, {
    method: 'PUT',
    body: JSON.stringify({ templateId })
  });

export const removeTemplateFromClient = (clientId: number) => 
  makeRequest(`clients/${clientId}/assign-template`, {
    method: 'DELETE'
  });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------SESSIONS------------------------------------------------------------------------------------------------
export const getSessionsByDate = (date: string): Promise<Session[]> => 
  makeRequest('sessions', { params: { date } });

export const createSession = (data: CreateSessionData): Promise<Session> => 
  makeRequest('sessions', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const getSessionsByMonth = (year: number, month: number): Promise<Session[]> => 
  makeRequest('sessions', { 
    params: { month: `${year}-${String(month).padStart(2, '0')}` } 
  });

export const deleteSession = (id: number): Promise<void> => 
  makeRequest(`sessions/${id}`, { method: 'DELETE' }).then(() => {
    return;
  });

export const updateClientNextSession = (clientId: number, nextSession: string | null) => 
  makeRequest(`clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify({ nextSession })
  });

export const updateSessionStatus = (id: number, status: string) =>
  makeRequest(`sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    headers: { 'Content-Type': 'application/json' },
  });

export const updateSession = (id: number, data: Partial<Session>) =>
  makeRequest(`sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const createBulkSessions = (data: {
  clientId: number;
  dates: string[];
  time?: string;
  note?: string;
  duration?: number;
  status?: string;
  workoutTemplateId?: number;
}): Promise<{ message: string; sessionsCreated: number; sessions: Session[] }> =>
  makeRequest('sessions/bulk-create', {
    method: 'POST',
    body: JSON.stringify(data)
  });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------EXERCISES------------------------------------------------------------------------------------------------
export const getExercises = (): Promise<{ exercises: Exercise[] }> => makeRequest('exercises');

export const createExercise = (data: CreateExerciseData): Promise<Exercise> => 
  makeRequest('exercises', {
    method: 'POST',
    body: JSON.stringify(data)
  });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------WORKOUT TEMPLATES------------------------------------------------------------------------------------------------
export const getWorkoutTemplates = (): Promise<{ templates: ServerWorkoutTemplate[] }> => makeRequest('workout-templates');

export const getWorkoutTemplateById = (id: number): Promise<ServerWorkoutTemplate> => 
  makeRequest(`workout-templates/${id}`);

export const createWorkoutTemplate = (data: CreateWorkoutTemplateData): Promise<WorkoutTemplate> => 
  makeRequest('workout-templates', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const updateWorkoutTemplate = (id: number, data: any): Promise<ServerWorkoutTemplate> => 
  makeRequest(`workout-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const deleteWorkoutTemplate = (id: number): Promise<void> => 
  makeRequest(`workout-templates/${id}`, { method: 'DELETE' }).then(() => {
    return;
  });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------PROGRESS------------------------------------------------------------------------------------------------
// Progress Measurement API functions
export const getClientProgressMeasurements = (clientId: number, page = 1, limit = 50) => 
  makeRequest(`progress/${clientId}`, { params: { page, limit } });

export const createProgressMeasurement = (data: {
  clientId: number;
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  notes?: string;
}) => 
  makeRequest('progress', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const updateProgressMeasurement = (id: number, data: {
  date?: string;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  notes?: string;
}) => 
  makeRequest(`progress/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const deleteProgressMeasurement = (id: number): Promise<void> => 
  makeRequest(`progress/${id}`, { method: 'DELETE' }).then(() => {
    // DELETE запросы возвращают null, но мы ожидаем void
    return;
  });

export const getClientProgressStats = (clientId: number) => 
  makeRequest(`progress/${clientId}/stats`);
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
