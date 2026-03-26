import React from 'react';

export const Heading: React.FC<React.HTMLAttributes<HTMLHeadingElement> & {level?: 1|2|3|4}> = ({level = 3, children, ...rest}) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return <Tag {...rest}>{children}</Tag>;
};

export default Heading;
