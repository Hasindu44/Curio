import { useId } from "react";

// "Pip": Curio's original robot buddy. A rounded green body, a glowing face
// screen that carries every expression, a spark-bulb antenna and posable arms.
// Moods: happy (waves), excited (arms up), sad, thinking. animated={false} = still.
const C = {
  body: "#4CC417", shade: "#3A9A0F", deep: "#2B7A08", light: "#8BE356",
  screen: "#16303A", glow: "#8AF7FF", cheek: "#FF8FAB", bulb: "#FFC800", bulbShade: "#E59400",
};

// Arms hang from the body's edge and are drawn in front of it, so raised poses read clearly.
function Arm({ side, angle, wave, animated }) {
  const [px, py] = side === "left" ? [22, 76] : [98, 76];
  return <g transform={`rotate(${angle} ${px} ${py})`}>
    <g className={wave && animated ? "anim-wave" : ""} style={{ transformBox: "view-box", transformOrigin: `${px}px ${py}px` }}>
      <rect x={px - 7.5} y={py - 6} width="15" height="30" rx="7.5" fill={C.body} stroke={C.deep} strokeWidth="2.5"/>
      <rect x={px - 3.5} y={py - 1} width="4" height="13" rx="2" fill={C.light} fillOpacity=".7"/>
    </g>
  </g>;
}

function Face({ mood, animated }) {
  const g = C.glow;
  if (mood === "excited") return <g>
    <path d="M40 61Q47 49 54 61M66 61Q73 49 80 61" stroke={g} strokeWidth="4.5" strokeLinecap="round" fill="none"/>
    <path d="M51 67h18q0 10.5-9 10.5T51 67Z" fill={g}/>
    <path d="M55 74.2q5-3 10 0-1.8 3.3-5 3.3t-5-3.3Z" fill={C.cheek}/>
  </g>;
  const eyes = mood === "sad"
    ? { y: 62, rx: 5.5, ry: 6.5, dx: 0 }
    : mood === "thinking" ? { y: 56, rx: 5.5, ry: 7.5, dx: 3 } : { y: 59, rx: 6, ry: 8.5, dx: 0 };
  return <g>
    <g className={animated ? "anim-blink" : ""} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <ellipse cx={47 + eyes.dx} cy={eyes.y} rx={eyes.rx} ry={eyes.ry} fill={g}/>
      <ellipse cx={73 + eyes.dx} cy={eyes.y} rx={eyes.rx} ry={eyes.ry} fill={g}/>
      <circle cx={49.5 + eyes.dx} cy={eyes.y - 3.5} r="2.2" fill="#fff"/>
      <circle cx={75.5 + eyes.dx} cy={eyes.y - 3.5} r="2.2" fill="#fff"/>
    </g>
    {mood === "sad" && <>
      <path d="M38 52 57 59V49H38Z" fill={C.screen}/>
      <path d="M82 52 63 59V49H82Z" fill={C.screen}/>
      <path d="M54 75q6-5 12 0" stroke={g} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M40.5 69c0 2.4 1.4 4 3 4s3-1.6 3-4c0-2-3-5.5-3-5.5s-3 3.5-3 5.5Z" fill={g} fillOpacity=".8"/>
    </>}
    {mood === "thinking" && <path d="M54 72q3-2.5 6 0t6 0" stroke={g} strokeWidth="3.2" strokeLinecap="round" fill="none"/>}
    {mood !== "sad" && mood !== "thinking" && <path d="M53.5 70q6.5 6 13 0" stroke={g} strokeWidth="3.5" strokeLinecap="round" fill="none"/>}
  </g>;
}

export default function Mascot({ mood = "happy", size = 80, className = "", animated = true }) {
  const id = useId().replace(/:/g, "");
  const arms = { happy: [22, -150], excited: [150, -150], sad: [8, -8], thinking: [22, -22] }[mood] || [22, -22];
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs><clipPath id={`${id}-body`}><rect x="18" y="24" width="84" height="76" rx="34"/></clipPath></defs>
      <ellipse cx="60" cy="114" rx="28" ry="4.5" fill="#000" opacity=".1"/>
      <rect x="36" y="100" width="19" height="12" rx="6" fill={C.deep}/>
      <rect x="65" y="100" width="19" height="12" rx="6" fill={C.deep}/>
      <g className={animated ? "anim-breathe origin-bottom-part" : ""}>
        {/* antenna with a glowing spark bulb */}
        <g className={animated ? "anim-wobble" : ""} style={{ transformBox: "fill-box", transformOrigin: "20% 100%" }}>
          <path d="M60 27c0-6 2-11 6-15" stroke={C.deep} strokeWidth="4.5" strokeLinecap="round" fill="none"/>
          <circle className={animated ? "anim-glow svg-part" : ""} cx="67" cy="10" r="10" fill={C.bulb} opacity=".35"/>
          <circle cx="67" cy="10" r="6.5" fill={C.bulb}/>
          <path d="M73.2 11.5a6.5 6.5 0 0 1-10.6 3.1" stroke={C.bulbShade} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <circle cx="65" cy="8" r="1.8" fill="#fff"/>
        </g>
        {/* ear knobs */}
        <rect x="11" y="46" width="11" height="24" rx="5.5" fill={C.deep}/>
        <rect x="98" y="46" width="11" height="24" rx="5.5" fill={C.deep}/>
        {/* body: depth edge, face colour, side shading and a highlight */}
        <rect x="18" y="24" width="84" height="82" rx="34" fill={C.deep}/>
        <rect x="18" y="24" width="84" height="76" rx="34" fill={C.body}/>
        <g clipPath={`url(#${id}-body)`}><path d="M86 18c16 22 20 58-4 86h30V18Z" fill={C.shade}/></g>
        <path d="M33 40c4-7 10-10.5 18-11.5" stroke="#fff" strokeOpacity=".4" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <Arm side="left" angle={arms[0]} animated={animated}/>
        <Arm side="right" angle={arms[1]} wave={mood === "happy"} animated={animated}/>
        {/* face screen */}
        <rect x="27" y="37" width="66" height="48" rx="21" fill={C.deep}/>
        <rect x="30.5" y="40.5" width="59" height="41" rx="18" fill={C.screen}/>
        <path d="M37 50c1.5-3.5 4.5-5.5 9-6" stroke="#fff" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <Face mood={mood} animated={animated}/>
        {/* cheeks and chest light */}
        {mood !== "sad" && <>
          <ellipse cx="29" cy="90" rx="5" ry="3" fill={C.cheek} opacity=".75"/>
          <ellipse cx="91" cy="90" rx="5" ry="3" fill={C.cheek} opacity=".75"/>
        </>}
        <circle cx="60" cy="93" r="4.5" fill={C.deep}/>
        <circle cx="60" cy="92.4" r="3" fill={mood === "sad" ? "#9AA5AE" : C.bulb}/>
      </g>
    </svg>
  );
}
