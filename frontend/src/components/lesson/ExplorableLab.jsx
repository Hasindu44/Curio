import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { playCorrect } from "../../lib/sound";
import LessonFooter from "./LessonFooter";

function LabShell({ title, instruction, status, complete, onComplete, insight, children }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-2xl flex-1 px-5 pb-10 sm:px-8">
        <p className="eyebrow text-leaf-dark dark:text-leaf">Interactive lab</p>
        <h2 className="mt-1 font-display text-[26px] font-extrabold leading-tight sm:text-3xl">{title}</h2>
        <p className="muted mt-2 max-w-xl text-[15px] font-semibold leading-relaxed">{instruction}</p>
        <div className="panel mt-6 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b-2 hairline px-5 py-3">
            <span className="eyebrow muted !text-[11px]">Experiment</span>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${complete ? "bg-leaf-soft text-leaf-deep dark:text-leaf-light" : "bg-[var(--surface-sunk)] text-[var(--muted)]"}`}>{complete ? "Insight unlocked" : status}</span>
          </div>
          <div className="p-5 sm:p-6">{children}</div>
        </div>
      </div>
      <LessonFooter state={complete ? "correct" : "idle"} title="Nicely done!" detail={insight} hint="Experiment first. The answer follows." actionLabel="Complete experiment" disabled={!complete} onAction={onComplete}/>
    </div>
  );
}

function Range({ label, value, min, max, step = 1, onChange, valueLabel }) {
  return <label className="block"><span className="mb-2.5 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider"><span className="muted">{label}</span><span className="rounded-lg bg-sky-soft px-2 py-0.5 font-mono text-sky-dark dark:text-sky-light">{valueLabel ?? value}</span></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="lab-range" /></label>;
}

const canvas = "graph-grid rounded-2xl border-2 hairline bg-[var(--surface-soft)]";

function CurveLab({ onAnswered }) {
  const reduceMotion = useReducedMotion();
  const [x, setX] = useState(0);
  const [visited, setVisited] = useState(() => new Set(["center"]));
  const complete = visited.size === 3;
  const px = 150 + x * 50;
  const py = 170 - x * x * 26;
  const slope = 2 * x;
  const angle = -Math.atan(slope * .52) * 180 / Math.PI;

  function update(value) {
    setX(value);
    setVisited((current) => {
      const next = new Set(current);
      if (value < -1.2) next.add("left");
      if (Math.abs(value) < .3) next.add("center");
      if (value > 1.2) next.add("right");
      return next;
    });
  }

  return <LabShell title="Tangent scanner" instruction="Move the probe across the curve. Watch how the tangent turns as the point travels from falling, through flat, to rising." status={`${visited.size}/3 regions scanned`} complete={complete} insight="The slope is negative, then zero, then positive." onComplete={() => { playCorrect(); onAnswered(true); }}>
    <div className={`relative overflow-hidden p-2 ${canvas}`}>
      <svg viewBox="0 0 300 205" className="w-full" role="img" aria-label="Interactive parabola with moving tangent line">
        <line x1="20" y1="170" x2="280" y2="170" stroke="var(--muted)" strokeOpacity=".35" strokeWidth="1.5"/><line x1="150" y1="18" x2="150" y2="192" stroke="var(--muted)" strokeOpacity=".35" strokeWidth="1.5"/>
        <path d="M30 20.24 Q150 319.76 270 20.24" fill="none" stroke="#1CA8F0" strokeWidth="4.5" strokeLinecap="round"/>
        <motion.g animate={{ x: px, y: py, rotate: angle }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 22 }}><line x1="-55" x2="55" stroke="#FFB81F" strokeWidth="4" strokeLinecap="round"/><circle r="8" fill="#4CC417" stroke="#fff" strokeWidth="3"/></motion.g>
        <text x="14" y="24" fill="var(--muted)" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">slope = {slope.toFixed(1)}</text>
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-1.5">{["left", "center", "right"].map((zone) => <span key={zone} className={`h-2 w-8 rounded-full ${visited.has(zone) ? "bg-leaf" : "bg-[var(--line-strong)]"}`} />)}</div>
    </div>
    <div className="mt-6"><Range label="Probe position x" value={x} min={-2.4} max={2.4} step={.1} onChange={update} valueLabel={x.toFixed(1)} /></div>
  </LabShell>;
}

function ForceLab({ onAnswered }) {
  const reduceMotion = useReducedMotion();
  const [mass, setMass] = useState(2);
  const [force, setForce] = useState(2);
  const acceleration = force / mass;
  const complete = Math.abs(acceleration - 3) < .08;
  const travel = Math.min(148, acceleration * 30);

  return <LabShell title="Force bench" instruction="Tune force and mass until the cart accelerates at exactly 3 m/s². The motion diagram updates from your inputs." status={`${acceleration.toFixed(1)} m/s²`} complete={complete} insight="a = F / m. Double the mass, and you need double the force." onComplete={() => { playCorrect(); onAnswered(true); }}>
    <div className={`p-5 ${canvas}`}>
      <div className="relative h-36"><div className="absolute inset-x-0 bottom-5 h-1 rounded-full bg-[var(--line-strong)]" />
        <motion.div className="absolute bottom-7 left-2" animate={{ x: travel }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}><div className="relative h-14 w-24 rounded-xl bg-sky shadow-[0_4px_0_#1286C4]"><span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">{mass} kg</span><span className="absolute -bottom-4 left-3 h-6 w-6 rounded-full border-4 border-[var(--surface)] bg-[#2B3137]"/><span className="absolute -bottom-4 right-3 h-6 w-6 rounded-full border-4 border-[var(--surface)] bg-[#2B3137]"/></div><motion.div className="absolute -right-16 top-5 flex origin-left items-center" animate={{ scaleX: .6 + force / 15 }}><span className="h-1.5 w-12 rounded-full bg-gold"/><span className="-ml-1 border-y-[7px] border-l-[10px] border-y-transparent border-l-gold"/></motion.div></motion.div>
        <div className="muted absolute left-2 top-0 font-mono text-xs font-bold">F = ma</div>
      </div>
    </div>
    <div className="mt-6 grid gap-6 sm:grid-cols-2"><Range label="Net force" value={force} min={1} max={12} onChange={setForce} valueLabel={`${force} N`} /><Range label="Cart mass" value={mass} min={1} max={4} onChange={setMass} valueLabel={`${mass} kg`} /></div>
  </LabShell>;
}

function VectorLab({ onAnswered }) {
  const reduceMotion = useReducedMotion();
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const magnitude = Math.hypot(x, y);
  const complete = Math.abs(magnitude - 5) < .08;
  const endX = 36 + x * 36;
  const endY = 188 - y * 30;
  return <LabShell title="Vector composer" instruction="Build any vector with magnitude 5. Change its components and watch geometry calculate the length." status={`length ${magnitude.toFixed(2)}`} complete={complete} insight="Length = √(x² + y²). A 3-4-5 triangle does it." onComplete={() => { playCorrect(); onAnswered(true); }}>
    <div className="grid gap-6 sm:grid-cols-[1.15fr_.85fr]">
      <div className={`p-2 ${canvas}`}><svg viewBox="0 0 250 210" className="w-full" role="img" aria-label="Vector component diagram"><line x1="36" y1="188" x2="230" y2="188" stroke="var(--muted)" strokeOpacity=".4" strokeWidth="1.5"/><line x1="36" y1="188" x2="36" y2="15" stroke="var(--muted)" strokeOpacity=".4" strokeWidth="1.5"/><motion.path animate={{ d: `M36 188H${endX}V${endY}` }} fill="none" stroke="#1CA8F0" strokeWidth="2" strokeDasharray="5 5"/><motion.line x1="36" y1="188" animate={{ x2: endX, y2: endY }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 20 }} stroke="#A46CF7" strokeWidth="6" strokeLinecap="round"/><motion.circle animate={{ cx: endX, cy: endY }} r="8" fill="#4CC417" stroke="#fff" strokeWidth="3"/></svg></div>
      <div className="flex flex-col justify-center gap-6"><Range label="x component" value={x} min={0} max={5} step={1} onChange={setX} /><Range label="y component" value={y} min={0} max={5} step={1} onChange={setY} /><div className="rounded-2xl border-2 hairline p-3 text-center"><p className="font-display text-3xl font-extrabold text-violet-dark dark:text-violet">{magnitude.toFixed(2)}</p><p className="eyebrow muted !text-[11px]">vector length</p></div></div>
    </div>
  </LabShell>;
}

function ProbabilityLab({ onAnswered }) {
  const reduceMotion = useReducedMotion();
  const [trials, setTrials] = useState([]);
  const sequence = useMemo(() => [true, false, false, true, false, true, false, false, true, false, false, true, false, true, false, false, true, false, true, false, false, true, false, false, true, false, true, false, false, true], []);
  const gold = trials.filter(Boolean).length;
  const complete = trials.length >= 20;
  function sample() { setTrials((current) => [...current, ...sequence.slice(current.length, Math.min(current.length + 5, sequence.length))]); }
  return <LabShell title="Chance sampler" instruction="Draw batches from a hidden distribution. Watch the estimate stabilize as evidence accumulates." status={`${trials.length}/20 samples`} complete={complete} insight="More samples, steadier estimate: about 40% gold." onComplete={() => { playCorrect(); onAnswered(true); }}>
    <div className={`p-4 ${canvas}`}><div className="flex min-h-36 flex-wrap content-start gap-2">{trials.map((isGold, index) => <motion.span key={index} initial={{ scale: reduceMotion ? 1 : 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`h-8 w-8 rounded-lg ${isGold ? "bg-gold shadow-[0_3px_0_#D99400]" : "bg-sky shadow-[0_3px_0_#1286C4]"}`} />)}{!trials.length && <p className="muted m-auto text-sm font-bold">Your sample field is empty</p>}</div></div>
    <div className="mt-5 flex items-center justify-between gap-4"><div><p className="font-display text-3xl font-extrabold">{trials.length ? Math.round(gold / trials.length * 100) : 0}%</p><p className="eyebrow muted !text-[11px]">observed gold</p></div><button type="button" disabled={trials.length >= sequence.length} onClick={sample} className="sky-button btn-sm">Draw 5 samples</button></div>
  </LabShell>;
}

export default function ExplorableLab({ question, onAnswered }) {
  if (question.lab === "force") return <ForceLab onAnswered={onAnswered} />;
  if (question.lab === "vector") return <VectorLab onAnswered={onAnswered} />;
  if (question.lab === "probability") return <ProbabilityLab onAnswered={onAnswered} />;
  return <CurveLab onAnswered={onAnswered} />;
}
