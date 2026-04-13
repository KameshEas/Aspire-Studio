import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => {
  const base = 'bg-white rounded-xl border border-gray-100 shadow-md p-6';
  return (
    <div {...rest} className={`${base} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default Card;
