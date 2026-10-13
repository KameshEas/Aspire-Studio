/**
 * Input Component - World-Class Premium Form Input
 * Variants: text, email, password, number, url, tel, search
 * States: default, focus, error, success, disabled
 * Features: icon support, character count, accessibility
 */

import React, { forwardRef, useId, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// ─── Input Variants ───────────────────────────────────────

const inputVariants = cva(
  // Base styles with design system tokens
  `
    w-full px-3.5 py-2.5 text-sm font-medium
    rounded-md border-2 border-[color:var(--border)]
    bg-[color:var(--surface-input)]
    text-[color:var(--text)]
    placeholder:text-[color:var(--text-muted)]
    transition-all duration-[var(--duration-base)] ease-[var(--easing-standard)]
    focus:outline-none focus:border-[color:var(--primary-500)] focus:ring-2 focus:ring-[color:var(--primary-500)] focus:ring-opacity-10
    dark:focus:ring-[color:var(--primary-400)] dark:focus:ring-opacity-20
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[color:var(--surface-2)]
    file:cursor-pointer file:border-0 file:bg-transparent file:px-0 file:text-sm file:font-medium
  `,
  {
    variants: {
      state: {
        default: "",
        error: `
          border-[color:var(--danger)] focus:border-[color:var(--danger)] focus:ring-[color:var(--danger)] focus:ring-opacity-10
          dark:focus:ring-opacity-20 bg-[color-mix(in_srgb,var(--danger)_5%,white)]
          dark:bg-[color-mix(in_srgb,var(--danger)_5%,black)]
        `,
        success: `
          border-[color:var(--success)] focus:border-[color:var(--success)] focus:ring-[color:var(--success)] focus:ring-opacity-10
          dark:focus:ring-opacity-20 bg-[color-mix(in_srgb,var(--success)_5%,white)]
          dark:bg-[color-mix(in_srgb,var(--success)_5%,black)]
        `,
        warning: `
          border-[color:var(--warning)] focus:border-[color:var(--warning)] focus:ring-[color:var(--warning)] focus:ring-opacity-10
          dark:focus:ring-opacity-20 bg-[color-mix(in_srgb,var(--warning)_5%,white)]
          dark:bg-[color-mix(in_srgb,var(--warning)_5%,black)]
        `,
      },

      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-3.5 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },

    defaultVariants: {
      state: "default",
      size: "md",
    },
  }
);

// ─── Input Component ──────────────────────────────────────

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: boolean | string;
  success?: boolean;
  warning?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      state,
      size,
      label,
      error,
      success,
      warning,
      helperText,
      icon,
      iconPosition = "left",
      clearable,
      onClear,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const inputId = props.id ?? generatedId;

    const errorState =
      error
        ? "error"
        : success
          ? "success"
          : warning
            ? "warning"
            : state;

    const showClearButton = clearable && value && !disabled && (isFocused || value);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[color:var(--text)] mb-2 transition-colors"
          >
            {label}
            {props.required && <span className="text-[color:var(--danger)] ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper with icon support */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {icon && iconPosition === "left" && (
            <span
              className="absolute left-3.5 flex items-center justify-center text-[color:var(--text-muted)] pointer-events-none"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          {/* Input element */}
          <input
            ref={ref}
            className={`
              ${inputVariants({ state: errorState, size, className })}
              ${icon && iconPosition === "left" ? "pl-10" : ""}
              ${icon && iconPosition === "right" ? "pr-10" : ""}
              ${showClearButton ? "pr-10" : ""}
            `}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Right icon */}
          {icon && iconPosition === "right" && !showClearButton && (
            <span
              className="absolute right-3.5 flex items-center justify-center text-[color:var(--text-muted)] pointer-events-none"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          {/* Clear button */}
          {showClearButton && (
            <button
              type="button"
              className="absolute right-3.5 flex items-center justify-center text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors disabled:opacity-50"
              onClick={() => {
                onClear?.();
                onChange?.({ target: { value: "" } } as any);
              }}
              disabled={disabled}
              aria-label="Clear input"
              tabIndex={-1}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6m0-6 6 6" />
              </svg>
            </button>
          )}

          {/* Status indicator icons */}
          {error && !icon && (
            <span className="absolute right-3.5 flex items-center justify-center text-[color:var(--danger)]" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 7v6M12 17h.01" fill="var(--surface-input)" />
              </svg>
            </span>
          )}

          {success && !icon && !error && (
            <span className="absolute right-3.5 flex items-center justify-center text-[color:var(--success)]" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </span>
          )}
        </div>

        {/* Error message */}
        {error && typeof error === "string" && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm font-medium text-[color:var(--danger)] flex items-center gap-1"
            role="alert"
          >
            <span>{error}</span>
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-[color:var(--text-muted)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ─── Textarea Component ────────────────────────────────────

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    Omit<InputProps, keyof React.TextareaHTMLAttributes<HTMLTextAreaElement> | "type" | "icon" | "iconPosition" | "clearable"> {
  maxLength?: number;
  showCharCount?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      state,
      label,
      error,
      success,
      warning,
      helperText,
      disabled,
      value,
      onChange,
      maxLength,
      showCharCount = maxLength ? true : false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const inputId = props.id ?? generatedId;
    const charCount = typeof value === "string" ? value.length : 0;

    const errorState =
      error
        ? "error"
        : success
          ? "success"
          : warning
            ? "warning"
            : state;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[color:var(--text)] mb-2"
          >
            {label}
            {props.required && <span className="text-[color:var(--danger)] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            className={`
              ${inputVariants({ state: errorState, className })}
              resize-none overflow-y-auto
              focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={disabled}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            rows={rows}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
        </div>

        {/* Character count and helper text */}
        <div className="flex items-center justify-between mt-1.5">
          <div>
            {error && typeof error === "string" && (
              <p
                id={`${inputId}-error`}
                className="text-sm font-medium text-[color:var(--danger)]"
                role="alert"
              >
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={`${inputId}-helper`} className="text-sm text-[color:var(--text-muted)]">
                {helperText}
              </p>
            )}
          </div>

          {showCharCount && maxLength && (
            <span className={`text-xs font-medium ${
              charCount > maxLength * 0.9
                ? "text-[color:var(--warning)]"
                : "text-[color:var(--text-muted)]"
            }`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// ─── Password Input Component ──────────────────────────────

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState<"weak" | "medium" | "strong" | null>(null);

    const calculateStrength = (pwd: string): "weak" | "medium" | "strong" => {
      if (pwd.length < 8) return "weak";
      if (/^[a-z]+$|^[A-Z]+$|^[0-9]+$/.test(pwd)) return "weak";
      if (/^[a-zA-Z0-9]+$/.test(pwd)) return "medium";
      return "strong";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showStrength) {
        setStrength(calculateStrength(e.target.value));
      }
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          icon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-[color:var(--text)] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          }
          iconPosition="right"
          {...props}
          onChange={handleChange}
        />

        {showStrength && strength && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-[color:var(--border)] overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    strength === "weak"
                      ? "w-1/3 bg-[color:var(--danger)]"
                      : strength === "medium"
                        ? "w-2/3 bg-[color:var(--warning)]"
                        : "w-full bg-[color:var(--success)]"
                  }`}
                />
              </div>
              <span className={`text-xs font-medium ${
                strength === "weak"
                  ? "text-[color:var(--danger)]"
                  : strength === "medium"
                    ? "text-[color:var(--warning)]"
                    : "text-[color:var(--success)]"
              }`}>
                {strength.charAt(0).toUpperCase() + strength.slice(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
