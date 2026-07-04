/**
 * Dialog/Modal Component - Accessible modal with focus management
 */

import React, { useEffect, useRef, useCallback } from "react";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open = false,
  onOpenChange,
  children,
  className,
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            open,
            onOpenChange,
          });
        }
        return child;
      })}
    </div>
  );
};

// ─── Dialog Content ───────────────────────────────────────

export interface DialogContentProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  closeButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(
  (
    {
      open = false,
      onOpenChange,
      title,
      description,
      children,
      className,
      closeButton = true,
      size = "md",
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement>(null);

    // Focus management
    useEffect(() => {
      if (open) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        dialogRef.current?.focus();
      } else {
        previousActiveElement.current?.focus();
      }
    }, [open]);

    // Handle escape key
    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange?.(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    // Handle backdrop click
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          onOpenChange?.(false);
        }
      },
      [onOpenChange]
    );

    if (!open) return null;

    const sizeMap = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-2xl",
      full: "max-w-full",
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Dialog */}
        <div
          ref={ref || dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby={description ? "dialog-description" : undefined}
          className={`
            fixed inset-0 z-50 flex items-center justify-center p-4
            focus:outline-none
          `}
          tabIndex={-1}
        >
          <div
            className={`
              bg-white rounded-lg shadow-xl
              ${sizeMap[size]} w-full max-h-[90vh] overflow-y-auto
              ${className}
            `}
          >
            {/* Header */}
            {(title || closeButton) && (
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <div>
                  {title && (
                    <h2
                      id="dialog-title"
                      className="text-lg font-semibold text-gray-900"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="dialog-description"
                      className="text-sm text-gray-600 mt-1"
                    >
                      {description}
                    </p>
                  )}
                </div>

                {closeButton && (
                  <button
                    onClick={() => onOpenChange?.(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    aria-label="Close dialog"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">{children}</div>
          </div>
        </div>
      </>
    );
  }
);

DialogContent.displayName = "DialogContent";

// ─── Dialog Trigger ───────────────────────────────────────

export interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ children, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={(e) => {
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});

DialogTrigger.displayName = "DialogTrigger";

// ─── Simple Modal Hook ────────────────────────────────────

export interface UseDialogReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useDialog(initialOpen = false): UseDialogReturn {
  const [isOpen, setIsOpen] = React.useState(initialOpen);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
