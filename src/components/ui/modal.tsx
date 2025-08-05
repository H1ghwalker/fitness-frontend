'use client';

import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
}

export function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isBackdropClicked, setIsBackdropClicked] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setMounted(true), 10);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
      setIsBackdropClicked(false);
    }, 300);
  };

  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsMouseDown(true);
      setIsBackdropClicked(true);
    }
  };

  const handleBackdropMouseUp = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isMouseDown) {
      handleClose();
    }
    setIsMouseDown(false);
  };

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    custom: 'max-w-3xl min-h-[32rem] max-h-[90vh]',
  }[size ?? 'lg'];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start sm:items-center justify-center backdrop-blur-sm transition-all duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      } ${isBackdropClicked ? 'bg-black/60' : 'bg-black/40'}`}
      onMouseDown={handleBackdropMouseDown}
      onMouseUp={handleBackdropMouseUp}
    >
      <div
        className={`relative w-[95%] sm:w-auto sm:min-w-[22rem] ${sizeClass} bg-white rounded-lg shadow-xl transform transition-all duration-300 ${
          closing || !mounted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } p-4 sm:p-6 md:p-8 max-h-[90vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-4 mt-4 sm:mt-0`}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          maxHeight: 'calc(100vh - 2rem)',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-4 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl transition-colors p-1 z-10"
        >
          &times;
        </button>

        {title && (
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-4 sm:mb-6 text-primary pr-8">
            {title}
          </h2>
        )}

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          {children}
        </div>
      </div>
    </div>
  );
} 