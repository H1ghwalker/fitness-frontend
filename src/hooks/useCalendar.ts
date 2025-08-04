import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Session } from '@/types/types';
import { isSameDay } from 'date-fns';

export const useCalendar = () => {
  const { makeRequest } = useApi();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Получаем сессии за месяц при первом рендере и смене месяца
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    makeRequest('sessions', { 
      params: { month: `${year}-${String(month).padStart(2, '0')}` }
    })
      .then(setSessions)
      .catch(console.error);
  }, [currentMonth, makeRequest]);

  // Для выделения дат сессий
  const sessionDates = sessions.map(session => new Date(session.date));
  const today = new Date();
  const pastSessionDates = sessions
    .filter(session => new Date(session.date) < today)
    .map(session => new Date(session.date));
  const futureSessionDates = sessions
    .filter(session => new Date(session.date) >= today)
    .map(session => new Date(session.date));

  // Для отображения сессий за выбранную дату
  const sessionsForSelectedDate = selectedDate
    ? sessions.filter(session => isSameDay(new Date(session.date), selectedDate))
    : [];

  const refreshSessions = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    makeRequest('sessions', { 
      params: { month: `${year}-${String(month).padStart(2, '0')}` }
    })
      .then(setSessions)
      .catch(console.error);
  };

  return {
    selectedDate,
    setSelectedDate,
    sessions,
    setSessions,
    currentMonth,
    setCurrentMonth,
    sessionDates,
    pastSessionDates,
    futureSessionDates,
    sessionsForSelectedDate,
    refreshSessions,
  };
}; 