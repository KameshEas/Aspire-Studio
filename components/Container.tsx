import React from 'react';

export const Container: React.FC<React.HTMLAttributes<HTMLDivElement> & {maxWidth?: string}> = ({children, style, maxWidth = '1200px', ...rest}) => {
  return (
    <div
      {...rest}
      style={{
        margin: '0 auto',
        padding: `0 var(--spacing-3, 16px)`,
        maxWidth,
        boxSizing: 'border-box',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default Container;
