import React from 'react';

export const Stack: React.FC<React.HTMLAttributes<HTMLDivElement> & {
  gap?: string;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | string;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | string;
}> = ({ children, gap = '12px', direction = 'column', align, justify, style, ...rest }) => {
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap,
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Stack;
