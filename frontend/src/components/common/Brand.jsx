import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

// Change the product name here; every visible mention reads from this constant.
export const BRAND = "Curio";
const WORD = BRAND.toLowerCase();

const C_ARC = "M41 21.6A13 13 0 1 0 41 38.4";
const SPARK = "M46 21Q47 28.5 54 30Q47 31.5 46 39Q45 31.5 38 30Q45 28.5 46 21Z";

// A four-point "curiosity spark": the brand's accent shape.
export function Spark({ className = "", style }) {
  return <svg viewBox="0 0 20 20" className={className} style={style} aria-hidden="true"><path d="M10 0Q11 8 20 10Q11 12 10 20Q9 12 0 10Q9 8 10 0Z" fill="#FFC21A" stroke="#E09A00" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
}

// Squircle tile with a 3D lower edge, a "C" for Curio and a spark in its mouth.
export function LogoMark({ size = 44, animated = false, className = "" }) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const play = animated && !reduced;
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-tile`} x1="10" y1="4" x2="54" y2="56" gradientUnits="userSpaceOnUse"><stop stopColor="#6FDB36"/><stop offset="1" stopColor="#3FB012"/></linearGradient>
    </defs>
    <motion.g initial={play ? { scale: 0, rotate: -18 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 380, damping: 16 }} style={{ transformOrigin: "32px 32px" }}>
      <rect x="4" y="8" width="56" height="54" rx="18" fill="#2F8A0B"/>
      <rect x="4" y="3" width="56" height="54" rx="18" fill={`url(#${id}-tile)`}/>
      <path d="M14 12c4-4 10-5 18-5" stroke="#fff" strokeOpacity=".35" strokeWidth="4" strokeLinecap="round"/>
    </motion.g>
    <motion.path d={C_ARC} stroke="#fff" strokeWidth="8.5" strokeLinecap="round" initial={play ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={{ delay: play ? .25 : 0, duration: play ? .6 : 0, ease: [.65, 0, .3, 1] }}/>
    <motion.g initial={play ? { scale: 0, rotate: -90 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ delay: play ? .75 : 0, type: "spring", stiffness: 420, damping: 12 }} style={{ transformOrigin: "46px 30px" }}>
      <g className={animated ? "anim-zap svg-part" : ""}><path d={SPARK} fill="#FFC21A" stroke="#E09A00" strokeWidth="1.6" strokeLinejoin="round"/></g>
    </motion.g>
  </svg>;
}

// "curıo" with the spark sitting where the dot of the i would be.
export function Wordmark({ className = "" }) {
  const [before, after] = [WORD.slice(0, WORD.indexOf("i")), WORD.slice(WORD.indexOf("i") + 1)];
  return <span className={`font-display font-extrabold tracking-[-.03em] text-leaf ${className}`} aria-label={BRAND} role="img">
    <span aria-hidden="true">{WORD.includes("i") ? <>{before}<span className="relative inline-block">ı<span className="absolute left-1/2 top-[.16em] w-[.36em] -translate-x-1/2"><Spark className="anim-zap block w-full"/></span></span>{after}</> : WORD}</span>
  </span>;
}

export function BrandLink({ size = 40, wordClass = "", className = "" }) {
  return <Link to="/" aria-label={`${BRAND} home`} className={`hop-on-hover flex items-center gap-2 ${className}`}>
    <span className="hop-target inline-flex"><LogoMark size={size}/></span>
    <Wordmark className={`brand-word text-[30px] ${wordClass}`}/>
  </Link>;
}

// Opening screen: the mark pops in, then the name fills up like a glass of water.
export default function BrandLoader({ label = "A little curiosity goes a long way" }) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const wave = "M0 18Q37.5 4 75 18T150 18T225 18T300 18T375 18T450 18T525 18T600 18V160H0Z";
  const text = { x: 160, y: 92, textAnchor: "middle", fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 104, letterSpacing: "-3" };
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: reduced ? 1 : 1.04 }} transition={{ duration: reduced ? 0 : .25 }} className="page-surface fixed inset-0 z-[100] flex flex-col items-center justify-center" role="status" aria-label="Preparing your learning space">
    <LogoMark size={92} animated/>
    <svg viewBox="0 0 320 120" className="mt-3 w-[min(78vw,300px)]" aria-hidden="true">
      <defs><clipPath id={`${id}-word`}><text {...text}>{WORD}</text></clipPath></defs>
      <text {...text} fill="var(--line)">{WORD}</text>
      <g clipPath={`url(#${id}-word)`}>
        <motion.g initial={{ y: reduced ? -40 : 112 }} animate={{ y: -40 }} transition={{ delay: reduced ? 0 : .5, duration: reduced ? 0 : 1.4, ease: [.45, 0, .25, 1] }}>
          <motion.path d={wave} fill="#7DDB4A" initial={{ x: -75 }} animate={{ x: reduced ? -75 : -225 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}/>
          <motion.path d={wave} fill="#4CC417" transform="translate(0 6)" initial={{ x: 0 }} animate={{ x: reduced ? 0 : -150 }} transition={{ duration: .8, repeat: Infinity, ease: "linear" }}/>
        </motion.g>
      </g>
    </svg>
    <motion.p initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 1.6, duration: reduced ? 0 : .35 }} className="muted -mt-1 text-sm font-bold">{label}</motion.p>
  </motion.div>;
}
