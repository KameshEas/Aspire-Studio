/**
 * useToast - Toast notification system with auto-dismiss
 */

import { useCallback, useState, useRef, useEffect } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Global store for toasts (in real app, use context)
let toastStore: Toast[] = [];
let listeners: Set<(toasts: Toast[]) => void> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener([...toastStore]));
}

function addToast(toast: Toast) {
  toastStore.push(toast);
  notifyListeners();

  if (toast.duration !== 0) {
    setTimeout(() => removeToast(toast.id), toast.duration || 4000);
  }
}

function removeToast(id: string) {
  toastStore = toastStore.filter((t) => t.id !== id);
  notifyListeners();
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const toast = useCallback(
    (options: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(7);
      addToast({ ...options, id });
      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, []);

  const dismissAll = useCallback(() => {
    toastStore = [];
    notifyListeners();
  }, []);

  return {
    toasts,
    toast: (options: Omit<Toast, "id" | "variant"> & { variant?: ToastVariant }) =>
      toast({ ...options, variant: options.variant || "info" }),
    success: (options: Omit<Toast, "id" | "variant">) =>
      toast({ ...options, variant: "success" }),
    error: (options: Omit<Toast, "id" | "variant">) =>
      toast({ ...options, variant: "error" }),
    warning: (options: Omit<Toast, "id" | "variant">) =>
      toast({ ...options, variant: "warning" }),
    info: (options: Omit<Toast, "id" | "variant">) =>
      toast({ ...options, variant: "info" }),
    dismiss,
    dismissAll,
  };
}

export type UseToastReturn = ReturnType<typeof useToast>;
