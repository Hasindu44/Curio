import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { animate, motion, useReducedMotion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { fetchLesson, submitLessonResult } from "../api/api";
import { useAuth } from "../context/AuthContext";
import QuestionCard from "../components/QuestionCard";
import HeartsDisplay from "../components/HeartsDisplay";
import Mascot from "../components/Mascot";
import SpeechBubble from "../components/SpeechBubble";
import { FlameIcon, TrophyIcon } from "../components/StatusIcons";
import { playLevelUp } from "../lib/sound";
import ThemeToggle from "../components/ThemeToggle";

function CountUp({ value }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }
    const controls = animate(0, value, { duration: 0.9, ease: "easeOut", onUpdate: (latest) => setDisplay(Math.round(latest)) });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <span>{display}</span>;
}

function StatTile({ label, value, color, icon }) {
  return <div className="overflow-hidden rounded-2xl border-2" style={{ borderColor: color, background: color }}>
    <p className="px-2 py-1 text-center text-[11px] font-extrabold uppercase tracking-wider text-white">{label}</p>
    <div className="flex items-center justify-center gap-1.5 rounded-t-xl bg-[var(--surface)] px-2 py-3 font-display text-xl font-extrabold" style={{ color }}>{icon}{value}</div>
  </div>;
}

export default function Lesson() {
  const { lessonId } = useParams();
  const { user, setUser, loseHeart, addXp } = useAuth();
  const reduceMotion = useReducedMotion();
  const [lesson, setLesson] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [completionCorrect, setCompletionCorrect] = useState(0);
  const [completionSeconds, setCompletionSeconds] = useState(0);
  const completionCardRef = useRef(null);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    let alive = true;
    setLesson(null); setLoadError("");
    fetchLesson(lessonId).then(data => {
      if (!alive) return;
      if (!data?.questions?.length) setLoadError("This lesson isn’t available yet. Choose another step in your path.");
      else setLesson(data);
    }).catch(() => { if (alive) setLoadError("We couldn’t open this lesson. Check your connection and try again."); });
    return () => { alive = false; };
  }, [lessonId]);

  useEffect(() => {
    if (!finished || !lesson || completionCorrect !== lesson.questions.length) return undefined;
    const timer = setTimeout(() => {
      const rect = completionCardRef.current?.getBoundingClientRect();
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const y = rect ? Math.max(0.08, rect.top / window.innerHeight) : 0.2;
      confetti({ particleCount: 110, spread: 90, startVelocity: 40, gravity: 0.9, origin: { x, y }, colors: ["#4CC417", "#1CA8F0", "#FFB81F", "#A46CF7", "#FF5A55"], disableForReducedMotion: true });
    }, 180);
    return () => clearTimeout(timer);
  }, [finished, lesson, completionCorrect]);

  if (loadError) return <div className="page-surface flex min-h-screen items-center justify-center px-5"><section className="max-w-md text-center"><Mascot mood="sad" size={120} className="mx-auto"/><h1 className="mt-4 font-display text-3xl font-extrabold">Your next discovery can wait.</h1><p role="alert" className="muted mt-3 font-semibold">{loadError}</p><Link to="/dashboard" className="primary-button mt-7">Back to learning</Link></section></div>;
  if (!lesson) return (
    <div aria-label="Loading lesson" className="page-surface min-h-screen px-6 py-6">
      <div className="mx-auto max-w-4xl animate-pulse">
        <div className="flex items-center gap-4"><div className="h-10 w-10 rounded-xl soft-surface" /><div className="h-4 flex-1 rounded-full soft-surface" /><div className="h-8 w-16 rounded-xl soft-surface" /></div>
        <div className="mx-auto mt-12 max-w-2xl"><div className="h-4 w-40 rounded-full soft-surface" /><div className="mt-3 h-8 w-4/5 rounded-xl soft-surface" />
          <div className="mt-8 grid gap-3">{[0, 1, 2, 3].map((item) => <div key={item} className="h-16 rounded-2xl soft-surface" />)}</div></div>
      </div>
    </div>
  );

  const question = lesson.questions[step];

  function handleAnswered(isCorrect) {
    if (isCorrect) {
      setCorrectCount((count) => count + 1);
      addXp(10);
    } else {
      loseHeart();
    }
    const next = step + 1;
    const exhausted = Boolean(user && user.hearts <= 1 && !isCorrect);
    if (next >= lesson.questions.length || exhausted) finishLesson(isCorrect ? correctCount + 1 : correctCount, !exhausted);
    else setStep(next);
  }

  async function finishLesson(finalCorrect, completedSuccessfully = true) {
    const result = await submitLessonResult(lessonId, { correctCount: finalCorrect, total: lesson.questions.length, timeSeconds: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)) });
    if (result.user) setUser(result.user);
    setCompletionCorrect(finalCorrect);
    setCompletionSeconds(Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)));
    setFinished(true);
    if (completedSuccessfully) playLevelUp();
  }

  if (finished || (user && user.hearts === 0)) {
    const outOfHearts = user && user.hearts === 0;
    const perfect = completionCorrect === lesson.questions.length;
    const accuracy = Math.round((completionCorrect / lesson.questions.length) * 100);
    return (
      <div className="page-surface flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-5 py-10">
          <motion.div ref={completionCardRef} initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9, y: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="w-full max-w-md text-center">
            <motion.div initial={{ y: reduceMotion ? 0 : -20 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 12, delay: reduceMotion ? 0 : .1 }}><div className="relative mx-auto w-fit"><Mascot mood={outOfHearts ? "sad" : "excited"} size={150} />{perfect && !outOfHearts && <span className="absolute -right-12 bottom-2 anim-pop" style={{ animationDelay: reduceMotion ? "0s" : ".5s" }}><TrophyIcon size={64}/></span>}</div></motion.div>
            <h1 className={`mt-4 font-display text-4xl font-extrabold ${outOfHearts ? "text-coral-dark dark:text-coral" : "text-gold-dark dark:text-gold"}`}>{outOfHearts ? "Out of hearts" : "Lesson complete!"}</h1>
            <p className="muted mt-2 text-[15px] font-bold">{outOfHearts ? "Come back after your hearts refill, or review the lesson to try again." : perfect ? "Perfect work! You owned every step." : `You got ${completionCorrect} of ${lesson.questions.length} correct. Review makes the tricky bits stick.`}</p>
            {!outOfHearts && <>
              <div className="mt-7 grid grid-cols-3 gap-3">
                <StatTile label="Total XP" color="#FFB81F" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>} value={<>+<CountUp value={completionCorrect * 10} /></>}/>
                <StatTile label={perfect ? "Amazing" : "Accuracy"} color="#4CC417" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>} value={`${accuracy}%`}/>
                <StatTile label="Time" color="#1CA8F0" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/></svg>} value={`${Math.floor(completionSeconds / 60)}:${String(completionSeconds % 60).padStart(2, "0")}`}/>
              </div>
              {user?.streak > 0 && <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : .5 }} className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 hairline p-3">
                <FlameIcon size={26}/><span className="font-display text-lg font-extrabold text-[#F08A00]">{user.streak} day streak!</span>
              </motion.div>}
            </>}
          </motion.div>
        </main>
        <div className="border-t-2 hairline">
          <div className="mx-auto flex max-w-4xl justify-end px-5 py-5 sm:px-8">
            <Link to="/dashboard" className="primary-button w-full sm:w-auto sm:min-w-[180px]">Continue</Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = (step / lesson.questions.length) * 100;
  return (
    <div className="page-surface flex min-h-screen flex-col">
      <header>
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 pb-2 pt-5 sm:gap-5 sm:px-8">
          <Link to="/dashboard" aria-label="Exit lesson" className="muted flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></Link>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-[var(--surface-sunk)]" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={lesson.questions.length} aria-valuenow={step}>
            <motion.div className="relative h-full rounded-full bg-leaf" initial={false} animate={{ width: `${Math.max(progress, 4)}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }}><span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/35"/></motion.div>
          </div>
          {user && <HeartsDisplay hearts={user.hearts} maxHearts={user.maxHearts}/>}
          <ThemeToggle className="hidden sm:inline-flex"/>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-2xl px-5 pb-2 pt-6 sm:px-8 sm:pt-10">
          <div className="muted flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider"><span className="shrink-0 rounded-md bg-[var(--surface-sunk)] px-2 py-0.5">{lesson.course}</span><h1 className="min-w-0">{lesson.title}</h1><span className="ml-auto shrink-0 font-mono">{step + 1}/{lesson.questions.length}</span></div>
        </div>
        <QuestionCard key={question.id} question={question} onAnswered={handleAnswered}/>
      </main>
    </div>
  );
}
