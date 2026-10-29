import { useId } from "react";

// Glossy, layered status icons. Pass `still` to freeze an icon (e.g. in dense lists).
function useIds(...names) {
  const base = useId().replace(/:/g, "");
  return Object.fromEntries(names.map(name => [name, `${base}-${name}`]));
}
const live = (still, cls) => (still ? "" : cls);

// Flat, chunky style: solid fills, a darker shaded side for depth and a white
// highlight. No gradients, so icons stay crisp at 16px.
export function FlameIcon({ size = 28, className = "", active = true, still = false }) {
  const [outer, shade, inner, core] = active ? ["#FF9600", "#F07800", "#FFC800", "#FFF3B0"] : ["#CDD3D8", "#B4BCC3", "#E3E7EA", "#F4F6F7"];
  const animate = !still && active;
  return <svg width={size} height={size} viewBox="0 0 32 36" fill="none" className={className} aria-hidden="true">
    {animate && <>
      <circle className="anim-ember" cx="7" cy="13" r="1.8" fill="#FFC800"/>
      <circle className="anim-ember delay-2" cx="26" cy="10" r="1.4" fill="#FF9600"/>
    </>}
    <g className={animate ? "anim-flicker origin-bottom-part" : ""}>
      <path d="M16 35C8.3 35 3.5 30 3.5 23.3c0-5 2.4-8.2 4.9-11.4.6 2.6 1.9 4.4 3.6 5.2C11.7 10.9 14.4 5.4 19.6 1.5c.3 4.6 2.4 7.6 4.9 10.6 2.3 2.8 4 5.9 4 10.6C28.5 30 23.7 35 16 35Z" fill={outer}/>
      <path d="M16 35c7.7 0 12.5-5 12.5-12.3 0-3.5-1-6.1-2.5-8.4.3 7.6-3.9 14.6-12 16.4 2.6 1.6 6.2 1.5 7.8.3C20.4 33.6 18.4 35 16 35Z" fill={shade}/>
      <path d="M8.6 22.4c.2-2.8 1.3-4.8 2.6-6.8" stroke="#fff" strokeOpacity=".7" strokeWidth="2.4" strokeLinecap="round"/>
    </g>
    <g className={animate ? "anim-flicker origin-bottom-part delay-1" : ""}>
      <path d="M16 32.5c-3.9 0-6.4-2.6-6.4-6 0-2.9 1.6-4.9 3.6-7 .5 1.9 1.4 3 2.6 3.6.2-2.7 1.5-5.1 3.6-6.8.2 2.4 1.3 4.1 2.4 5.5 1 1.3 1.6 2.6 1.6 4.6 0 3.5-2.9 6.1-7.4 6.1Z" fill={inner}/>
      <ellipse cx="16" cy="28" rx="2.6" ry="3.2" fill={core}/>
    </g>
  </svg>;
}

export function GemIcon({ size = 28, className = "", still = false }) {
  const id = useIds("clip");
  const shape = "M9 4h16l7 8.5L17 31 2 12.5 9 4Z";
  return <svg width={size} height={size} viewBox="0 0 34 33" fill="none" className={className} aria-hidden="true">
    <defs><clipPath id={id.clip}><path d={shape}/></clipPath></defs>
    <path d={shape} fill="#FF4B4B"/>
    <path d="M2 12.5h30L17 31 2 12.5Z" fill="#E33B3B"/>
    <path d="M11 12.5h12L17 31l-6-18.5Z" fill="#FF6B6B"/>
    <path d="M9 4h8l-6 8.5H2L9 4Z" fill="#FF8E8E"/>
    <path d="M17 4h8l7 8.5h-9L17 4Z" fill="#FF6464"/>
    <path d="m11 12.5 6-8.5 6 8.5H11Z" fill="#FFB0B0"/>
    <path d="M6.2 9.2 9.6 5.3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
    <g clipPath={`url(#${id.clip})`}><rect className={still ? "" : "anim-shine"} x="13" y="-2" width="5" height="36" fill="#fff" fillOpacity=".55"/></g>
    {!still && <path className="anim-twinkle svg-part delay-2" d="M30 .5 31 3.5 34 4.5 31 5.5 30 8.5 29 5.5 26 4.5 29 3.5Z" fill="#fff" stroke="#FFB0B0" strokeWidth=".8"/>}
  </svg>;
}

export function XPIcon({ size = 29, className = "", still = false }) {
  return <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className={className} aria-hidden="true">
    <g className={still ? "" : "anim-zap svg-part"}>
      <path d="M20.5 2 6 19.5h9.2L12.6 32 28 13.6h-9.4L20.5 2Z" fill="#E59400" transform="translate(1 1.6)"/>
      <path d="M20.5 2 6 19.5h9.2L12.6 32 28 13.6h-9.4L20.5 2Z" fill="#FFC800"/>
      <path d="M18.6 13.6H28L12.6 32l2.6-12.5" fill="#FFB100"/>
      <path d="m17.6 6.6-6.5 8" stroke="#FFF5C2" strokeWidth="2.4" strokeLinecap="round"/>
    </g>
  </svg>;
}

