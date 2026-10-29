import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { BRAND, BrandLink, LogoMark, Wordmark } from "../components/common/Brand";
import { TrophyIcon } from "../components/common/StatusIcons";
import CourseArtwork from "../components/course/CourseArtwork";
import CourseIcon from "../components/course/CourseIcon";
import CurvePlayground from "../components/lesson/CurvePlayground";
import LeagueCrest from "../components/gamification/LeagueCrest";
import Mascot from "../components/common/Mascot";
import SpeechBubble from "../components/common/SpeechBubble";
import { FlameIcon, GemIcon, HeartIcon, XPIcon } from "../components/common/StatusIcons";
import ThemeToggle from "../components/common/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const subjects = [
  ["calculus", "Calculus", "See the mathematics of change.", "Math", "#FFB81F"],
  ["algorithms", "Computer science", "Think logically. Solve elegantly.", "Computing", "#A46CF7"],
  ["mechanics", "Physics", "Make sense of a moving world.", "Science", "#1CA8F0"],
  ["linear-algebra", "Linear algebra", "A new dimension of thinking.", "Math", "#4CC417"],
  ["probability", "Probability", "Find clarity in uncertainty.", "Math", "#FF5A55"],
  ["chemistry", "Chemistry", "Discover what makes things matter.", "Science", "#14B8A6"],
  ["astronomy", "Astronomy", "Let your curiosity go further.", "Science", "#5B6CF0"],
];
function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .45, delay: reduced ? 0 : delay }}>{children}</motion.div>;
}

function ChoiceMock() {
  return <div className="panel panel-raised mx-auto w-full max-w-sm p-5">
    <p className="eyebrow text-sky-dark dark:text-sky">Select the correct answer</p>
    <p className="mt-1 font-display text-xl font-extrabold leading-snug">Which line has the steepest slope?</p>
    <div className="mt-4 grid gap-2.5">{["y = x + 4", "y = 3x − 1", "y = ½x"].map((option, i) => <div key={option} className={`choice !py-3 ${i === 1 ? "is-correct" : ""}`}><span className="choice-key">{i + 1}</span><span className="font-mono text-sm">{option}</span></div>)}</div>
    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-leaf-soft p-3"><Mascot mood="excited" size={40}/><p className="font-display text-lg font-extrabold text-leaf-deep dark:text-leaf-light">Nice! That’s correct</p></div>
  </div>;
}
function MotivationMock() {
  return <div className="relative mx-auto w-full max-w-sm">
    <div className="panel panel-raised p-5">
      <div className="flex items-center justify-between"><div className="flex items-center gap-1 font-display text-lg font-extrabold text-[#F07800]"><FlameIcon size={30}/>12</div><div className="flex items-center gap-1 font-display text-lg font-extrabold text-[#E33B3B]"><GemIcon size={30}/>680</div><div className="flex items-center gap-1 font-display text-lg font-extrabold text-[#E33B3B]"><HeartIcon size={30}/>5</div></div>
      <div className="mt-5 flex items-center gap-4 rounded-2xl border-2 hairline p-4"><LeagueCrest league={{ id: "sapphire" }} size={56} animated/><div className="flex-1"><p className="font-display text-xl font-extrabold">Sapphire League</p><p className="muted text-sm font-bold">#3 this week</p></div><TrophyIcon size={40}/></div>
      <div className="mt-4 rounded-2xl border-2 hairline p-4"><div className="flex items-center gap-3"><XPIcon size={28}/><p className="flex-1 font-extrabold">Earn 50 XP</p><span className="muted text-xs font-extrabold">40 / 50</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-[var(--surface-sunk)]"><div className="h-full w-4/5 rounded-full bg-gold"/></div></div>
    </div>
  </div>;
}
function PathMock() {
  const nodes = [["#FFB81F", "#D99400", 0, true], ["#FFB81F", "#D99400", 46, true], ["#FFB81F", "#D99400", 64, false], ["#E4E7EA", "#C8CED3", 36, false]];
  return <div className="relative mx-auto h-[330px] w-full max-w-sm">
    <div className="absolute inset-x-0 top-0 rounded-2xl bg-gold px-4 py-3 text-[#3B2A00] shadow-[0_4px_0_#D99400]"><p className="text-xs font-extrabold uppercase tracking-wider opacity-75">Unit 1</p><p className="font-display text-lg font-extrabold">The language of change</p></div>
    {nodes.map(([face, edge, offset, done], i) => <div key={i} className="absolute flex h-[58px] w-[64px] -translate-x-1/2 items-center justify-center rounded-[50%]" style={{ left: `calc(50% + ${offset}px)`, top: 96 + i * 60, background: face, boxShadow: `0 7px 0 ${edge}` }}>
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">{done ? <path d="m9 21 7.5 7.5L32 12" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/> : <path d="m20 3.5 5 10.2 11.2 1.6-8.1 7.9 1.9 11.2L20 29.1l-10 5.3 1.9-11.2-8.1-7.9L15 13.7 20 3.5Z" fill={i === 3 ? "#AFB7BE" : "#fff"}/>}</svg>
    </div>)}
    <div className="absolute left-0 top-[150px] hidden min-[380px]:block"><Mascot size={92}/></div>
  </div>;
}

