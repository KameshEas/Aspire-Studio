import React, {useId} from 'react';

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  label?: string;
  error?: string | null;
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({id, label, error, ...props}, ref) => {
  const reactId = useId();
  const inputId = id || reactId;
  return (
    <div>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} ref={ref} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />
      {error && <div id={`${inputId}-error`} style={{color: 'var(--color-danger)'}}>{error}</div>}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
