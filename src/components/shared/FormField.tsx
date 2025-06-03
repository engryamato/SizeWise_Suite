import React from 'react';
import { cn } from '../../lib/utils';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
  children: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      className,
      label,
      htmlFor,
      error,
      helpText,
      required = false,
      disabled = false,
      labelClassName,
      errorClassName,
      helpTextClassName,
      children,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const showHelpText = Boolean(helpText && !hasError);

    return (
      <div
        ref={ref}
        className={cn('space-y-1.5', disabled && 'opacity-60', className)}
        {...props}
      >
        {label && (
          <label
            htmlFor={htmlFor}
            className={cn(
              'block text-sm font-medium text-gray-700',
              disabled && 'cursor-not-allowed',
              labelClassName
            )}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {children}
          {hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          )}
        </div>

        {showHelpText && (
          <p className={cn('mt-1 text-sm text-gray-500', helpTextClassName)}>{helpText}</p>
        )}

        {hasError && (
          <p
            className={cn(
              'mt-1 text-sm text-red-600 flex items-center',
              errorClassName
            )}
            role="alert"
          >
            <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };

// Input component
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            props.disabled && 'bg-gray-100 cursor-not-allowed',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
