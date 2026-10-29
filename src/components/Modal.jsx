import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";

export default function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  const titleId = useId();
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function handleKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = [...ref.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]')].filter(el => el.getClientRects().length);
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", handleKey); previous?.focus(); };
  }, [onClose]);
  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .15 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0b1418]/60 p-3 sm:p-6" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} initial={{ y: reduced ? 0 : 24, scale: reduced ? 1 : .96 }} animate={{ y: 0, scale: 1 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }} className={`page-surface w-full overflow-y-auto overscroll-contain rounded-[24px] border-2 border-b-[6px] hairline max-h-[90dvh] ${wide ? "max-w-4xl" : "max-w-xl"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-2 hairline bg-[var(--page)] px-5 py-3 sm:px-7"><h2 id={titleId} className="font-display text-xl font-extrabold">{title}</h2><button type="button" onClick={onClose} className="icon-button" aria-label="Close dialog"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div>
        <div className="p-5 sm:p-7">{children}</div>
      </motion.section>
    </motion.div>, document.body
  );
}
