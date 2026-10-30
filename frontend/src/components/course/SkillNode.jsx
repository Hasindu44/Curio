import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export const accents = {
  amber: { face: "#FFB81F", edge: "#D99400", light: "#FFD873" },
  teal: { face: "#1CA8F0", edge: "#1286C4", light: "#84D8FF" },
  violet: { face: "#A46CF7", edge: "#7F48D6", light: "#D1B2FF" },
  green: { face: "#4CC417", edge: "#3A9A0F", light: "#7DDB4A" },
};

const POPOVER_WIDTH = 288;

function LessonGlyph({ status }) {
  return <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    {status === "completed"
      ? <path d="m9 21 7.5 7.5L32 12" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
      : status === "locked"
        ? <><path d="M13 18v-4a7 7 0 0 1 14 0v4" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/><rect x="8.5" y="17" width="23" height="17" rx="5" fill="currentColor"/></>
        : <path d="m20 3.5 5 10.2 11.2 1.6-8.1 7.9 1.9 11.2L20 29.1l-10 5.3 1.9-11.2-8.1-7.9L15 13.7 20 3.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>}
  </svg>;
}

function Meta({ children, icon }) {
  return <span className="inline-flex items-center gap-1 rounded-lg bg-black/10 px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider dark:bg-white/10">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icon}/></svg>
    {children}
  </span>;
}

const icons = {
  questions: "M9 9a3 3 0 1 1 4 2.8c-.7.3-1 1-1 1.7V14m0 4h.01",
  time: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  level: "M5 20v-4m7 4V10m7 10V4",
  xp: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
};

function LessonPreview({ id, node, colors, offset, previousTitle, number }) {
  const reduced = useReducedMotion();
  const locked = node.status === "locked";
  const done = node.status === "completed";
  const ref = useRef(null);
  const width = `min(${POPOVER_WIDTH}px, calc(100vw - 32px))`;
  useEffect(() => { ref.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" }); }, [reduced]);
  const textColor = locked ? "var(--text)" : "#fff";
  const hint = node.draft ? "Our instructors are still building this lesson. Check back soon!"
    : previousTitle ? `Finish “${previousTitle}” to unlock this lesson.` : "Finish the previous lesson to unlock this one.";
  return <motion.div ref={ref} id={id} role="group" aria-label={`${node.title} preview`}
    initial={{ opacity: 0, y: reduced ? 0 : -6, scale: reduced ? 1 : .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : -6, scale: reduced ? 1 : .96 }}
    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 32 }}
    className="absolute top-full z-30 mt-5 origin-top scroll-mb-28 rounded-2xl border-2 p-4 text-left"
    style={{ width, left: `calc(50% - ${offset}px)`, x: "-50%", color: textColor, background: locked ? "var(--surface)" : colors.face, borderColor: locked ? "var(--line)" : colors.edge, boxShadow: `0 5px 0 ${locked ? "var(--line)" : colors.edge}` }}>
    <span aria-hidden="true" className="absolute -top-[9px] h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2"
      style={{ left: `calc(50% + ${offset}px)`, background: locked ? "var(--surface)" : colors.face, borderColor: locked ? "var(--line)" : colors.edge }}/>
    <p className={`text-[11px] font-extrabold uppercase tracking-[.14em] ${locked ? "muted" : "opacity-80"}`}>Lesson {number}{node.difficulty ? ` · ${node.difficulty}` : ""}</p>
    <h3 className="mt-0.5 font-display text-xl font-extrabold leading-tight">{node.title}</h3>
    {node.summary && <p className={`mt-1 text-sm font-semibold leading-snug ${locked ? "muted" : "opacity-90"}`}>{node.summary}</p>}
    <div className={`mt-3 flex flex-wrap gap-1.5 ${locked ? "muted" : ""}`}>
      {node.questionCount > 0 && <Meta icon={icons.questions}>{node.questionCount} {node.questionCount === 1 ? "step" : "steps"}</Meta>}
      {node.minutes > 0 && <Meta icon={icons.time}>{node.minutes} min</Meta>}
      <Meta icon={icons.xp}>{node.xp} XP</Meta>
    </div>
    {locked
      ? <>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-[var(--surface-sunk)] p-2.5 text-[13px] font-bold leading-snug">
          <svg className="mt-px shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
          {hint}
        </p>
        <button type="button" disabled className="primary-button btn-sm mt-3 w-full">{node.draft ? "Coming soon" : "Locked"}</button>
      </>
      : <Link to={`/lesson/${node.id}`} className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-white font-display text-[15px] font-extrabold uppercase tracking-wide transition-transform hover:-translate-y-px active:translate-y-0.5"
        style={{ color: colors.edge, boxShadow: "0 4px 0 rgba(0,0,0,.18)" }}>
        {done ? "Review lesson" : `Start · +${node.xp} XP`}
      </Link>}
  </motion.div>;
}

