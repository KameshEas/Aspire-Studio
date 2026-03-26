import React from 'react';

export const Toast: React.FC<{message:string; onClose?: ()=>void}> = ({message, onClose}) => {
  return (
    <div role="status">
      <span>{message}</span>
      <button onClick={onClose}>x</button>
    </div>
  );
};

export default Toast;
