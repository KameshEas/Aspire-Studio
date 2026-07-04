/**
 * Toast Component - Notification display system
 */

import React from "react";
import { useToast, type Toast } from "@/lib/hooks/useToast";

// ─── Toast Container ──────────────────────────────────────

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-3 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  );
};

// ─── Toast Item ───────────────────────────────────────────

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const variants = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      title: "text-green-900",
      text: "text-green-800",
      icon: "✓",
      iconBg: "bg-green-100 text-green-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      title: "text-red-900",
      text: "text-red-800",
      icon: "✕",
      iconBg: "bg-red-100 text-red-600",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      title: "text-amber-900",
      text: "text-amber-800",
      icon: "⚠",
      iconBg: "bg-amber-100 text-amber-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      title: "text-blue-900",
      text: "text-blue-800",
      icon: "ℹ",
      iconBg: "bg-blue-100 text-blue-600",
    },
  };

  const variant = variants[toast.variant];

  return (
    <div
      className={`
        ${variant.bg} ${variant.border}
        border rounded-lg shadow-lg p-4 max-w-md
        flex gap-3 items-start pointer-events-auto
        animate-in slide-in-from-bottom-4 fade-in duration-300
      `}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icon */}
      <div
        className={`
          w-6 h-6 rounded-full flex items-center justify-center
          flex-shrink-0 text-sm font-bold
          ${variant.iconBg}
        `}
      >
        {variant.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-semibold ${variant.title}`}>
          {toast.title}
        </h3>
        {toast.description && (
          <p className={`text-sm mt-1 ${variant.text}`}>{toast.description}</p>
        )}

        {/* Action button */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={`
              text-xs font-medium mt-2 underline
              ${variant.text} hover:opacity-80 transition-opacity
            `}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onDismiss}
        className={`
          flex-shrink-0 text-lg leading-none opacity-50
          hover:opacity-100 transition-opacity
          ${variant.text}
        `}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};
