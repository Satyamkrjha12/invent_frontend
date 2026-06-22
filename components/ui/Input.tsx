"use client";

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, type = "text", id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={id}
            className={`
              w-full
              rounded-2xl
              border
              py-2.5
              pr-4
              text-sm
              outline-none
              transition-all
              duration-300
              placeholder-slate-400
              ${icon ? "pl-11" : "pl-4"}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-200 focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100"
              }
              disabled:bg-slate-50
              disabled:text-slate-500
              disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
