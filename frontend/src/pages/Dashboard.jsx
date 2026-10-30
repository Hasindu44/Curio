import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar, { StatRow } from "../components/layout/Navbar";
import CourseArtwork from "../components/course/CourseArtwork";
import CourseSelector from "../components/course/CourseSelector";
import CourseJourney from "../components/course/CourseJourney";
import FirstRunExperience from "../components/course/FirstRunExperience";
import LeagueCrest from "../components/gamification/LeagueCrest";
import Mascot from "../components/common/Mascot";
import Modal from "../components/common/Modal";
import SpeechBubble from "../components/common/SpeechBubble";
import { accents } from "../components/course/SkillNode";
import { FlameIcon, XPIcon } from "../components/common/StatusIcons";
import { fetchCourses } from "../api/courses";
import { saveCourseProfile, setActiveCoursePreference } from "../api/users";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { timeLeft } from "../lib/leagues";

const dailyProblems = {
  calculus: ["What happens when one function lives inside another?", "bonus-pattern"],
  mechanics: ["What force keeps an accelerating system in balance?", "newtons-laws"],
  algorithms: ["Can you predict the next recursive call?", "recursion"],
  "linear-algebra": ["What can a vector tell you that a number cannot?", "vectors"],
  probability: ["How likely is likely?", "probability-basics"],
  chemistry: ["What makes one element different from another?", "atoms"],
  astronomy: ["How can a star shine for billions of years?", "stars"],
};
function readProfiles() {
  try { return JSON.parse(localStorage.getItem("axiom_course_profiles") || "{}"); } catch { return {}; }
}
function Bar({ value, color = "#FFB81F", label }) {
  return <div className="h-4 flex-1 overflow-hidden rounded-full bg-[var(--surface-sunk)]" role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
    <div className="relative h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max(value, 0)}%`, background: color }}><span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/30"/></div>
  </div>;
}
export default function Dashboard() {
  const { user, setUser } = useAuth();
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [profiles, setProfiles] = useState(() => user?.courseProfiles ?? readProfiles());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncError, setSyncError] = useState("");
  const [retry, setRetry] = useState(0);
  const [showSelector, setShowSelector] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const closeSelector = useCallback(() => setShowSelector(false), []);
  const closeGuide = useCallback(() => setGuideOpen(false), []);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    fetchCourses().then(data => {
      if (!alive) return;
      if (!data.length) { setError("Your course library is empty. Please try again shortly."); return; }
      setCourses(data);
      const saved = user?.activeCourseId || localStorage.getItem("axiom_active_course");
      if (saved && data.some(course => course.id === saved)) setActiveCourseId(saved);
    }).catch(() => { if (alive) setError("We couldn’t load your courses. Check your connection and try again."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [retry, user?.id]);

  const course = courses.find(item => item.id === activeCourseId);
  const profile = profiles[activeCourseId];
  const next = course?.nodes.find(node => node.status === "active") || course?.nodes.find(node => node.status === "completed");
  const complete = course?.nodes.filter(node => node.status === "completed").length || 0;
  const progress = course ? Math.round(complete / Math.max(1, course.nodes.length) * 100) : 0;
  const daily = dailyProblems[activeCourseId];
  const league = user?.league;
  const color = accents[course?.accent] || accents.teal;
  const xp = user?.xp || 0;
  const milestone = Math.ceil((xp + 1) / 1000) * 1000;
  const goals = course ? [
    { label: next?.status === "active" ? `Finish ${next.title}` : "Review a lesson", value: next?.status === "active" ? 0 : 1, max: 1, icon: <FlameIcon size={30}/>, color: "#FF9F1C" },
    { label: `Complete Unit 1 of ${course.title}`, value: complete, max: course.nodes.length, icon: <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg" style={{ background: color.face }}><svg width="18" height="18" viewBox="0 0 40 40" fill="#fff" aria-hidden="true"><path d="m20 3.5 5 10.2 11.2 1.6-8.1 7.9 1.9 11.2L20 29.1l-10 5.3 1.9-11.2-8.1-7.9L15 13.7 20 3.5Z"/></svg></span>, color: color.face },
    { label: `Reach ${milestone.toLocaleString()} XP`, value: xp - (milestone - 1000), max: 1000, icon: <XPIcon size={30}/>, color: "#FFC800", display: xp.toLocaleString() },
  ] : [];
  async function chooseCourse(selected, answers) {
    const nextProfiles = { ...profiles, [selected.id]: answers };
    setProfiles(nextProfiles);
    setActiveCourseId(selected.id);
    setShowSelector(false);
    setSyncError("");
    localStorage.setItem("axiom_course_profiles", JSON.stringify(nextProfiles));
    localStorage.setItem("axiom_active_course", selected.id);
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    try {
      await saveCourseProfile(selected.id, answers);
      await setActiveCoursePreference(selected.id);
      setUser(current => ({ ...current, activeCourseId: selected.id, courseProfiles: nextProfiles }));
    } catch { setSyncError("Your selection is saved on this device, but couldn’t sync to your account. Please try choosing the course again when you’re connected."); }
  }
  if (!loading && !error && !course) return <FirstRunExperience courses={courses} onComplete={chooseCourse}/>;
  return <div className="app-shell">
    <Navbar/>
    <main id="main-content" className="app-content">
      {loading ? <div role="status" aria-label="Loading courses" className="animate-pulse"><div className="h-8 w-64 rounded-xl soft-surface"/><div className="mt-6 h-48 rounded-[18px] soft-surface"/><div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]"><div>{[0,1,2].map(n=><div key={n} className="mx-auto mb-14 h-[66px] w-[72px] rounded-full soft-surface"/>)}</div><div className="h-64 rounded-[18px] soft-surface"/></div></div>
      : error ? <section className="panel mx-auto max-w-lg p-8 text-center"><Mascot mood="sad" size={96} className="mx-auto"/><h1 className="mt-4 font-display text-2xl font-extrabold">A little pause in the path</h1><p className="muted mt-2 font-semibold">{error}</p><button className="primary-button mt-6" onClick={()=>setRetry(n=>n+1)}>Try again</button></section>
      : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .2 }} className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
        <div className="min-w-0">
          <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-tight sm:text-[32px]">Hi {user?.name?.split(" ")[0] || "there"}, ready to learn?</h1>
          {syncError && <p role="alert" className="mt-4 rounded-2xl border-2 border-coral/40 bg-coral-soft p-4 text-sm font-bold">{syncError}</p>}
          <section className="panel panel-raised mt-5 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="flex items-center justify-center sm:w-[220px] sm:shrink-0" style={{ background: `${color.face}22` }}><CourseArtwork course={course} className="h-36 w-full max-w-[260px] sm:h-full"/></div>
              <div className="min-w-0 flex-1 p-5 sm:p-6">
                <p className="eyebrow" style={{ color: color.edge }}>Jump back in</p>
                <h2 className="mt-1 font-display text-[30px] font-extrabold leading-tight tracking-tight">{course.title}</h2>
                <p className="muted mt-1 text-sm font-semibold leading-relaxed">{course.tagline}</p>
                <div className="mt-4 flex items-center gap-3"><Bar value={progress} color={color.face} label="Course completion"/><span className="muted whitespace-nowrap text-xs font-extrabold">{complete} / {course.nodes.length}</span></div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {next && <Link to={`/lesson/${next.id}`} className="primary-button btn-sm">{complete === course.nodes.length ? "Review" : "Continue"}<span className="hidden sm:inline">· {next.title}</span></Link>}
                  <button onClick={()=>setShowSelector(true)} className="secondary-button btn-sm">Switch course</button>
                </div>
              </div>
            </div>
          </section>
          <div className="sticky top-[74px] z-20 mt-8 md:top-[74px] xl:top-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4" style={{ background: color.face, boxShadow: `0 4px 0 ${color.edge}`, color: course.accent === "amber" ? "#3B2A00" : "#fff" }}>
              <div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-[.12em] opacity-80">Unit 1 · Foundations</p><h2 className="mt-0.5 font-display text-xl font-extrabold leading-tight">{course.id === "calculus" ? "The language of change" : `Discovering ${course.title}`}</h2></div>
              <button onClick={()=>setGuideOpen(true)} aria-label="Open unit guidebook" className="flex h-11 shrink-0 items-center gap-2 rounded-xl border-2 px-3 transition-colors hover:bg-white/15" style={{ borderColor: "rgba(255,255,255,.45)", boxShadow: `0 3px 0 ${color.edge}` }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true"><path d="M3 4c4-1 6 0 9 2v15c-3-2-5-3-9-2V4Zm18 0c-4-1-6 0-9 2v15c3-2 5-3 9-2V4Z"/></svg><span className="hidden text-sm font-extrabold uppercase tracking-wider sm:inline">Guidebook</span></button>
            </div>
          </div>
          <CourseJourney nodes={course.nodes} accent={course.accent} dark={theme === "dark"}/>
        </div>
        <aside className="grid gap-5 xl:sticky xl:top-6">
          <div className="hidden xl:block"><StatRow/></div>
          <Link to="/leaderboard" className="panel group flex items-center gap-4 p-5 transition-colors hover:bg-[var(--surface-soft)]">
            <LeagueCrest league={league || { id: "bronze" }} size={58} animated/>
            <div className="min-w-0 flex-1"><h2 className="font-display text-xl font-extrabold">{league ? `${league.name} League` : "Leagues"}</h2><p className="muted mt-0.5 text-sm font-semibold">{league?.joined ? `${(league.points || 0).toLocaleString()} XP this week · ${timeLeft(league.weekEndsAt)} left` : "Finish a lesson to join this week’s league."}</p></div>
            <span className="eyebrow text-sky-dark transition-transform group-hover:translate-x-0.5 dark:text-sky">View</span>
          </Link>
          <section className="panel p-5">
            <div className="flex items-center justify-between"><h2 className="font-display text-xl font-extrabold">Goals</h2><Link to="/profile" className="eyebrow text-sky-dark dark:text-sky">View all</Link></div>
            <ul className="mt-4 grid gap-5">{goals.map(goal => <li key={goal.label} className="flex items-center gap-3">
              <span className="shrink-0">{goal.icon}</span>
              <div className="min-w-0 flex-1"><p className="text-[15px] font-extrabold leading-tight">{goal.label}</p><div className="mt-2 flex items-center gap-2"><Bar value={goal.value / goal.max * 100} color={goal.color} label={goal.label}/><span className="muted w-14 text-right text-xs font-extrabold tabular-nums">{goal.display ?? `${goal.value} / ${goal.max}`}</span></div></div>
            </li>)}</ul>
            {profile && <p className="muted mt-5 border-t-2 hairline pt-4 text-sm font-semibold">Daily intention: <strong className="text-[var(--text)]">{profile.pace} minutes</strong></p>}
          </section>
          {daily && <section className="panel overflow-hidden">
            <div className="flex items-center gap-3 bg-[#2B3137] px-5 py-4 text-white dark:bg-[var(--surface-soft)]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-[#3B2A00]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z"/></svg></span><div><p className="eyebrow text-gold">Daily problem</p><p className="text-xs font-bold text-white/60">A fresh puzzle every day</p></div></div>
            <div className="p-5"><h2 className="font-display text-[22px] font-extrabold leading-snug">{daily[0]}</h2><Link to={`/lesson/${daily[1]}`} className="secondary-button btn-sm mt-4 w-full">Solve it</Link></div>
          </section>}
          <section className="flex items-center gap-3 py-1"><Mascot size={72} mood="happy" className="shrink-0"/><SpeechBubble className="text-sm">You don’t have to figure it all out today. Just the next step.</SpeechBubble></section>
        </aside>
      </motion.div>}
    </main>
    <AnimatePresence>{showSelector && <CourseSelector courses={courses} currentCourseId={activeCourseId} profiles={profiles} onChoose={chooseCourse} onClose={closeSelector}/>}
      {guideOpen && course && <Modal title="Unit guidebook" onClose={closeGuide}><div className="rounded-2xl" style={{ background: `${color.face}22` }}><CourseArtwork course={course} className="mx-auto w-56"/></div><p className="eyebrow mt-5" style={{ color: color.edge }}>Unit 1 · {course.title}</p><h3 className="mt-1 font-display text-3xl font-extrabold">Ideas worth connecting</h3><p className="muted mt-2 text-sm font-semibold leading-relaxed">{course.tagline}. Work through these ideas in order, then revisit completed lessons whenever you need a refresher.</p><ol className="mt-5 grid gap-2">{course.nodes.map((node,index)=>{
        const locked = node.status === "locked";
        const body = <><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold" style={locked ? { background: "var(--surface-sunk)", color: "var(--muted)" } : { background: color.face, color: "#fff" }}>{index+1}</span><span className="min-w-0 flex-1"><span className="block text-[15px] font-extrabold leading-tight">{node.title}</span>{node.summary && <span className="muted mt-0.5 block text-[13px] font-semibold leading-snug">{node.summary}</span>}{node.minutes > 0 && <span className="muted mt-1 block text-[11px] font-extrabold uppercase tracking-wider">{node.questionCount} steps · {node.minutes} min · {node.xp} XP</span>}</span><span className={`eyebrow shrink-0 !text-[10px] ${node.status === "completed" ? "text-leaf-dark dark:text-leaf" : node.status === "active" ? "" : "muted"}`} style={node.status === "active" ? { color: color.edge } : undefined}>{node.status === "completed" ? "Done" : node.status === "active" ? "Up next" : node.draft ? "Soon" : "Locked"}</span></>;
        return <li key={node.id}>{locked
          ? <div className="flex items-center gap-3 rounded-2xl border-2 hairline p-3">{body}</div>
          : <Link to={`/lesson/${node.id}`} className="flex items-center gap-3 rounded-2xl border-2 hairline p-3 transition-colors hover:bg-[var(--surface-soft)]">{body}</Link>}</li>;
      })}</ol></Modal>}
    </AnimatePresence>
  </div>;
}
