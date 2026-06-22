"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "solid",
      size = "md",
      isLoading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      solid:
        "bg-[#FF5A1F] text-white shadow-lg shadow-orange-100 hover:bg-[#FF6B35] hover:shadow-xl hover:shadow-orange-200/50",
      outline:
        "border border-[#FF5A1F] text-[#FF5A1F] hover:bg-[#FFF4EE] bg-transparent",
      ghost: "text-slate-600 hover:bg-slate-50 hover:text-slate-900 bg-transparent",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
