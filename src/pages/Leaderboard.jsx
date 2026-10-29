import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import Navbar, { StatRow } from "../components/Navbar";
import LeagueCrest from "../components/LeagueCrest";
import Mascot from "../components/Mascot";
import Modal from "../components/Modal";
import { acknowledgeLeagueResult, fetchLeaderboard } from "../api/api";
import { timeLeft } from "../lib/leagues";

const avatarColors = ["#A46CF7", "#1CA8F0", "#FF8A3D", "#FF5A55", "#14B8A6", "#4CC417"];
const medals = { 1: ["#FFC800", "#E59400"], 2: ["#C9D3DB", "#98A5B0"], 3: ["#E8975A", "#B86A2E"] };

function Clock() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>;
}
function ZoneDivider({ tone, label }) {
  const color = tone === "up" ? "text-leaf-dark dark:text-leaf" : "text-coral-dark dark:text-coral";
  return <li className={`flex items-center gap-3 py-2 ${color}`}>
    <span className="h-0.5 flex-1 rounded-full bg-current opacity-40"/>
    <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.14em]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className={tone === "up" ? "" : "rotate-180"} aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>{label}
    </span>
    <span className="h-0.5 flex-1 rounded-full bg-current opacity-40"/>
  </li>;
}

function ResultModal({ result, tiers, onClose }) {
  const reduced = useReducedMotion();
  const to = tiers[result.toTier];
  useEffect(() => {
    if (result.outcome !== "promoted" || reduced) return undefined;
    const timer = setTimeout(() => confetti({ particleCount: 120, spread: 90, origin: { y: .45 }, colors: ["#4CC417", "#FFC800", "#1CA8F0", to?.color || "#A560F0"], disableForReducedMotion: true }), 250);
    return () => clearTimeout(timer);
  }, [result, reduced, to]);
  const copy = {
    promoted: ["You’ve been promoted!", `You finished #${result.rank} and advanced to the ${to?.name} League.`],
    stayed: [`You finished #${result.rank}`, `You’ll stay in the ${to?.name} League this week. Next week is a fresh start!`],
    demoted: ["You’ve been demoted", `You finished #${result.rank} and moved to the ${to?.name} League. You can climb back next week!`],
  }[result.outcome];
  return <Modal title="Last week’s results" onClose={onClose}>
    <div className="text-center">
      <div className="mx-auto w-fit"><LeagueCrest league={to} size={120} animated/></div>
      <h3 className="mt-4 font-display text-3xl font-extrabold">{copy[0]}</h3>
      <p className="muted mx-auto mt-2 max-w-sm text-[15px] font-semibold">{copy[1]}</p>
      <button type="button" onClick={onClose} className="primary-button mt-7 w-full">Continue</button>
    </div>
  </Modal>;
}