export default function Landing() {
  const { user } = useAuth();
  const start = user ? "/dashboard" : "/signup";
  return <div className="page-surface overflow-x-clip">
    <header className="sticky top-0 z-30 border-b-2 hairline bg-[var(--page)]">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-3 px-4 sm:px-8">
        <BrandLink size={40} wordClass="!text-[28px] max-[359px]:!hidden sm:!text-[32px]"/>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-extrabold uppercase tracking-wider lg:flex"><a href="#courses" className="muted hover:text-[var(--text)]">Courses</a><a href="#how-it-works" className="muted hover:text-[var(--text)]">How it works</a></nav>
        <div className="flex items-center gap-2 sm:gap-3"><ThemeToggle/><Link to={user ? "/dashboard" : "/login"} className="secondary-button btn-sm hidden sm:inline-flex">{user ? "My learning" : "Log in"}</Link><Link to={start} className="primary-button btn-sm">{user ? "Learn" : "Get started"}</Link></div>
      </div>
    </header>
    <main>
      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <Reveal className="text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 hairline px-3 py-1.5 text-sm font-extrabold"><span className="h-2 w-2 rounded-full bg-leaf"/>Math, science & code. Learn by doing.</div>
          <h1 className="display mx-auto max-w-xl text-[clamp(2.25rem,10vw,4.6rem)] lg:mx-0">Big ideas. Small steps. <span className="text-leaf">Real understanding.</span></h1>
          <p className="muted mx-auto mt-5 max-w-[460px] text-lg font-semibold leading-relaxed lg:mx-0">Bite-sized interactive lessons that make tricky concepts click. Build a streak, climb the leagues, and actually get it.</p>
          <div className="mx-auto mt-8 grid max-w-[340px] gap-3 lg:mx-0"><Link to={start} className="primary-button w-full">{user ? "Continue learning" : "Get started"}</Link>{!user && <Link to="/login" className="secondary-button w-full">I already have an account</Link>}</div>
        </Reveal>
        <Reveal delay={.1} className="relative">
          <CurvePlayground/>
          <div className="pointer-events-none absolute -bottom-8 -right-2 hidden sm:block lg:-right-8"><Mascot size={110} mood="happy"/></div>
          <div className="pointer-events-none absolute -bottom-7 left-4 hidden items-center gap-1.5 rounded-2xl border-2 border-b-4 hairline bg-[var(--surface)] px-3 py-2 font-display text-lg font-extrabold text-[#F08A00] xl:flex"><FlameIcon size={26}/>12 day streak</div>
        </Reveal>
      </section>

      <section className="border-y-2 hairline bg-[var(--surface-soft)]">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-8 gap-y-4 px-5 py-6 sm:px-8">
          {subjects.map(([id, title, , , color]) => <a key={id} href="#courses" className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--text)]"><span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: color }}><CourseIcon course={id} size={20}/></span>{title}</a>)}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-[1180px] scroll-mt-24 gap-20 px-5 py-20 sm:px-8 sm:py-28">
        {[
          ["Learn by doing", "Interactive problems, not lectures.", "Every lesson is something to play with: drag a point, tune a force, test a guess. You get instant feedback, so mistakes turn into understanding.", <ChoiceMock key="a"/>],
          ["Stay motivated", "Streaks, XP and friendly leagues.", "Small daily wins add up. Keep your streak alive, and race 30 learners in a weekly league. Finish in the top 7 to climb from Bronze to Diamond.", <MotivationMock key="b"/>],
          ["A path that fits you", "Your goal. Your level. Your pace.", "Tell us what you want and how much time you have. Your course becomes a clear path, one unlocked idea at a time.", <PathMock key="c"/>],
        ].map(([title, lead, copy, art], index) => <Reveal key={title} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <div className="text-center lg:text-left"><h2 className="display text-[clamp(2rem,6vw,3.25rem)] text-leaf">{title}</h2><p className="mt-3 font-display text-2xl font-extrabold">{lead}</p><p className="muted mx-auto mt-3 max-w-md text-[17px] font-semibold leading-relaxed lg:mx-0">{copy}</p></div>
          <div>{art}</div>
        </Reveal>)}
      </section>

      <section id="courses" className="scroll-mt-20 border-t-2 hairline bg-[var(--surface-soft)]">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-24">
          <Reveal className="text-center"><h2 className="display text-[clamp(2rem,6vw,3.25rem)]">What will click for you?</h2><p className="muted mx-auto mt-3 max-w-md text-[17px] font-semibold">Seven courses, from your first “what if?” to your next “I get it.”</p></Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map(([id, title, description, category, color], index) => <Reveal key={id} delay={index * .03}>
              <Link to={start} className="panel course-tile group h-full" aria-label={`Explore ${title}`}>
                <div className="relative" style={{ background: `${color}1f` }}><CourseArtwork course={id} className="w-full"/><span className="absolute left-3 top-3 rounded-lg bg-[var(--surface)] px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider" style={{ color }}>{category}</span></div>
                <div className="p-5"><h3 className="font-display text-xl font-extrabold leading-tight">{title}</h3><p className="muted mt-1 text-sm font-semibold leading-snug">{description}</p></div>
              </Link>
            </Reveal>)}
            <Reveal><div className="flex h-full min-h-[260px] flex-col items-start justify-center rounded-[18px] bg-leaf p-6 text-white shadow-[0_4px_0_#3A9A0F]"><Mascot size={64} mood="thinking" className="rounded-full bg-white/20 p-1"/><h3 className="mt-4 font-display text-2xl font-extrabold leading-tight">Not sure where to start?</h3><p className="mt-1 text-[15px] font-semibold text-white/85">Three quick questions will find your path.</p><Link to={start} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-extrabold uppercase tracking-wider text-leaf-dark shadow-[0_4px_0_rgba(0,0,0,.15)] active:translate-y-1 active:shadow-none">Find my path</Link></div></Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-24 text-center sm:px-8">
        <Reveal>
          <div className="mx-auto flex max-w-md items-center justify-center gap-3"><Mascot size={110} mood="excited"/><SpeechBubble className="text-left">Your next “aha” is one lesson away!</SpeechBubble></div>
          <h2 className="display mx-auto mt-8 max-w-2xl text-[clamp(2.25rem,7vw,4rem)]">Learn today. <span className="text-leaf">Understand forever.</span></h2>
          <Link to={start} className="primary-button mt-9 w-full max-w-[340px]">Get started</Link>
        </Reveal>
      </section>
    </main>
    <footer className="bg-leaf text-white">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-5 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <Link to="/" aria-label={`${BRAND} home`} className="flex items-center gap-2"><LogoMark size={38}/><Wordmark className="text-[28px] !text-white"/></Link>
        <p className="text-sm font-bold text-white/85">Stay curious. Think deeply. Keep going.</p>
        <div className="flex gap-6 text-sm font-extrabold uppercase tracking-wider"><a href="#courses" className="hover:underline">Courses</a><Link to="/login" className="hover:underline">Log in</Link></div>
      </div>
    </footer>
  </div>;
}
