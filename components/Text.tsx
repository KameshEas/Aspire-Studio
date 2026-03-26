import React from 'react';

export const Text: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({children, ...rest}) => {
  return <p {...rest}>{children}</p>;
};

export default Text;