function AnimatedRow({ children, index, reduced, before, after }) {
  return <>
    {before}
    <motion.li initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .2, delay: reduced ? 0 : Math.min(index * .025, .4) }}>{children}</motion.li>
    {after}
  </>;
}

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState(null);
  const currentRef = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let alive = true;
    setLoading(true); setError("");
    fetchLeaderboard().then(board => {
      if (!alive) return;
      setData(board);
      setResult(board.lastResult || null);
    }).catch(() => { if (alive) setError("We couldn’t load the standings. Please try again."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [retry]);
  useEffect(() => {
    // Keep the learner's own badge centred in the tier strip.
    const el = currentRef.current;
    if (el?.parentElement) el.parentElement.scrollLeft = el.offsetLeft - el.parentElement.clientWidth / 2 + el.clientWidth / 2;
  }, [data]);
  const closeResult = useCallback(() => {
    setResult(null);
    acknowledgeLeagueResult().catch(() => {});
  }, []);

  const tiers = data?.tiers || [];
  const league = data?.league;
  const tierIndex = league?.tier ?? 0;
  const rows = data?.rows || [];
  const { promote = 0, demote = 0 } = data?.zones || {};
  const next = tiers[tierIndex + 1];
  const you = rows.find(row => row.isYou);
  const demoteFrom = demote ? rows.length - demote + 1 : Infinity;
  let status = null;
  if (you) {
    if (promote && you.rank <= promote) status = { tone: "up", text: `You’re in the promotion zone! Finish in the top ${promote} to reach ${next?.name}.` };
    else if (you.rank >= demoteFrom) status = { tone: "down", text: `Earn ${rows[demoteFrom - 2].xp - you.xp + 1} XP to leave the demotion zone.` };
    else if (promote) status = { tone: "safe", text: `Earn ${rows[promote - 1].xp - you.xp + 1} XP to reach the promotion zone.` };
    else status = { tone: "safe", text: "You’re in the top league. Keep earning XP to hold your rank." };
  }

  return <div className="app-shell"><Navbar/><main id="main-content" className="app-content">
    {loading ? <div role="status" aria-label="Loading leagues" className="animate-pulse"><div className="mx-auto h-28 max-w-md rounded-[18px] soft-surface"/><div className="mt-8 grid gap-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-2xl soft-surface"/>)}</div></div>
    : error ? <div className="mx-auto max-w-md text-center"><Mascot mood="sad" size={110} className="mx-auto"/><p role="alert" className="mt-4 font-bold">{error}</p><button onClick={() => setRetry(n => n + 1)} className="primary-button mt-5">Try again</button></div>
    : <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
      <div className="min-w-0">
        <section className="text-center">
          <div className="mx-auto flex max-w-xl items-end gap-2 overflow-x-auto px-2 pb-2 pt-4 [scrollbar-width:none] sm:gap-3" aria-label="League tiers">
            {tiers.map(tier => {
              const isCurrent = tier.index === tierIndex;
              return <div key={tier.id} ref={isCurrent ? currentRef : undefined} className={`flex shrink-0 flex-col items-center ${isCurrent ? "w-[84px]" : "w-[46px]"}`} title={`${tier.name} League`}>
                <div className="w-full [&_svg]:h-auto [&_svg]:w-full"><LeagueCrest league={tier} animated={isCurrent} locked={tier.index > tierIndex}/></div>
              </div>;
            })}
          </div>
          <h1 className="mt-3 font-display text-[32px] font-extrabold leading-tight">{league?.name} League</h1>
          <p className="muted mx-auto mt-1 max-w-sm text-[15px] font-semibold">{promote ? `Top ${promote} advance to the next league` : "The top league. Hold your rank against the best."}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 font-display text-lg font-extrabold text-gold-dark dark:text-gold"><Clock/>{timeLeft(data.week.endsAt)} left</p>
        </section>

        {!data.joined ? <section className="panel mx-auto mt-8 flex max-w-lg flex-col items-center p-7 text-center">
          <Mascot size={110} mood="thinking"/>
          <h2 className="mt-3 font-display text-2xl font-extrabold">Join this week’s league</h2>
          <p className="muted mt-1 max-w-xs text-[15px] font-semibold">Complete a lesson to enter the {league?.name} League and compete with up to {data.cohortSize - 1} other learners.</p>
          <Link to="/dashboard" className="primary-button mt-6 w-full max-w-xs">Start a lesson</Link>
        </section>
        : <section className="mt-6" aria-label="The standings">
          <ol className="grid grid-cols-1 gap-1">
            {rows.map((row, index) => {
              const inPromotion = promote && row.rank <= promote;
              const inDemotion = row.rank >= demoteFrom;
              return <AnimatedRow key={`${row.name}-${row.rank}`} index={index} reduced={reduced}
                before={row.rank === demoteFrom ? <ZoneDivider tone="down" label="Demotion zone"/> : null}
                after={promote && row.rank === promote && rows.length > promote ? <ZoneDivider tone="up" label="Promotion zone"/> : null}>
                <div className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 sm:gap-4 sm:px-4 ${row.isYou ? "border-2 border-leaf/40 bg-leaf-soft" : "border-2 border-transparent hover:bg-[var(--surface-soft)]"}`}>
                  {medals[row.rank]
                    ? <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold text-white" style={{ background: medals[row.rank][0], boxShadow: `0 3px 0 ${medals[row.rank][1]}` }}>{row.rank}</span>
                    : <span className={`w-8 shrink-0 text-center font-display text-lg font-extrabold ${inPromotion ? "text-leaf-dark dark:text-leaf" : inDemotion ? "text-coral-dark dark:text-coral" : "muted"}`}>{row.rank}</span>}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-extrabold text-white" style={{ background: avatarColors[index % avatarColors.length] }}>{row.name?.[0]?.toUpperCase()}</span>
                  <div className="min-w-0 flex-1"><p className={`truncate text-base font-extrabold ${row.isYou ? "text-leaf-deep dark:text-leaf-light" : ""}`}>{row.name}</p>{row.streak > 0 && <p className="muted text-xs font-bold">{row.streak} day streak</p>}</div>
                  <span className="muted whitespace-nowrap font-display text-base font-extrabold tabular-nums">{(row.xp || 0).toLocaleString()} XP</span>
                </div>
              </AnimatedRow>;
            })}
          </ol>
        </section>}
      </div>
      <aside className="grid gap-5 xl:sticky xl:top-6">
        <div className="hidden xl:block"><StatRow/></div>
        <section className="panel p-5">
          <h2 className="font-display text-xl font-extrabold">This week</h2>
          {you ? <>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border-2 hairline p-3"><p className="font-display text-2xl font-extrabold">#{you.rank}</p><p className="muted text-xs font-bold">of {rows.length} learners</p></div>
              <div className="rounded-2xl border-2 hairline p-3"><p className="font-display text-2xl font-extrabold">{you.xp.toLocaleString()}</p><p className="muted text-xs font-bold">XP this week</p></div>
            </div>
            <p className={`mt-4 rounded-xl px-3 py-2.5 text-sm font-extrabold ${status.tone === "up" ? "bg-leaf-soft text-leaf-deep dark:text-leaf-light" : status.tone === "down" ? "bg-coral-soft text-coral-dark dark:text-coral" : "bg-sky-soft text-sky-dark dark:text-sky-light"}`}>{status.text}</p>
          </> : <p className="muted mt-2 text-sm font-semibold">Finish a lesson to get ranked this week.</p>}
        </section>
        <section className="panel p-5"><h2 className="font-display text-xl font-extrabold">The league ladder</h2>
          <div className="mt-3 grid gap-0.5">{[...tiers].reverse().map(tier => <div key={tier.id} className={`flex items-center gap-3 rounded-xl border-2 px-3 py-1 ${tier.index === tierIndex ? "border-sky-light bg-sky-soft dark:border-sky-dark" : "border-transparent"}`}><LeagueCrest league={tier} size={28} locked={tier.index > tierIndex}/><span className={`flex-1 text-[15px] font-extrabold ${tier.index > tierIndex ? "muted" : ""}`}>{tier.name}</span>{tier.index === tierIndex && <span className="eyebrow !text-[10px] text-sky-dark dark:text-sky">You</span>}</div>)}</div>
        </section>
      </aside>
    </div>}
    <AnimatePresence>{result && data && <ResultModal result={result} tiers={tiers} onClose={closeResult}/>}</AnimatePresence>
  </main></div>;
}
