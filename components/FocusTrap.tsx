import React, {useEffect, useRef} from 'react';

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )).filter(el => !el.hasAttribute('disabled'));
}

export const FocusTrap: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(()=>{
    previouslyFocused.current = document.activeElement;
    const node = ref.current;
    if (!node) return;
    const focusable = getFocusableElements(node);
    if (focusable.length) focusable[0].focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (!node) return;
      const focusableEls = getFocusableElements(node);
      if (!focusableEls.length) return;
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length -1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    return ()=>{
      document.removeEventListener('keydown', handleKey);
      try { (previouslyFocused.current as HTMLElement | null)?.focus(); } catch {}
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};

export default FocusTrap;
