import React from 'react';

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  onSubmit?: (values: Record<string, FormDataEntryValue>, e?: React.FormEvent) => void;
};

export const Form: React.FC<FormProps> = ({children, onSubmit, ...rest}) => {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values: Record<string, FormDataEntryValue> = {};
    data.forEach((v, k) => { values[k] = v; });
    onSubmit && onSubmit(values, e);
  }

  return (
    <form {...rest} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

export default Form;