export default function SkillNode({ node, accent, index = 0, dark = false, offset = 0, open = false, onToggle, previousTitle }) {
  const reduced = useReducedMotion();
  const previewId = useId();
  const locked = node.status === "locked";
  const active = node.status === "active";
  const done = node.status === "completed";
  const colors = accents[accent] || accents.teal;
  const face = locked ? (dark ? "#37464F" : "#E4E7EA") : colors.face;
  const edge = locked ? (dark ? "#26343B" : "#C8CED3") : colors.edge;
  const statusLabel = done ? "completed, tap to review" : active ? "up next" : node.draft ? "coming soon" : "locked";
  return <motion.div data-skill-node className={`relative flex w-40 flex-col items-center ${open ? "z-30" : ""}`} initial={{ opacity: 0, scale: reduced ? 1 : .8 }} animate={{ opacity: 1, scale: 1 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 22, delay: Math.min(index * .05, .35) }}>
    {active && <>
      {!open && <span aria-hidden="true" className="absolute -top-[56px] z-10 animate-bob whitespace-nowrap rounded-xl border-2 hairline bg-[var(--surface)] px-3 py-2 font-display text-[15px] font-extrabold uppercase tracking-wide" style={{ color: colors.face }}>
        Start
        <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-[5px] rotate-45 border-b-2 border-r-2 hairline bg-[var(--surface)]"/>
      </span>}
      <svg aria-hidden="true" className="pointer-events-none absolute -top-[13px]" width="98" height="98" viewBox="0 0 98 98"><circle cx="49" cy="49" r="44" fill="none" stroke="var(--line)" strokeWidth="9"/><circle cx="49" cy="49" r="44" fill="none" stroke={colors.face} strokeWidth="9" strokeLinecap="round" strokeDasharray="276" strokeDashoffset="207" transform="rotate(-90 49 49)"/></svg>
    </>}
    <motion.button type="button" onClick={onToggle} aria-expanded={open} aria-controls={open ? previewId : undefined} aria-label={`${node.title}, ${statusLabel}`}
      className="relative flex h-[66px] w-[72px] items-center justify-center rounded-[50%] outline-none focus-visible:ring-4 focus-visible:ring-sky/50"
      style={{ background: face, color: locked ? (dark ? "#5C6F79" : "#AFB7BE") : "#fff", boxShadow: `0 8px 0 ${edge}`, touchAction: "manipulation" }}
      whileHover={reduced ? undefined : { y: -2, boxShadow: `0 10px 0 ${edge}` }}
      whileTap={reduced ? undefined : locked ? { rotate: [0, -6, 6, -3, 0] } : { y: 8, boxShadow: `0 0 0 ${edge}` }}
      transition={{ type: "spring", stiffness: 700, damping: 30 }}>
      <span className="pointer-events-none absolute left-3 top-2 h-3 w-6 -rotate-12 rounded-full bg-white/30"/>
      <LessonGlyph status={node.status}/>
    </motion.button>
    <span className={`mt-5 max-w-40 text-center text-sm font-extrabold leading-tight ${locked ? "muted" : ""}`}>{node.title}</span>
    <span className="mt-0.5 text-[11px] font-extrabold uppercase tracking-wider" style={{ color: locked || done ? "var(--muted)" : colors.edge }}>
      {done ? "Review" : locked ? (node.draft ? "Coming soon" : node.minutes ? `${node.minutes} min` : "Locked") : `+${node.xp} XP`}
    </span>
    <AnimatePresence>{open && <LessonPreview id={previewId} node={node} colors={colors} offset={offset} previousTitle={previousTitle} number={index + 1}/>}</AnimatePresence>
  </motion.div>;
}
