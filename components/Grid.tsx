import React from 'react';

export const Grid: React.FC<React.HTMLAttributes<HTMLDivElement> & {columns?: number; gap?: string}> = ({children, columns = 12, gap = 'var(--spacing-3)', style, ...rest}) => {
  return (
    <div
      {...rest}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Grid;
