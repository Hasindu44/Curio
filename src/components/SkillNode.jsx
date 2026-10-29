import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

export const accents = {
  amber: { face: "#FFB81F", edge: "#D99400", light: "#FFD873" },
  teal: { face: "#1CA8F0", edge: "#1286C4", light: "#84D8FF" },
  violet: { face: "#A46CF7", edge: "#7F48D6", light: "#D1B2FF" },
  green: { face: "#4CC417", edge: "#3A9A0F", light: "#7DDB4A" },
};

function LessonGlyph({ done }) {
  return <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    {done
      ? <path d="m9 21 7.5 7.5L32 12" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
      : <path d="m20 3.5 5 10.2 11.2 1.6-8.1 7.9 1.9 11.2L20 29.1l-10 5.3 1.9-11.2-8.1-7.9L15 13.7 20 3.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>}
  </svg>;
}

export default function SkillNode({ node, accent, index = 0, dark = false }) {
  const reduced = useReducedMotion();
  const locked = node.status === "locked";
  const active = node.status === "active";
  const done = node.status === "completed";
  const colors = accents[accent] || accents.teal;
  const face = locked ? (dark ? "#37464F" : "#E4E7EA") : colors.face;
  const edge = locked ? (dark ? "#26343B" : "#C8CED3") : colors.edge;
  const button = <motion.div className="relative flex h-[66px] w-[72px] items-center justify-center rounded-[50%]"
    style={{ background: face, color: locked ? (dark ? "#5C6F79" : "#AFB7BE") : "#fff", boxShadow: `0 8px 0 ${edge}`, touchAction: "manipulation" }}
    whileTap={locked || reduced ? undefined : { y: 8, boxShadow: `0 0 0 ${edge}` }}
    transition={{ type: "spring", stiffness: 700, damping: 30 }}>
    <span className="pointer-events-none absolute left-3 top-2 h-3 w-6 -rotate-12 rounded-full bg-white/30"/>
    <LessonGlyph done={done}/>
  </motion.div>;
  return <motion.div className="relative flex w-40 flex-col items-center" initial={{ opacity: 0, scale: reduced ? 1 : .8 }} animate={{ opacity: 1, scale: 1 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 22, delay: Math.min(index * .05, .35) }}>
    {active && <>
      <span aria-hidden="true" className="absolute -top-[56px] z-10 animate-bob whitespace-nowrap rounded-xl border-2 hairline bg-[var(--surface)] px-3 py-2 font-display text-[15px] font-extrabold uppercase tracking-wide" style={{ color: colors.face }}>
        Start
        <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-[5px] rotate-45 border-b-2 border-r-2 hairline bg-[var(--surface)]"/>
      </span>
      <svg aria-hidden="true" className="pointer-events-none absolute -top-[13px]" width="98" height="98" viewBox="0 0 98 98"><circle cx="49" cy="49" r="44" fill="none" stroke="var(--line)" strokeWidth="9"/><circle cx="49" cy="49" r="44" fill="none" stroke={colors.face} strokeWidth="9" strokeLinecap="round" strokeDasharray="276" strokeDashoffset="207" transform="rotate(-90 49 49)"/></svg>
    </>}
    {locked
      ? <button type="button" disabled aria-label={`${node.title}. Complete the previous lesson to unlock.`} className="cursor-not-allowed rounded-full">{button}</button>
      : <Link to={`/lesson/${node.id}`} className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-sky/50" aria-label={`${done ? "Review" : "Start"} ${node.title}`}>{button}</Link>}
    <span className={`mt-5 max-w-40 text-center text-sm font-extrabold leading-tight ${locked ? "muted" : ""}`}>{node.title}</span>
    {!locked && <span className="mt-0.5 text-[11px] font-extrabold uppercase tracking-wider" style={{ color: done ? "var(--muted)" : colors.edge }}>{done ? "Review" : `+${node.xp} XP`}</span>}
  </motion.div>;
}
