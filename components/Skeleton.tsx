import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  style,
  className = '',
  animated = true,
}) => {
  return (
    <div
      className={`${animated ? 'animate-pulse' : ''} ${className}`}
      style={{
        background: 'var(--color-surface-2, #eee)',
        width,
        height,
        borderRadius: 4,
        ...style,
      }}
    />
  );
};

export default Skeleton;
