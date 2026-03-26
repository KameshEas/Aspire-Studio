import React from 'react';

export const FormField: React.FC<{
  id?: string;
  name?: string;
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: string | null;
  children?: React.ReactNode;
}> = ({id, name, label, help, error, children}) => {
  const describedBy = `${id ? id + '-help' : ''} ${error && id ? id + '-error' : ''}`.trim() || undefined;
  return (
    <div style={{marginBottom: 12}}>
      {label && <label htmlFor={id}>{label}</label>}
      <div>{children}</div>
      {help && <div id={id ? id + '-help' : undefined} style={{color: 'var(--color-muted)'}}>{help}</div>}
      {error && <div id={id ? id + '-error' : undefined} style={{color: 'var(--color-danger)'}}>{error}</div>}
    </div>
  );
};

export default FormField;
