import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { errorMessage } from "../../api/client";
import { fetchLessons, fetchStudioCourses } from "../../api/studio";
import Alert from "../../components/common/Alert";
import Mascot from "../../components/common/Mascot";
import Navbar from "../../components/layout/Navbar";
import CourseTag from "../../components/studio/CourseTag";
import DeleteLessonDialog from "../../components/studio/DeleteLessonDialog";
import StatusChip from "../../components/studio/StatusChip";
import { DIFFICULTIES, SORT_OPTIONS, difficultyLabel, formatDate } from "../../lib/studio";

const DEFAULTS = { search: "", course: "", status: "", difficulty: "", sort: "newest", page: "1" };
const PAGE_SIZE = 10;

function useFilters() {
  const [params, setParams] = useSearchParams();
  const read = (source) => Object.fromEntries(Object.entries(DEFAULTS).map(([key, value]) => [key, source.get(key) ?? value]));
  const filters = read(params);
  function setFilter(key, value) {
    // Start from the live URL: two quick changes must not overwrite each other
    // before React has re-rendered with the first one.
    const current = read(new URLSearchParams(window.location.search));
    const next = { ...current, [key]: value, ...(key !== "page" && { page: "1" }) };
    setParams(Object.fromEntries(Object.entries(next).filter(([k, v]) => v !== DEFAULTS[k])), { replace: key === "search" });
  }
  const clear = () => setParams({});
  const active = ["search", "course", "status", "difficulty"].some((key) => filters[key]);
  return { filters, setFilter, clear, active };
}

function RowActions({ lesson, onDelete }) {
  return <div className="flex items-center justify-end gap-1">
    <Link to={`/studio/lessons/${lesson._id}`} className="icon-button" aria-label={`View ${lesson.title}`} title="View"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></Link>
    <Link to={`/studio/lessons/${lesson._id}/edit`} className="icon-button" aria-label={`Edit ${lesson.title}`} title="Edit"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Zm10-13 3 3"/></svg></Link>
    <button type="button" onClick={() => onDelete(lesson)} className="icon-button hover:!text-coral-dark" aria-label={`Delete ${lesson.title}`} title="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg></button>
  </div>;
}

