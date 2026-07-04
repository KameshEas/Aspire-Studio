/**
 * Skeleton Components - Animated loading placeholders
 * Provides visual feedback while content loads
 */

import React from "react";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  circle = false,
  animated = true,
}) => {
  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${animated ? "animate-pulse" : ""}
        ${circle ? "rounded-full" : "rounded-lg"}
        ${className}
      `}
      style={{
        width: widthStyle || "100%",
        height: heightStyle || "1rem",
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

export interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 animate-pulse">
          <Skeleton height={24} animated={false} />
          <Skeleton height={16} className="w-3/4" animated={false} />
          <Skeleton height={16} className="w-1/2" animated={false} />
        </div>
      ))}
    </div>
  );
};

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-3 animate-pulse">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="flex-1" height={24} animated={false} />
          ))}
        </div>
      ))}
    </div>
  );
};

export interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, lastLineWidth = "80%" }) => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} height={16} animated={false} />
      ))}
      <Skeleton height={16} style={{ width: lastLineWidth }} animated={false} />
    </div>
  );
};

export interface SkeletonGridProps {
  count?: number;
  columns?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6, columns = 3 }) => {
  return (
    <div
      className="gap-4 animate-pulse"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height={200} className="w-full" animated={false} />
          <Skeleton height={16} animated={false} />
          <Skeleton height={16} className="w-3/4" animated={false} />
        </div>
      ))}
    </div>
  );
};
