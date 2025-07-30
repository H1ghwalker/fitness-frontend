import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'block w-full rounded-md border border-gray-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-900',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          'cursor-pointer',
          'text-base sm:text-sm', // Предотвращает зум на iOS
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input }; 