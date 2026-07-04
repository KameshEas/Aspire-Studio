/**
 * State Components - Loading, Error, Empty, Success states
 * Ensures consistent handling of all UI states
 */

import React from "react";
import { Button } from "./Button";
import { colors, statusConfig } from "./tokens";

// ─── Loading State ────────────────────────────────────────

export interface LoadingStateProps {
  message?: string;
  subtext?: string;
  fullHeight?: boolean;
  spinner?: "pulse" | "spin" | "bounce";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  subtext,
  fullHeight = true,
  spinner = "spin",
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-4
        ${fullHeight ? "min-h-screen" : "py-16"}
      `}
    >
      <div
        className={`w-8 h-8 border-4 border-gray-200 rounded-full border-t-indigo-600 animate-${spinner}`}
        role="status"
        aria-label={message}
      />
      {message && <p className="text-sm font-medium text-gray-900">{message}</p>}
      {subtext && <p className="text-xs text-gray-600">{subtext}</p>}
    </div>
  );
};

// ─── Error State ──────────────────────────────────────────

export interface ErrorStateProps {
  title: string;
  message: string;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  fullHeight?: boolean;
  icon?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  details,
  action,
  secondaryAction,
  fullHeight = true,
  icon,
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-4 px-4
        ${fullHeight ? "min-h-screen" : "py-16"}
      `}
      role="alert"
    >
      {icon || (
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-lg">
          ✕
        </div>
      )}

      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{message}</p>

        {details && (
          <details className="text-xs text-gray-500 text-left mt-3">
            <summary className="cursor-pointer font-medium hover:text-gray-700">
              Error details
            </summary>
            <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto">
              {details}
            </pre>
          </details>
        )}
      </div>

      <div className="flex gap-3">
        {action && (
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="secondary" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── Empty State ───────────────────────────────────────────

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  example?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  fullHeight?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  example,
  action,
  fullHeight = true,
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-4 px-4
        ${fullHeight ? "min-h-screen" : "py-16"}
      `}
    >
      {icon || (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-3xl">
          📭
        </div>
      )}

      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        {example && (
          <div className="p-3 bg-blue-50 rounded border border-blue-200 text-left mb-4">
            <div className="text-xs font-semibold text-blue-900 mb-1">
              Example:
            </div>
            <code className="text-xs text-blue-800">{example}</code>
          </div>
        )}
      </div>

      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

// ─── Success State ────────────────────────────────────────

export interface SuccessStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  action,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4">
      {icon || (
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg">
          ✓
        </div>
      )}

      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
      </div>

      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

// ─── Processing State (with progress) ──────────────────────

export interface ProcessingStateProps {
  title: string;
  message: string;
  elapsed?: number;
  estimated?: number;
  onCancel?: () => void;
  steps?: Array<{
    label: string;
    status: "pending" | "processing" | "completed" | "failed";
  }>;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  title,
  message,
  elapsed = 0,
  estimated = 30,
  onCancel,
  steps,
}) => {
  const progress = Math.min((elapsed / estimated) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-gray-200 rounded-full border-t-indigo-600 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <p className="text-sm text-gray-600">{message}</p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Elapsed: {elapsed}s</span>
            <span>Estimated: ~{estimated}s</span>
          </div>
        </div>

        {/* Steps */}
        {steps && (
          <div className="space-y-2">
            {steps.map((step, i) => {
              const statusColors = {
                pending: "bg-gray-100 text-gray-500",
                processing: "bg-blue-100 text-blue-600 animate-pulse",
                completed: "bg-green-100 text-green-600",
                failed: "bg-red-100 text-red-600",
              };

              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      statusColors[step.status]
                    }`}
                  >
                    {step.status === "completed" && "✓"}
                    {step.status === "failed" && "✕"}
                    {step.status !== "completed" && step.status !== "failed" && "."}
                  </div>
                  <span className="text-gray-700">{step.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {onCancel && (
          <Button
            variant="ghost"
            fullWidth
            onClick={onCancel}
            className="mt-4"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── Status Indicator ──────────────────────────────────────

export interface StatusIndicatorProps {
  status:
    | "pending"
    | "processing"
    | "succeeded"
    | "completed"
    | "failed"
    | "draft"
    | "approved"
    | "archived";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "md",
  showLabel = true,
}) => {
  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const sizeMap = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`rounded-full ${sizeMap[size]}`}
        style={{ backgroundColor: config.color.main }}
        title={config.label}
        aria-label={config.label}
      />
      {showLabel && (
        <span
          className="text-xs font-medium"
          style={{ color: config.color.dark }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
};