export function HeartIcon({ size = 29, className = "", empty = false, still = false }) {
  const [face, shade] = empty ? ["#D5DBE0", "#BCC4CB"] : ["#FF4B4B", "#E33B3B"];
  const shape = "M17 30.5C14.2 28.6 2.5 21.3 2.5 12.4 2.5 7.2 6 3.5 10.6 3.5c2.9 0 5 1.4 6.4 3.6 1.4-2.2 3.5-3.6 6.4-3.6 4.6 0 8.1 3.7 8.1 8.9 0 8.9-11.7 16.2-14.5 18.1Z";
  return <svg width={size} height={size} viewBox="0 0 34 33" fill="none" className={className} aria-hidden="true">
    <g className={still || empty ? "" : "anim-heartbeat svg-part"}>
      <path d={shape} fill={face}/>
      <path d="M31.5 12.4c0 8.9-11.7 16.2-14.5 18.1-1.4-1-5-3.3-8.3-6.6 9 4.2 19.8-1.3 22-11.4.5-.1.8-.1.8-.1Z" fill={shade}/>
      <path d="M7.2 9.4c.6-1.6 1.9-2.6 3.6-2.6" stroke="#fff" strokeOpacity={empty ? .6 : .9} strokeWidth="2.6" strokeLinecap="round"/>
    </g>
  </svg>;
}

export function TrophyIcon({ size = 40, className = "", locked = false, still = false }) {
  const id = useIds("cup", "clip");
  const [top, bottom, edge] = locked ? ["#E4E8EB", "#B9C1C8", "#8E98A1"] : ["#FFE173", "#FFB21F", "#C98000"];
  const cup = "M11 5h18v9.5a9 9 0 0 1-18 0V5Z";
  return <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id={id.cup} x1="12" y1="4" x2="28" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor={top}/><stop offset="1" stopColor={bottom}/></linearGradient>
      <clipPath id={id.clip}><path d={cup}/></clipPath>
    </defs>
    <path d="M11 8H6.5c0 5.5 2.4 8.4 6.2 8.6M29 8h4.5c0 5.5-2.4 8.4-6.2 8.6" stroke={edge} strokeWidth="3" strokeLinecap="round"/>
    <path d="M17 23h6l1 6h-8l1-6Z" fill={edge}/>
    <rect x="11" y="29" width="18" height="6" rx="2.5" fill={edge}/>
    <rect x="13" y="30.5" width="14" height="2" rx="1" fill="#fff" fillOpacity=".35"/>
    <path d={cup} fill={`url(#${id.cup})`} stroke={edge} strokeWidth="1.6"/>
    <path d="m20 8.5 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5L20 8.5Z" fill="#fff" fillOpacity={locked ? .6 : .95}/>
    {!locked && <g clipPath={`url(#${id.clip})`}><rect className={live(still, "anim-shine")} x="17" y="0" width="5" height="30" fill="#fff" fillOpacity=".55"/></g>}
    {!locked && !still && <>
      <path className="anim-twinkle svg-part" d="M34 2 35 5 38 6 35 7 34 10 33 7 30 6 33 5Z" fill="#FFE173"/>
      <path className="anim-twinkle svg-part delay-3" d="M6 20 6.7 22 8.7 22.7 6.7 23.4 6 25.4 5.3 23.4 3.3 22.7 5.3 22Z" fill="#FFE173"/>
    </>}
  </svg>;
}

// Achievement medal: ribbon, hexagon face and a symbol in the middle.
export function MedalIcon({ size = 56, face = "#FFB81F", edge = "#C98000", symbol = "★", still = false }) {
  const id = useIds("face", "clip");
  const hex = "M28 10 44 19v18L28 46 12 37V19L28 10Z";
  return <span className="relative inline-flex shrink-0" style={{ width: size, height: size * 1.1 }}>
    <svg width={size} height={size * 1.1} viewBox="0 0 56 62" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id.face} x1="16" y1="10" x2="40" y2="46" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" stopOpacity=".45"/><stop offset=".4" stopColor="#fff" stopOpacity="0"/></linearGradient>
        <clipPath id={id.clip}><path d={hex}/></clipPath>
      </defs>
      <path d="M18 40 12 60l8-4 5 6 4-16M38 40l6 20-8-4-5 6-4-16" fill={edge}/>
      <path d={hex} fill={edge} transform="translate(0 3)"/>
      <path d={hex} fill={face} stroke={edge} strokeWidth="2"/>
      <path d="M28 15 39.5 21.5v13L28 41 16.5 34.5v-13L28 15Z" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5"/>
      <path d={hex} fill={`url(#${id.face})`}/>
      <g clipPath={`url(#${id.clip})`}><rect className={still ? "" : "anim-shine"} x="24" y="0" width="7" height="56" fill="#fff" fillOpacity=".45"/></g>
    </svg>
    <span className="absolute inset-x-0 top-[16%] flex h-[58%] items-center justify-center font-display font-extrabold leading-none text-white drop-shadow-[0_2px_0_rgba(0,0,0,.2)]" style={{ fontSize: size * .4 }}>{symbol}</span>
  </span>;
}
