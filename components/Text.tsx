import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  weight?: 'normal' | 'bold' | 'lighter' | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  color?: string;
}

export const Text: React.FC<TextProps> = ({ children, weight, size, color, style, ...rest }) => {
  const customStyle: React.CSSProperties = {
    ...style,
    fontWeight: weight ? (typeof weight === 'string' ? weight : 'bold') : 'normal',
    fontSize: size ? (typeof size === 'string' ? 
      (size === 'xs' ? '12px' : size === 'sm' ? '14px' : size === 'md' ? '16px' : size === 'lg' ? '18px' : size === 'xl' ? '20px' : size)
      : '16px') : '16px',
    color: color || 'inherit',
  };

  return <p style={customStyle} {...rest}>{children}</p>;
};

export default Text;
