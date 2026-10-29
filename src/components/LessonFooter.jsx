import { forwardRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Mascot from "./Mascot";

const tones = {
  idle: { bar: "bg-[var(--page)]", button: "primary-button" },
  correct: { bar: "bg-leaf-soft", title: "text-leaf-deep dark:text-leaf-light", button: "primary-button" },
  wrong: { bar: "bg-coral-soft", title: "text-coral-dark dark:text-coral", button: "danger-button" },
};

// The full-width action bar pinned to the bottom of every lesson step.
const LessonFooter = forwardRef(function LessonFooter({ state = "idle", title, detail, hint, actionLabel, onAction, disabled = false }, mascotRef) {
  const reduced = useReducedMotion();
  const tone = tones[state];
  return <div className={`sticky bottom-0 z-20 border-t-2 hairline transition-colors ${tone.bar}`}>
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-5 sm:min-h-[120px] sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <AnimatePresence mode="wait" initial={false}>
        {state === "idle"
          ? <motion.p key="idle" className="muted hidden text-sm font-bold sm:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{hint}</motion.p>
          : <motion.div key={state} role="status" className="flex items-center gap-4" initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 420, damping: 30 }}>
              <span ref={mascotRef} className="hidden shrink-0 rounded-full bg-[var(--surface)] p-1 min-[420px]:block"><Mascot mood={state === "correct" ? "excited" : "sad"} size={56}/></span>
              <div className="min-w-0"><p className={`font-display text-2xl font-extrabold leading-tight ${tone.title}`}>{title}</p>{detail && <div className={`mt-1 text-[15px] font-semibold leading-snug ${tone.title}`}>{detail}</div>}</div>
            </motion.div>}
      </AnimatePresence>
      <button type="button" onClick={onAction} disabled={disabled} className={`${tone.button} w-full shrink-0 sm:ml-auto sm:w-auto sm:min-w-[160px]`}>{actionLabel}</button>
    </div>
  </div>;
});

export default LessonFooter;