export default function LessonList() {
  const { filters, setFilter, clear, active } = useFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState(filters.search);
  const [courses, setCourses] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const [flash, setFlash] = useState(location.state?.flash ?? "");
  const cancelDelete = useCallback(() => setDeleting(null), []);

  useEffect(() => {
    // Keep the message for this visit only, not after a refresh.
    if (location.state?.flash) navigate(location.pathname + location.search, { replace: true, state: null });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchStudioCourses().then(setCourses).catch(() => {}); }, []);

  // Debounce typing so each keystroke doesn't send a request.
  useEffect(() => {
    if (search === filters.search) return undefined;
    const timer = setTimeout(() => setFilter("search", search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const query = JSON.stringify(filters);
  useEffect(() => {
    let alive = true;
    setError("");
    fetchLessons({ ...filters, limit: PAGE_SIZE })
      .then((data) => { if (alive) setResult(data); })
      .catch((err) => { if (alive) setError(errorMessage(err, "We couldn’t load lessons.")); });
    return () => { alive = false; };
  }, [query, reload]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDeleted() {
    setFlash(`Deleted “${deleting.title}”.`);
    setDeleting(null);
    if (result?.items.length === 1 && Number(filters.page) > 1) setFilter("page", String(Number(filters.page) - 1));
    else setReload((n) => n + 1);
  }

  function clearAll() {
    setSearch("");
    clear();
  }

  const page = Number(filters.page);
  const labelClass = "text-xs font-extrabold uppercase tracking-wider text-[var(--muted)]";
  const select = (key, label, options) => <div className="grid min-w-0 gap-1">
    <label htmlFor={`filter-${key}`} className={labelClass}>{label}</label>
    <select id={`filter-${key}`} value={filters[key]} onChange={(e) => setFilter(key, e.target.value)} className="field !py-2.5 !text-sm">{options}</select>
  </div>;

  return <div className="app-shell">
    <Navbar/>
    <main id="main-content" className="app-content">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-sky-dark dark:text-sky">Lesson Studio</p>
          <h1 className="mt-1 font-display text-[32px] font-extrabold leading-tight">Lessons</h1>
          <p className="muted mt-1 text-[15px] font-semibold">Create, edit and organise what learners see on their path.</p>
        </div>
        <Link to="/studio/lessons/new" className="primary-button btn-sm"><span aria-hidden="true" className="text-lg leading-none">+</span>New lesson</Link>
      </div>

      {flash && <div className="mt-5"><Alert tone="success" onDismiss={() => setFlash("")}>{flash}</Alert></div>}

      <section aria-label="Search and filters" className="panel mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
        <div className="grid min-w-0 gap-1 sm:col-span-2 lg:col-span-1">
          <label htmlFor="filter-search" className={labelClass}>Search</label>
          <input id="filter-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title, slug or summary" className="field !py-2.5 !text-sm" maxLength={80}/>
        </div>
        {select("course", "Course", <><option value="">All courses</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</>)}
        {select("status", "Status", <><option value="">Any status</option><option value="published">Published</option><option value="draft">Draft</option></>)}
        {select("difficulty", "Difficulty", <><option value="">Any difficulty</option>{DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</>)}
        {select("sort", "Sort by", SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>))}
      </section>

      <div className="mt-4 flex min-h-[28px] flex-wrap items-center justify-between gap-2 text-sm font-bold">
        <p className="muted" aria-live="polite">{result ? `${result.total} lesson${result.total === 1 ? "" : "s"}${active ? ` ${result.total === 1 ? "matches" : "match"} your filters` : ""}` : "Loading…"}</p>
        {active && <button type="button" onClick={clearAll} className="font-extrabold uppercase tracking-wider text-sky-dark dark:text-sky">Clear filters</button>}
      </div>

      {error ? <div className="panel mt-3 p-8 text-center"><Mascot mood="sad" size={80} className="mx-auto"/><p role="alert" className="mt-3 font-bold">{error}</p><button className="primary-button btn-sm mt-5" onClick={() => setReload((n) => n + 1)}>Try again</button></div>
      : !result ? <div role="status" aria-label="Loading lessons" className="panel mt-3 animate-pulse p-4">{[0, 1, 2, 3, 4].map((n) => <div key={n} className="soft-surface my-2 h-12 rounded-xl"/>)}</div>
      : result.items.length === 0 ? <div className="panel mt-3 flex flex-col items-center p-10 text-center"><Mascot mood="thinking" size={88}/><h2 className="mt-3 font-display text-2xl font-extrabold">{active ? "No lessons match" : "No lessons yet"}</h2><p className="muted mt-1 font-semibold">{active ? "Try a different search or clear the filters." : "Create the first lesson to start building a course path."}</p>{active ? <button className="secondary-button btn-sm mt-5" onClick={clearAll}>Clear filters</button> : <Link to="/studio/lessons/new" className="primary-button btn-sm mt-5">New lesson</Link>}</div>
      : <>
        <div className="panel mt-3 hidden overflow-x-auto md:block">
          <table className="data-table">
            <thead><tr><th scope="col">Lesson</th><th scope="col">Course</th><th scope="col">Status</th><th scope="col" className="hidden lg:table-cell">Difficulty</th><th scope="col" className="text-right">XP</th><th scope="col" className="hidden text-right lg:table-cell">Questions</th><th scope="col" className="hidden xl:table-cell">Updated</th><th scope="col" className="text-right"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{result.items.map((lesson) => <tr key={lesson._id}>
              <td className="max-w-[260px]"><Link to={`/studio/lessons/${lesson._id}`} className="block truncate font-extrabold hover:underline">{lesson.title}</Link><span className="muted block truncate text-xs font-bold">/{lesson.slug}</span></td>
              <td className="max-w-[180px]"><CourseTag course={lesson.course}/></td>
              <td><StatusChip published={lesson.published}/></td>
              <td className="hidden text-sm font-bold lg:table-cell">{difficultyLabel(lesson.difficulty)}</td>
              <td className="text-right font-display text-lg font-extrabold tabular-nums">{lesson.xp}</td>
              <td className="hidden text-right font-bold tabular-nums lg:table-cell">{lesson.questionCount}</td>
              <td className="muted hidden whitespace-nowrap text-sm font-bold xl:table-cell">{formatDate(lesson.updatedAt)}</td>
              <td><RowActions lesson={lesson} onDelete={setDeleting}/></td>
            </tr>)}</tbody>
          </table>
        </div>
        <ul className="mt-3 grid gap-3 md:hidden">{result.items.map((lesson) => <li key={lesson._id} className="panel p-4">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link to={`/studio/lessons/${lesson._id}`} className="block font-display text-lg font-extrabold leading-tight">{lesson.title}</Link><span className="muted block truncate text-xs font-bold">/{lesson.slug}</span></div><StatusChip published={lesson.published}/></div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"><CourseTag course={lesson.course}/><span className="muted text-sm font-bold">{difficultyLabel(lesson.difficulty)} · {lesson.xp} XP · {lesson.questionCount} Q</span></div>
          <div className="mt-2 border-t-2 hairline pt-2"><RowActions lesson={lesson} onDelete={setDeleting}/></div>
        </li>)}</ul>
        {result.totalPages > 1 && <nav aria-label="Pagination" className="mt-5 flex items-center justify-center gap-3">
          <button type="button" className="secondary-button btn-sm" disabled={page <= 1} onClick={() => setFilter("page", String(page - 1))}>Previous</button>
          <span className="text-sm font-extrabold tabular-nums">Page {result.page} of {result.totalPages}</span>
          <button type="button" className="secondary-button btn-sm" disabled={page >= result.totalPages} onClick={() => setFilter("page", String(page + 1))}>Next</button>
        </nav>}
      </>}
    </main>
    <AnimatePresence>{deleting && <DeleteLessonDialog lesson={deleting} onDeleted={handleDeleted} onCancel={cancelDelete}/>}</AnimatePresence>
  </div>;
}
