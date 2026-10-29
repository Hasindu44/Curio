import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const modes = [
  { id: "math", label: "Calculus", color: "#FFB800" },
  { id: "physics", label: "Mechanics", color: "#2E9BF0" },
  { id: "code", label: "Algorithms", color: "#8C5CF5" },
];

function MathScene({ reduceMotion }) {
  return <svg viewBox="0 0 520 340" className="h-full w-full" role="img" aria-label="Animated calculus concept map">
    <defs><linearGradient id="mathGlow" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFB800"/><stop offset="1" stopColor="#F8544C"/></linearGradient><filter id="softGlow"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M42 275C130 270 145 75 245 168S376 278 482 72" fill="none" stroke="white" strokeOpacity=".07" strokeWidth="36" strokeLinecap="round"/>
    <motion.path d="M42 275C130 270 145 75 245 168S376 278 482 72" fill="none" stroke="url(#mathGlow)" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: "easeInOut" }}/>
    <motion.g animate={reduceMotion ? undefined : { offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M42 275C130 270 145 75 245 168S376 278 482 72')" }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}><circle r="8" fill="#3FC95A" stroke="white" strokeWidth="3" filter="url(#softGlow)"/></motion.g>
    {[{ x: 62, y: 73, title: "inner", value: "3x + 1" }, { x: 204, y: 36, title: "compose", value: "( · )⁴" }, { x: 358, y: 158, title: "rate", value: "12(3x+1)³" }].map((card, index) => <motion.g key={card.title} initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : .35 + index * .15 }}><rect x={card.x} y={card.y} width="115" height="62" rx="17" fill="#2a2f38" stroke="white" strokeOpacity=".12"/><text x={card.x + 14} y={card.y + 20} fill="white" fillOpacity=".36" fontSize="8" fontWeight="700" letterSpacing="1.5">{card.title.toUpperCase()}</text><text x={card.x + 14} y={card.y + 44} fill="white" fontSize="14" fontWeight="700">{card.value}</text></motion.g>)}
  </svg>;
}

function PhysicsScene({ reduceMotion }) {
  return <svg viewBox="0 0 520 340" className="h-full w-full" role="img" aria-label="Animated orbital mechanics model"><defs><radialGradient id="planet" cx="35%" cy="30%"><stop stopColor="#6fc2ff"/><stop offset="1" stopColor="#1E7FD1"/></radialGradient><filter id="blueGlow"><feGaussianBlur stdDeviation="10" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><ellipse cx="260" cy="174" rx="190" ry="88" fill="none" stroke="white" strokeOpacity=".09" strokeWidth="2"/><ellipse cx="260" cy="174" rx="122" ry="57" fill="none" stroke="#2E9BF0" strokeOpacity=".3" strokeDasharray="6 9"/>
    <circle cx="260" cy="174" r="54" fill="url(#planet)" filter="url(#blueGlow)"/><path d="M225 166c23-19 43-5 61-20 14 15 17 33 4 50-26-5-34 13-56 2-11-11-14-21-9-32Z" fill="#3FC95A" fillOpacity=".72"/>
    <motion.g animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "260px 174px" }}><circle cx="450" cy="174" r="14" fill="#FFB800"/><path d="M431 174h-45" stroke="#F8544C" strokeWidth="4" strokeLinecap="round"/><path d="m392 167-10 7 10 7" fill="none" stroke="#F8544C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></motion.g>
    <g><rect x="42" y="39" width="144" height="70" rx="18" fill="#2a2f38" stroke="white" strokeOpacity=".12"/><text x="58" y="62" fill="white" fillOpacity=".38" fontSize="8" fontWeight="700" letterSpacing="1.4">LIVE MODEL</text><text x="58" y="88" fill="white" fontSize="18" fontWeight="700">F = GMm/r²</text></g><g><rect x="347" y="251" width="130" height="54" rx="16" fill="#2a2f38" stroke="white" strokeOpacity=".12"/><circle cx="365" cy="278" r="5" fill="#3FC95A"/><text x="378" y="282" fill="white" fontSize="11" fontWeight="700">orbit stable</text></g>
  </svg>;
}

function CodeScene({ reduceMotion }) {
  const nodes = [{ x: 95, y: 82 }, { x: 214, y: 57 }, { x: 342, y: 99 }, { x: 145, y: 220 }, { x: 292, y: 245 }, { x: 430, y: 206 }];
  const edges = [[0,1],[1,2],[0,3],[1,3],[1,4],[2,4],[2,5],[3,4],[4,5]];
  return <svg viewBox="0 0 520 340" className="h-full w-full" role="img" aria-label="Animated graph traversal"><defs><filter id="violetGlow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>{edges.map(([a,b], index) => <motion.line key={index} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#8C5CF5" strokeOpacity=".24" strokeWidth="3" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ delay: reduceMotion ? 0 : index * .07, duration: .5 }}/>) }
    <motion.path d="M95 82 214 57 342 99 292 245 145 220" fill="none" stroke="#3FC95A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduceMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}/>
    {nodes.map((node, index) => <motion.g key={index} initial={{ scale: reduceMotion ? 1 : 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: reduceMotion ? 0 : .2 + index * .1 }} style={{ transformOrigin: `${node.x}px ${node.y}px` }}><circle cx={node.x} cy={node.y} r="23" fill="#292e37" stroke={index < 5 ? "#8C5CF5" : "white"} strokeOpacity={index < 5 ? 1 : .2} strokeWidth="3" filter={index === 4 ? "url(#violetGlow)" : undefined}/><text x={node.x} y={node.y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="800">{String.fromCharCode(65 + index)}</text></motion.g>)}
    <g><rect x="38" y="275" width="210" height="42" rx="14" fill="#2a2f38" stroke="white" strokeOpacity=".1"/><text x="55" y="301" fill="white" fontFamily="monospace" fontSize="11">BFS: A → B → C → E → D</text></g>
  </svg>;
}

export default function LearningUniverse() {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState("math");
  return (
    <div className="relative mx-auto w-full max-w-[580px]">
      <motion.div animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#20242b] shadow-[0_24px_70px_rgba(32,36,43,.24),0_10px_0_rgba(32,36,43,.12)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-coral"/><span className="h-2.5 w-2.5 rounded-full bg-gold"/><span className="h-2.5 w-2.5 rounded-full bg-leaf"/></div><span className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-white/30">concept engine · live</span></div>
        <div className="relative h-[320px] sm:h-[390px]"><div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:22px_22px]"/><AnimatePresence mode="wait"><motion.div key={mode} initial={{ opacity: 0, scale: reduceMotion ? 1 : .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }} transition={{ duration: reduceMotion ? .01 : .3 }} className="absolute inset-0">{mode === "math" ? <MathScene reduceMotion={reduceMotion} /> : mode === "physics" ? <PhysicsScene reduceMotion={reduceMotion} /> : <CodeScene reduceMotion={reduceMotion} />}</motion.div></AnimatePresence></div>
        <div className="grid grid-cols-3 gap-2 border-t border-white/10 p-3">{modes.map((item) => <button key={item.id} type="button" onClick={() => setMode(item.id)} className={`rounded-xl px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors ${mode === item.id ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"}`}><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</button>)}</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: reduceMotion ? 0 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : .8 }} className="absolute -right-3 top-20 hidden rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-xl sm:block"><p className="text-[9px] font-extrabold uppercase tracking-wider text-inkLight">Today</p><p className="mt-1 font-display text-sm font-extrabold text-ink">3 ideas connected</p></motion.div>
    </div>
  );
}
