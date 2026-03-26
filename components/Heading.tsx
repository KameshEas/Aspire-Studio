import React from 'react';

export const Heading: React.FC<React.HTMLAttributes<HTMLHeadingElement> & {level?: 1|2|3|4}> = ({level = 3, children, ...rest}) => {
  switch (level) {
    case 1: return <h1 {...rest}>{children}</h1>;
    case 2: return <h2 {...rest}>{children}</h2>;
    case 4: return <h4 {...rest}>{children}</h4>;
    default: return <h3 {...rest}>{children}</h3>;
  }
};

export default Heading;
