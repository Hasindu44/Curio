import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import CourseArtwork from "./CourseArtwork";
import Mascot from "./Mascot";
import Modal from "./Modal";
import SpeechBubble from "./SpeechBubble";
import { accents } from "./SkillNode";

const questions = [
  {
    key: "goal",
    eyebrow: "Your destination",
    title: "What should this course help you do?",
    options: [
      ["understand", "Build real intuition", "I want concepts to click, not just formulas.", "💡"],
      ["exam", "Prepare for an exam", "Prioritize common problems and confident recall.", "📝"],
      ["apply", "Use it in practice", "Connect ideas to projects and real situations.", "🛠️"],
    ],
  },
  {
    key: "level",
    eyebrow: "Your starting point",
    title: "How familiar does this subject feel?",
    options: [
      ["new", "Brand new", "Start with the foundations and build carefully.", "🌱"],
      ["familiar", "A little familiar", "Refresh the essentials, then move faster.", "🌿"],
      ["confident", "Pretty confident", "Use harder prompts and fewer hints.", "🌳"],
    ],
  },
  {
    key: "pace",
    eyebrow: "Your routine",
    title: "How much time feels realistic each day?",
    options: [
      ["5", "5 minutes", "A tiny habit that is easy to protect.", "⏱️"],
      ["10", "10 minutes", "A focused lesson and one useful challenge.", "⚡"],
      ["15", "15+ minutes", "A deeper daily session with bonus problems.", "🔥"],
    ],
  },
];

export default function CourseSelector({ courses, currentCourseId, profiles = {}, onChoose, onClose, embedded = false }) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const course = courses.find(item => item.id === selected);
  const question = questions[step];
  function openCourse(item) {
    setSelected(item.id);
    setAnswers(profiles[item.id] || {});
    setStep(profiles[item.id] ? questions.length : 0);
  }
  async function commit() {
    setSaving(true); setError("");
    try { await onChoose(course, answers); } catch { setError("We couldn’t save your path. Please try again."); } finally { setSaving(false); }
  }
  const content = <AnimatePresence mode="wait" initial={false}>
    <motion.div key={step} initial={{ opacity: 0, x: reduced ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .18 }}>
      {step === -1 ? <>
        <div className="flex items-center gap-4"><Mascot size={72} className="hidden shrink-0 sm:block"/><div><h3 className="font-display text-[30px] font-extrabold leading-tight tracking-tight">What will you understand next?</h3><p className="muted mt-1 text-[15px] font-semibold">Pick a course. Your progress stays with you.</p></div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{courses.map(item => {
          const done = item.nodes.filter(node => node.status === "completed").length;
          const color = accents[item.accent] || accents.teal;
          const current = item.id === currentCourseId;
          return <button type="button" key={item.id} onClick={() => openCourse(item)} className={`panel course-tile text-left ${current ? "!border-sky-light dark:!border-sky-dark" : ""}`}>
            <div className="relative" style={{ background: `${color.face}1f` }}><CourseArtwork course={item} className="h-36 w-full"/>{current && <span className="absolute left-3 top-3 rounded-lg bg-sky px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">Current</span>}</div>
            <div className="p-4"><h4 className="font-display text-xl font-extrabold leading-tight">{item.title}</h4><p className="muted mt-1 min-h-10 text-sm font-semibold leading-snug">{item.tagline}</p><div className="mt-3 flex items-center gap-2"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-sunk)]"><div className="h-full rounded-full" style={{ width: `${done / Math.max(1, item.nodes.length) * 100}%`, background: color.face }}/></div><span className="muted text-xs font-extrabold">{done}/{item.nodes.length}</span></div></div>
          </button>;
        })}</div>
      </> : step < questions.length ? <div className="mx-auto max-w-lg py-1 sm:py-3">
        <div className="flex items-center gap-3"><button onClick={() => setStep(n => n - 1)} className="muted flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-[var(--surface-soft)]" aria-label="Previous step"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button><div className="h-4 flex-1 overflow-hidden rounded-full bg-[var(--surface-sunk)]" role="progressbar" aria-label="Course setup" aria-valuemin={0} aria-valuemax={3} aria-valuenow={step + 1}><div className="relative h-full rounded-full bg-leaf transition-[width] duration-300" style={{ width: `${(step + 1) / questions.length * 100}%` }}><span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/35"/></div></div></div>
        <div className="mt-7 flex items-center gap-4"><Mascot size={84} mood="thinking" className="shrink-0"/><SpeechBubble className="flex-1"><p className="eyebrow muted !text-[11px]">{course.title} · {question.eyebrow}</p><h3 className="mt-0.5 font-display text-xl font-extrabold leading-snug">{question.title}</h3></SpeechBubble></div>
        <div role="group" aria-label={question.title} className="mt-6 grid gap-3">{question.options.map(([value, label, copy, icon]) => <button key={value} type="button" aria-pressed={answers[question.key] === value} onClick={() => setAnswers(current => ({ ...current, [question.key]: value }))} className={`choice ${answers[question.key] === value ? "is-selected" : ""}`}><span className="text-2xl" aria-hidden="true">{icon}</span><span><span className="block text-base font-extrabold">{label}</span><span className="muted mt-0.5 block text-sm font-semibold leading-snug">{copy}</span></span></button>)}</div>
        <button disabled={!answers[question.key]} onClick={() => setStep(n => n + 1)} className="primary-button mt-7 w-full">Continue</button>
      </div> : <div className="mx-auto max-w-lg py-2 text-center">
        <div className="rounded-3xl" style={{ background: `${(accents[course.accent] || accents.teal).face}1f` }}><CourseArtwork course={course} className="mx-auto h-44 w-64"/></div>
        <p className="eyebrow mt-6 text-leaf-dark dark:text-leaf">Your path is ready</p><h3 className="mt-1 font-display text-4xl font-extrabold">{course.title}</h3><p className="muted mx-auto mt-2 max-w-sm text-[15px] font-semibold leading-relaxed">Your goal, your starting point, your pace. Let’s take the first step.</p>
        <div className="mt-6 grid grid-cols-3 gap-2">{[["Goal", { understand: "Intuition", exam: "Exam prep", apply: "Practical" }[answers.goal]], ["Level", { new: "Fresh start", familiar: "Familiar", confident: "Confident" }[answers.level]], ["Daily", `${answers.pace} min`]].map(([label, value]) => <div className="rounded-2xl border-2 hairline px-2 py-3" key={label}><p className="eyebrow muted !text-[10px]">{label}</p><p className="mt-0.5 text-sm font-extrabold">{value}</p></div>)}</div>
        {error && <p role="alert" className="mt-4 text-sm font-bold text-coral-dark">{error}</p>}
        <button disabled={saving} onClick={commit} className="primary-button mt-7 w-full">{saving ? "Opening your path…" : selected === currentCourseId ? "Continue learning" : "Start this course"}</button>
        <div className="mt-5 flex justify-center gap-6 text-sm font-extrabold uppercase tracking-wider text-sky-dark dark:text-sky"><button onClick={() => setStep(0)}>Adjust my plan</button><button onClick={() => setStep(-1)}>Other courses</button></div>
      </div>}
    </motion.div>
  </AnimatePresence>;
  return embedded ? content : <Modal title="Course library" onClose={onClose} wide>{content}</Modal>;
}
