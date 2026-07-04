/**
 * Form Components - Production-ready with validation and error handling
 */

import React, { forwardRef, useState } from "react";
import { colors } from "./tokens";

// ─── Form Container ────────────────────────────────────────

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  disabled?: boolean;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, disabled, className, ...props }, ref) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting || disabled) return;

      setIsSubmitting(true);
      try {
        await onSubmit?.(e);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={`space-y-4 ${className}`}
        {...props}
      >
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as any, {
              disabled: disabled || isSubmitting,
            });
          }
          return child;
        })}
      </form>
    );
  }
);

Form.displayName = "Form";

// ─── Form Field ────────────────────────────────────────────

export interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, description, error, required, children }, ref) => {
    return (
      <div ref={ref} className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
            {required && <span className="ml-1 text-red-600 dark:text-red-400">*</span>}
          </label>
        )}

        {description && (
          <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
        )}

        <div>{children}</div>

        {error && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400 animate-slide-in" role="alert">
            ✕ {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

// ─── Text Input ────────────────────────────────────────────

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      disabled,
      error,
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm rounded-lg
            border-2 transition-all duration-150
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            dark:focus:ring-offset-gray-900

            ${
              error
                ? `
              border-red-300 dark:border-red-600
              focus:border-red-500 focus:ring-red-500
              bg-red-50 dark:bg-red-950/30
            `
                : `
              border-gray-300 dark:border-gray-600
              focus:border-indigo-500 focus:ring-indigo-500
              dark:focus:border-indigo-400 dark:focus:ring-indigo-400
              hover:border-gray-400 dark:hover:border-gray-500
            `
            }

            ${disabled ? "opacity-50 cursor-not-allowed" : ""}

            ${icon && iconPosition === "left" ? "pl-10" : ""}
            ${icon && iconPosition === "right" ? "pr-10" : ""}

            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />

        {icon && (
          <span
            className={`
              absolute top-1/2 -translate-y-1/2
              flex items-center justify-center text-gray-400
              pointer-events-none
              ${iconPosition === "left" ? "left-3" : "right-3"}
            `}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ─── Textarea ────────────────────────────────────────────

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      disabled,
      error,
      maxLength,
      showCharCount,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(
      typeof value === "string" ? value.length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="space-y-1">
        <textarea
          ref={ref}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 text-sm rounded-lg
            border-2 transition-colors duration-150
            bg-white text-gray-900 font-mono
            placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-offset-0
            resize-vertical

            ${
              error
                ? `
              border-red-300 focus:border-red-500 focus:ring-red-500
              bg-red-50
            `
                : `
              border-gray-300 focus:border-indigo-500 focus:ring-indigo-500
              hover:border-gray-400
            `
            }

            ${disabled ? "opacity-50 cursor-not-allowed" : ""}

            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />

        {showCharCount && maxLength && (
          <p className="text-xs text-gray-500">
            {charCount} / {maxLength} characters
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// ─── Select ────────────────────────────────────────────────

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      disabled,
      error,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <select
        ref={ref}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-sm rounded-lg
          border-2 transition-colors duration-150
          bg-white text-gray-900 cursor-pointer
          appearance-none
          focus:outline-none focus:ring-2 focus:ring-offset-0

          ${
            error
              ? `
            border-red-300 focus:border-red-500 focus:ring-red-500
            bg-red-50
          `
              : `
            border-gray-300 focus:border-indigo-500 focus:ring-indigo-500
            hover:border-gray-400
          `
          }

          ${disabled ? "opacity-50 cursor-not-allowed" : ""}

          ${className}
        `}
        aria-invalid={error ? "true" : "false"}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";

// ─── Checkbox ────────────────────────────────────────────

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, disabled, ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className={`
            w-5 h-5 mt-0.5 rounded-md
            border-2 border-gray-300
            bg-white cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            checked:bg-indigo-600 checked:border-indigo-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
            ${className}
          `}
          aria-label={label}
          {...props}
        />

        {(label || description) && (
          <div>
            {label && (
              <label className="text-sm font-medium text-gray-900">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-600 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

// ─── Radio Group ───────────────────────────────────────────

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, onChange, options, disabled, className, ...props }, ref) => {
    return (
      <div ref={ref} className={`space-y-2 ${className}`} {...props}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-3 p-2 rounded-lg
              cursor-pointer hover:bg-gray-50
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className={`
                w-5 h-5 mt-0.5 rounded-full
                border-2 border-gray-300
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                checked:border-indigo-600
                cursor-pointer
              `}
            />

            <div>
              <div className="text-sm font-medium text-gray-900">
                {option.label}
              </div>
              {option.description && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
