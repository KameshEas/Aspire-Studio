import React, {useEffect} from 'react';
import FocusTrap from './FocusTrap';
import './base.css';

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
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
      <div className="modal-backdrop" onClick={onClose} />
      <FocusTrap>
        <div className="modal-panel" role="document" aria-labelledby="modal-title" style={{position:'relative',zIndex:1001}}>
          <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 id="modal-title">{title}</h3>
            <button aria-label="Close" onClick={onClose}>×</button>
          </header>
          <div>{children}</div>
        </div>
      </FocusTrap>
    </div>
  );
};

export default Modal;
