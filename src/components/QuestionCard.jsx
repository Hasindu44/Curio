import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playCorrect, playWrong } from "../lib/sound";
import ExplorableLab from "./ExplorableLab";
import LessonFooter from "./LessonFooter";

export function RichText({ children }) {
  if (typeof children !== "string" || !children.includes("$")) return children;
  return children.split(/(\$[^$]+\$)/g).filter(Boolean).map((part, index) =>
    part.startsWith("$") && part.endsWith("$")
      ? <InlineMath key={`${part}-${index}`} math={part.slice(1, -1)} />
      : <span key={`${part}-${index}`}>{part}</span>
  );
}

const prompts = { mcq: "Select the correct answer", numeric: "Type your answer", order: "Put the steps in order" };

function InteractiveQuestion({ question, onAnswered }) {
  const reduceMotion = useReducedMotion();
  const [explored, setExplored] = useState([]);
  const completed = explored.length === 2;
  const advanced = useRef(false);
  const advance = useCallback(() => {
    if (advanced.current) return;
    advanced.current = true;
    onAnswered(true);
  }, [onAnswered]);

  useEffect(() => {
    if (!completed) return undefined;
    playCorrect();
    const timer = setTimeout(advance, reduceMotion ? 50 : 1400);
    return () => clearTimeout(timer);
  }, [completed, advance, reduceMotion]);

  function explore(part) {
    setExplored((current) => current.includes(part) ? current : [...current, part]);
  }

  return <div className="flex flex-1 flex-col">
    <div className="mx-auto w-full max-w-2xl flex-1 px-5 pb-10 sm:px-8">
      <p className="eyebrow text-violet-dark dark:text-violet">Explore</p>
      <h2 className="mt-1 font-display text-[26px] font-extrabold leading-tight sm:text-3xl">{question.prompt}</h2>
      <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="panel mt-6 p-5 sm:p-7">
        <div className="graph-grid rounded-2xl border-2 hairline bg-[var(--surface-soft)] px-4 py-4 text-center text-2xl"><BlockMath math={question.expression} /></div>
        <p className="muted mt-5 text-sm font-bold">Tap both parts of the composition to reveal what happens.</p>
        <div className="mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {["inner", "outer"].map((part, index) => {
            const active = explored.includes(part);
            const data = question[part];
            return <div key={part} className="contents">
              <button type="button" onClick={() => explore(part)} className={`choice min-w-0 flex-1 flex-col !items-start !gap-1 ${active ? "is-selected" : ""}`}>
                <span className="eyebrow !text-[11px] opacity-70">{data.label}</span>
                <span className="text-xl"><InlineMath math={data.math} /></span>
              </button>
              {index === 0 && <svg className="muted mx-auto rotate-90 sm:rotate-0" width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true"><path d="M2 12h27m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>;
          })}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {["inner", "outer"].map((part) => explored.includes(part) && <motion.div key={part} initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sky-soft p-3 text-sm font-bold text-sky-dark dark:text-sky-light"><RichText>{question[part].explanation}</RichText></motion.div>)}
        </div>
      </motion.div>
    </div>
    <LessonFooter state={completed ? "correct" : "idle"} title="Insight unlocked!" detail={<RichText>{question.explanation}</RichText>} hint={`${explored.length} of 2 parts explored`} actionLabel="Continue" disabled={!completed} onAction={advance}/>
  </div>;
}

export default function QuestionCard({ question, onAnswered }) {
  const reduceMotion = useReducedMotion();
  const mascotRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [numericValue, setNumericValue] = useState("");
  const [order, setOrder] = useState(question.items ? [...question.items] : []);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shake, setShake] = useState(false);

  const canSubmit =
    (question.type === "mcq" && selectedIndex !== null) ||
    (question.type === "numeric" && numericValue !== "") ||
    question.type === "order";

  function checkAnswer() {
    let correct = false;
    if (question.type === "mcq") correct = selectedIndex === question.correctIndex;
    else if (question.type === "numeric") correct = Number(numericValue) === question.answer;
    else if (question.type === "order") correct = order.every((item, i) => item === question.items[i]);
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) playCorrect();
    else playWrong();
    if (correct && !reduceMotion) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const rect = mascotRef.current?.getBoundingClientRect();
        const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.2;
        const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.85;
        confetti({ particleCount: 26, spread: 60, startVelocity: 22, gravity: 0.85, ticks: 90, scalar: 0.8, origin: { x, y }, colors: ["#4CC417", "#FFB81F", "#1CA8F0"], disableForReducedMotion: true });
      }));
    }
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  const action = submitted ? () => onAnswered(isCorrect) : checkAnswer;
  const actionRef = useRef(action);
  actionRef.current = action;

  // Number keys pick a choice and Enter checks or continues, as in most drill apps.
  useEffect(() => {
    if (question.type === "lab" || question.type === "interactive") return undefined;
    function onKey(event) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (event.key === "Enter" && tag !== "BUTTON" && tag !== "A") {
        if (submitted || canSubmit) { event.preventDefault(); actionRef.current(); }
        return;
      }
      if (question.type === "mcq" && !submitted && tag !== "INPUT") {
        const index = Number(event.key) - 1;
        if (index >= 0 && index < question.options.length) setSelectedIndex(index);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, submitted, canSubmit]);

  if (question.type === "lab") return <ExplorableLab question={question} onAnswered={onAnswered} />;
  if (question.type === "interactive") return <InteractiveQuestion question={question} onAnswered={onAnswered} />;

  function moveItem(index, direction) {
    if (submitted) return;
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  return (
    <div className="flex flex-1 flex-col">
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0, x: shake && !reduceMotion ? [0, -8, 8, -5, 5, 0] : 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.3 }}
        className="mx-auto w-full max-w-2xl flex-1 px-5 pb-10 sm:px-8"
      >
        <p className="eyebrow text-sky-dark dark:text-sky">{prompts[question.type]}</p>
        <h2 className="mt-1 font-display text-[26px] font-extrabold leading-tight sm:text-3xl"><RichText>{question.prompt}</RichText></h2>

        <div className="panel mt-6 !border-0 !bg-transparent">
          {question.type === "mcq" && (
            <div className={`grid gap-3 ${question.options.length === 4 && question.optionsAreMath ? "sm:grid-cols-2" : ""}`}>
              {question.options.map((option, i) => {
                const isSelected = selectedIndex === i;
                const showCorrect = submitted && i === question.correctIndex;
                const showWrong = submitted && isSelected && i !== question.correctIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={submitted}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedIndex(i)}
                    className={`choice text-base ${showCorrect ? "is-correct" : showWrong ? "is-wrong" : isSelected ? "is-selected" : ""} ${submitted && !isSelected && !showCorrect ? "opacity-60" : ""}`}
                  >
                    <span className="choice-key" aria-hidden="true">{i + 1}</span>
                    <span className="min-w-0 flex-1">{question.optionsAreMath ? <InlineMath math={option} /> : <RichText>{option}</RichText>}</span>
                  </button>
                );
              })}
            </div>
          )}

          {question.type === "numeric" && (
            <input
              type="number"
              aria-label="Your answer"
              inputMode="decimal"
              autoFocus
              disabled={submitted}
              value={numericValue}
              onChange={(e) => setNumericValue(e.target.value)}
              placeholder="Your answer"
              className={`field max-w-xs !py-4 font-display !text-2xl !font-extrabold ${submitted ? (isCorrect ? "!border-leaf" : "!border-coral") : ""}`}
            />
          )}

          {question.type === "order" && (
            <ol className="grid gap-2.5">
              {order.map((item, i) => (
                <motion.li layout={!reduceMotion} key={item} className="choice !cursor-default !py-3 text-[15px]">
                  <span className="choice-key" aria-hidden="true">{i + 1}</span>
                  <span className="min-w-0 flex-1"><RichText>{item}</RichText></span>
                  <span className="flex shrink-0 gap-1.5">
                    {[["Move up", -1, "m6 15 6-6 6 6"], ["Move down", 1, "m6 9 6 6 6-6"]].map(([label, direction, d]) => <button key={label} type="button" aria-label={label} disabled={submitted} onClick={() => moveItem(i, direction)} className="icon-button !h-9 !w-9 disabled:opacity-30">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d}/></svg>
                    </button>)}
                  </span>
                </motion.li>
              ))}
            </ol>
          )}
        </div>
      </motion.div>

      <LessonFooter
        ref={mascotRef}
        state={!submitted ? "idle" : isCorrect ? "correct" : "wrong"}
        title={isCorrect ? "Nice! That's correct" : "Not quite"}
        detail={<RichText>{question.explanation}</RichText>}
        hint={question.type === "mcq" ? "Tip: press 1–4 to choose, Enter to check" : "Press Enter to check"}
        actionLabel={submitted ? "Continue" : "Check"}
        disabled={!submitted && !canSubmit}
        onAction={action}
      />
    </div>
  );
}
