import React from 'react';
import './Button.css';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary'|'secondary'|'ghost'|'danger'|'icon';
  loading?: boolean;
  ariaLabel?: string;
};

export const Button: React.FC<ButtonProps> = ({children, variant='primary', loading, ariaLabel, className, ...props}) => {
  const isIconOnly = variant === 'icon' && !children;
  const classes = ['btn', `btn--${variant}`];
  if (loading) classes.push('btn--loading');
  if (className) classes.push(className);
  return (
    <button
      {...props}
      aria-label={isIconOnly ? (ariaLabel || props['aria-label']) : undefined}
      disabled={props.disabled || loading}
      className={classes.join(' ')}
    >
      {loading ? <span aria-hidden>Loading…</span> : children}
    </button>
  );
};

export default Button;
