import React, { useEffect } from 'react';
import FocusTrap from './FocusTrap';

export const Modal: React.FC<{open?: boolean; onClose?: ()=>void; title?: string; children?: React.ReactNode}> = ({open, onClose, title, children}) => {
  useEffect(()=>{
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose && onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(()=>{
    if (open) document.body.style.overflow = 'hidden';
    return ()=> { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <FocusTrap>
        <div className="bg-white rounded-lg p-6 min-w-[320px] max-w-[90%] shadow-2xl" role="document" aria-labelledby="modal-title" style={{ position: 'relative', zIndex: 1001 }}>
          <header className="flex justify-between items-center mb-4">
            <h3 id="modal-title" className="text-lg font-semibold">{title}</h3>
            <button aria-label="Close" onClick={onClose} className="text-lg leading-none px-2 py-1">×</button>
          </header>
          <div>{children}</div>
        </div>
      </FocusTrap>
    </div>
  );
};

export default Modal;
