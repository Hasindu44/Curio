import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { fetchLessonById } from "../../api/studio";
import Alert from "../../components/common/Alert";
import Mascot from "../../components/common/Mascot";
import RichText from "../../components/common/RichText";
import Navbar from "../../components/layout/Navbar";
import CourseTag from "../../components/studio/CourseTag";
import DeleteLessonDialog from "../../components/studio/DeleteLessonDialog";
import StatusChip from "../../components/studio/StatusChip";
import { QUESTION_TYPES, difficultyLabel, formatDate } from "../../lib/studio";

function QuestionPreview({ question, index }) {
  return <li className="panel p-4 sm:p-5">
    <div className="flex flex-wrap items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-soft font-display text-sm font-extrabold text-sky-dark">{index + 1}</span><span className="eyebrow muted">{QUESTION_TYPES[question.type]}</span></div>
    <p className="mt-2 text-[15px] font-bold leading-relaxed"><RichText>{question.prompt}</RichText></p>
    {question.type === "mcq" && <ol className="mt-3 grid gap-1.5">{question.options.map((option, i) => <li key={i} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-bold ${i === question.correctIndex ? "border-leaf/50 bg-leaf-soft" : "hairline"}`}><span className="muted w-5 text-xs font-extrabold">{String.fromCharCode(65 + i)}</span><span className="min-w-0 flex-1 break-words">{question.optionsAreMath ? <RichText>{`$${option}$`}</RichText> : <RichText>{option}</RichText>}</span>{i === question.correctIndex && <span className="text-xs font-extrabold uppercase text-leaf-dark dark:text-leaf">Correct</span>}</li>)}</ol>}
    {question.type === "numeric" && <p className="mt-3 text-sm font-bold">Answer: <span className="rounded-lg bg-leaf-soft px-2 py-1 font-mono">{question.answer}</span></p>}
    {question.type === "order" && <ol className="mt-3 grid list-decimal gap-1 pl-5 text-sm font-bold">{question.items.map((item, i) => <li key={i}><RichText>{item}</RichText></li>)}</ol>}
    {(question.type === "interactive" || question.type === "lab") && <p className="muted mt-2 text-sm font-semibold">Uses a built-in interactive explorer.</p>}
    {question.explanation && <p className="muted mt-3 border-t-2 hairline pt-3 text-sm font-semibold"><span className="font-extrabold">Explanation: </span><RichText>{question.explanation}</RichText></p>}
  </li>;
}

export default function LessonDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [flash, setFlash] = useState(location.state?.flash ?? "");
  const cancelDelete = useCallback(() => setDeleting(false), []);

  useEffect(() => {
    if (location.state?.flash) navigate(location.pathname, { replace: true, state: null });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true;
    setLesson(null);
    setError("");
    fetchLessonById(id)
      .then((data) => { if (alive) setLesson(data); })
      .catch((err) => { if (alive) setError(err?.response?.status === 404 ? "This lesson doesn’t exist. It may have been deleted." : errorMessage(err)); });
    return () => { alive = false; };
  }, [id]);

  const facts = lesson && [
    ["Position", `#${lesson.order}`],
    ["XP reward", lesson.xp],
    ["Difficulty", difficultyLabel(lesson.difficulty)],
    ["Duration", `${lesson.estimatedMinutes} min`],
    ["Created", formatDate(lesson.createdAt)],
    ["Updated", formatDate(lesson.updatedAt)],
    ["Author", lesson.createdBy?.name ?? "Seed data"],
    ["Questions", lesson.questions.length],
  ];
  const stats = lesson && [
    ["Attempts", lesson.stats.attempts],
    ["Learners", lesson.stats.learners],
    ["Avg. accuracy", lesson.stats.avgAccuracy == null ? "—" : `${lesson.stats.avgAccuracy}%`],
    ["Avg. time", lesson.stats.avgSeconds == null ? "—" : `${Math.round(lesson.stats.avgSeconds / 60 * 10) / 10} min`],
  ];

  return <div className="app-shell">
    <Navbar/>
    <main id="main-content" className="app-content">
      <Link to="/studio" className="eyebrow inline-flex items-center gap-1 text-sky-dark dark:text-sky">← All lessons</Link>
      {error ? <section className="panel mx-auto mt-6 max-w-lg p-8 text-center"><Mascot mood="sad" size={88} className="mx-auto"/><h1 className="mt-3 font-display text-2xl font-extrabold">Lesson not available</h1><p role="alert" className="muted mt-2 font-semibold">{error}</p><Link to="/studio" className="primary-button btn-sm mt-6">Back to lessons</Link></section>
      : !lesson ? <div role="status" aria-label="Loading lesson" className="mt-6 animate-pulse"><div className="soft-surface h-10 w-2/3 rounded-xl"/><div className="soft-surface mt-6 h-40 rounded-[18px]"/></div>
      : <>
        {flash && <div className="mt-4"><Alert tone="success" onDismiss={() => setFlash("")}>{flash}</Alert></div>}
        <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3"><CourseTag course={lesson.course}/><StatusChip published={lesson.published}/></div>
            <h1 className="mt-2 break-words font-display text-[32px] font-extrabold leading-tight">{lesson.title}</h1>
            <p className="muted text-sm font-bold">/{lesson.slug}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lesson.published && <Link to={`/lesson/${lesson.slug}`} className="secondary-button btn-sm">Try as learner</Link>}
            <Link to={`/studio/lessons/${lesson._id}/edit`} className="sky-button btn-sm">Edit</Link>
            <button type="button" onClick={() => setDeleting(true)} className="danger-button btn-sm">Delete</button>
          </div>
        </header>
        {lesson.summary && <p className="mt-4 max-w-2xl text-[15px] font-semibold leading-relaxed">{lesson.summary}</p>}

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
            <h2 className="font-display text-2xl font-extrabold">Questions</h2>
            {lesson.questions.length ? <ol className="mt-3 grid gap-3">{lesson.questions.map((q, i) => <QuestionPreview key={q.id} question={q} index={i}/>)}</ol>
            : <div className="panel mt-3 p-6 text-center"><p className="font-bold">This draft has no questions yet.</p><Link to={`/studio/lessons/${lesson._id}/edit`} className="secondary-button btn-sm mt-4">Add questions</Link></div>}
          </section>
          <aside className="grid gap-5 xl:sticky xl:top-6">
            <section className="panel p-5"><h2 className="font-display text-xl font-extrabold">Details</h2><dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">{facts.map(([label, value]) => <div key={label}><dt className="eyebrow muted !text-[11px]">{label}</dt><dd className="font-extrabold">{value}</dd></div>)}</dl></section>
            <section className="panel p-5"><h2 className="font-display text-xl font-extrabold">Learner activity</h2><dl className="mt-3 grid grid-cols-2 gap-3">{stats.map(([label, value]) => <div key={label} className="rounded-xl bg-[var(--surface-soft)] p-3"><dt className="muted text-xs font-bold">{label}</dt><dd className="font-display text-2xl font-extrabold">{value}</dd></div>)}</dl></section>
          </aside>
        </div>
      </>}
    </main>
    <AnimatePresence>{deleting && <DeleteLessonDialog lesson={lesson} onDeleted={() => navigate("/studio", { state: { flash: `Deleted “${lesson.title}”.` } })} onCancel={cancelDelete}/>}</AnimatePresence>
  </div>;
}
