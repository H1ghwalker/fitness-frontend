'use client';

import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';

export default function PublicHeader() {
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-7xl bg-white/40 backdrop-blur-md rounded-b-2xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm border-b border-white/20">
        <div className="flex items-center gap-2 sm:gap-3">
          <Dumbbell className="h-6 w-6 sm:h-7 sm:w-7 text-main" />
          <span className="text-xl sm:text-2xl font-semibold text-primary">TrainerHub</span>
        </div>
        <Button 
          variant="default" 
          onClick={() => setShowModal(true)}
          className="text-sm sm:text-base px-3 sm:px-4 py-2 h-auto font-medium shadow-sm hover:shadow-md transition-all duration-200"
        >
          Sign In / Sign Up
        </Button>
      </div>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
}
