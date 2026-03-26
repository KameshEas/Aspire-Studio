import React from 'react';

export const Stack: React.FC<React.HTMLAttributes<HTMLDivElement> & {gap?: string; direction?: 'row'|'column'}> = ({children, gap = '12px', direction = 'column', style, ...rest}) => {
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Stack;
