import { useState } from "react";

export default function CurvePlayground() {
  const [value, setValue] = useState(1.4);
  const x = 250 + value * 62;
  const y = 235 - value * value * 20;
  const slope = -40 * value / 62;
  const found = Math.abs(value) < .1;
  return <div className="relative mx-auto w-full max-w-[540px]">
    <div className="panel panel-raised overflow-hidden !rounded-[24px]">
      <div className="flex items-center justify-between border-b-2 hairline px-5 py-3 sm:px-6">
        <span className="flex items-center gap-2 text-sm font-extrabold"><span className="rounded-lg bg-gold px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-[#3B2A00]">Try it</span>Calculus · Level 1</span>
        <span className="muted font-mono text-xs font-bold">1 / 7</span>
      </div>
      <div className="px-5 pt-5 sm:px-6"><p className="font-display text-[24px] font-extrabold leading-tight">When does a curve stop falling?</p><p className="muted mt-1 text-[15px] font-semibold">Drag the slider. Watch the slope change.</p></div>
      <svg viewBox="0 0 500 290" className="mt-2 w-full" role="img" aria-label={`A parabola with a tangent at x = ${value.toFixed(1)}. Slope: ${(2 * value).toFixed(1)}.`}>
        <defs><pattern id="landing-grid" width="31" height="30" patternUnits="userSpaceOnUse"><path d="M31 0H0V30" fill="none" stroke="var(--line)" strokeWidth="1"/></pattern><linearGradient id="curve-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#4CC417" stopOpacity=".2"/><stop offset="1" stopColor="#4CC417" stopOpacity="0"/></linearGradient></defs>
        <rect x="32" y="20" width="436" height="248" fill="url(#landing-grid)" rx="12"/>
        <path d="M45 235H457M250 34V263" stroke="var(--muted)" strokeOpacity=".35" strokeWidth="1.5"/>
        <path d="M64 55Q250 415 436 55V235H64Z" fill="url(#curve-area)"/>
        <path d="M64 55Q250 415 436 55" fill="none" stroke="#4CC417" strokeWidth="5" strokeLinecap="round"/>
        <text x="404" y="40" fill="var(--muted)" fontFamily="JetBrains Mono, monospace" fontSize="14" fontWeight="700">y = x²</text>
        {[-2, -1, 1, 2].map(n => <text key={n} x={250 + n * 62} y="256" textAnchor="middle" fill="var(--muted)" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">{n}</text>)}
        <line x1={x - 65} y1={y - 65 * slope} x2={x + 65} y2={y + 65 * slope} stroke="#FFB81F" strokeWidth="4" strokeLinecap="round"/>
        <line x1={x} y1={y} x2={x} y2="235" stroke="#4CC417" strokeDasharray="3 5" strokeWidth="2" opacity=".5"/>
        <circle cx={x} cy={y} r="17" fill="#4CC417" fillOpacity=".18"/>
        <circle cx={x} cy={y} r="8" fill="#4CC417" stroke="var(--surface)" strokeWidth="3"/>
      </svg>
      <div className="px-5 pb-5 sm:px-6">
        <div className="flex items-center justify-between gap-2 text-sm font-extrabold"><label htmlFor="curve-point">Move the point</label><output htmlFor="curve-point" className="rounded-lg bg-leaf-soft px-2 py-0.5 font-mono text-leaf-deep dark:text-leaf-light">slope = {(value * 2).toFixed(1)}</output></div>
        <input id="curve-point" aria-label="Position on the curve" type="range" min="-2.6" max="2.6" step=".1" value={value} onChange={event => setValue(Number(event.target.value))} className="lab-range mt-3"/>
      </div>
      <div className={`flex items-center gap-3 border-t-2 px-5 py-4 transition-colors sm:px-6 ${found ? "border-leaf/30 bg-leaf-soft" : "hairline bg-[var(--surface-soft)]"}`} aria-live="polite">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${found ? "bg-leaf text-white" : "bg-[var(--surface)] text-gold-dark"}`}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={found ? "m5 12 4 4L19 6" : "M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z"}/></svg></span>
        <div><p className={`font-display text-lg font-extrabold leading-tight ${found ? "text-leaf-deep dark:text-leaf-light" : ""}`}>{found ? "That’s the turning point!" : "Find where the slope is zero."}</p><p className="muted text-sm font-semibold">{found ? "At x = 0, the curve stops falling and starts rising." : "A little experiment. A big idea."}</p></div>
      </div>
    </div>
  </div>;
}
