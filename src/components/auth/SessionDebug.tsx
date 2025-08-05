'use client';

import { useSession } from 'next-auth/react';

export default function SessionDebug() {
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 10, 
      right: 10, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px', 
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Status: {status}</div>
      <div>Session: {session ? 'Yes' : 'No'}</div>
      {session && (
        <div>
          <div>User: {session.user?.name}</div>
          <div>Email: {session.user?.email}</div>
          <div>Role: {session.user?.role}</div>
        </div>
      )}
    </div>
  );
} 