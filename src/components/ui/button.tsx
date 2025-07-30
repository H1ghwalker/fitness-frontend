import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'danger' | 'success'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
    
    const variants = {
      default: "bg-main text-white hover:bg-main-dark shadow-sm hover:shadow-md active:scale-[0.98]",
      outline: "border-2 border-main text-main bg-white hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md active:scale-[0.98]",
      danger: "border-2 border-red-500 text-red-500 bg-white hover:bg-red-50 hover:text-white hover:bg-red-500 hover:border-red-600 shadow-sm hover:shadow-md active:scale-[0.98]",
      success: "bg-[#10B981] text-white hover:bg-[#059669] shadow-sm hover:shadow-md active:scale-[0.98]"
    }

    const sizes = {
      default: "h-9 sm:h-10 px-4 sm:px-6 py-2 text-sm",
      sm: "h-7 sm:h-8 px-3 sm:px-4 text-xs sm:text-sm",
      lg: "h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
