import React from 'react';

import './base.css';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, ...rest}) => {
  return (
    <div {...rest} className={`card ${rest.className || ''}`}>
      {children}
    </div>
  );
};

export default Card;
