'use client';

import { forwardRef, SelectHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      placeholder = 'Sélectionnez une option',
      leftIcon,
      fullWidth = true,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-secondary-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            className={cn(
              `
                w-full rounded-lg border bg-white px-4 py-2.5
                text-secondary-900 appearance-none
                transition-colors duration-200
                focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                disabled:cursor-not-allowed disabled:bg-secondary-50 disabled:text-secondary-500
              `,
              leftIcon && 'pl-10',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
              !error && 'border-secondary-300',
              className
            )}
            {...props}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="text-secondary-700"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 pointer-events-none',
              isOpen && 'rotate-180'
            )}
          />
        </div>
        {error && (
          <p className="text-sm text-danger-600">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-secondary-500">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
