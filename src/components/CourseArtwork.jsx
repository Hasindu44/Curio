import { useId } from "react";

// Original, resolution-independent subject illustrations. No external assets.
export default function CourseArtwork({ course = "calculus", className = "" }) {
  const key = typeof course === "string" ? course : course.id;
  const id = useId().replace(/:/g, "");
  const palettes = {
    calculus: ["#FFB81F", "#FFF0C7", "#D99400"],
    mechanics: ["#1CA8F0", "#D6F1FF", "#1286C4"],
    algorithms: ["#A46CF7", "#EEE2FF", "#7F48D6"],
    "linear-algebra": ["#4CC417", "#DDF5CC", "#3A9A0F"],
    probability: ["#FF5A55", "#FFE0DE", "#E0403B"],
    chemistry: ["#14B8A6", "#D2F5F0", "#0F8C80"],
    astronomy: ["#5B6CF0", "#E2E5FF", "#3F4FD0"],
  };
  const [color, soft, edge] = palettes[key] || palettes.calculus;
  return <svg viewBox="0 0 300 200" fill="none" className={className} aria-hidden="true">
    <defs><linearGradient id={`${id}face`} x1="85" y1="30" x2="215" y2="170" gradientUnits="userSpaceOnUse"><stop stopColor={soft}/><stop offset="1" stopColor={color}/></linearGradient></defs>
    <circle cx="150" cy="100" r="82" fill={color} opacity=".1"/>
    <ellipse cx="150" cy="170" rx="72" ry="9" fill={edge} opacity=".09"/>
    {key === "calculus" && <>
      <path d="M65 149h169M81 155V43" stroke={edge} strokeOpacity=".25" strokeWidth="2" strokeLinecap="round"/>
      <path d="M86 143C115 140 116 77 148 88S187 139 216 51V149H86Z" fill={`url(#${id}face)`} opacity=".7"/>
      <path d="M86 143C115 140 116 77 148 88S187 139 216 51" stroke={edge} strokeWidth="5" strokeLinecap="round"/>
      <path d="m120 70 76 57" stroke="#22272B" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="157" cy="98" r="8" fill="white" stroke={color} strokeWidth="4"/>
      <rect x="196" y="28" width="42" height="32" rx="10" fill={color}/><text x="217" y="49" textAnchor="middle" fill="white" fontSize="18" fontFamily="serif" fontStyle="italic">f′</text>
    </>}
    {key === "mechanics" && <>
      <ellipse cx="151" cy="101" rx="84" ry="32" transform="rotate(-28 151 101)" stroke={color} strokeWidth="2" strokeDasharray="4 7"/>
      <ellipse cx="151" cy="101" rx="71" ry="57" transform="rotate(-28 151 101)" stroke={edge} strokeOpacity=".15" strokeWidth="2"/>
      <circle cx="151" cy="101" r="40" fill={edge}/><circle cx="148" cy="94" r="38" fill={`url(#${id}face)`}/>
      <path d="M125 77c9-11 20-14 30-12" stroke="white" strokeOpacity=".7" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="222" cy="68" r="13" fill="#FFB81F"/><path d="m75 66 17-3-4 16" stroke={edge} strokeWidth="3" strokeLinecap="round"/>
    </>}
    {key === "algorithms" && <>
      <path d="M150 59v32m-59 5h118M91 96v34m118-34v34M150 94v42" stroke={edge} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {[[127,24,46,38],[66,123,50,40],[125,123,50,40],[184,123,50,40]].map(([x,y,w,h],i)=><g key={x+"-"+y}><rect x={x} y={y+5} width={w} height={h} rx="12" fill={edge}/><rect x={x} y={y} width={w} height={h} rx="12" fill={i===0?color:`url(#${id}face)`}/></g>)}
      <path d="m143 38-6 5 6 5m14-10 6 5-6 5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="91" cy="144" r="5" fill="white"/><path d="m142 145 6 5 9-12m47 0v13m-6-6h12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </>}
    {key === "linear-algebra" && <>
      <path d="m76 139 75 29 77-72-75-30-77 73Z" fill={color} opacity=".13" stroke={edge} strokeWidth="2"/>
      <path d="m76 96 75 29 77-72-75-30-77 73Z" fill={`url(#${id}face)`} stroke={edge} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M76 96v43m75-14v43m77-115v43m-75-73v43" stroke={edge} strokeWidth="2" strokeDasharray="4 5"/>
      <path d="m112 85 75 29m-74-55 75 28m-99 39 77-72" stroke="white" strokeOpacity=".6" strokeWidth="1.5"/>
      <path d="m150 125 43-40m-16 3 16-3-4 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </>}
    {key === "probability" && <>
      <g transform="rotate(-15 127 107)"><rect x="75" y="61" width="97" height="101" rx="22" fill={edge}/><rect x="75" y="53" width="97" height="101" rx="22" fill={`url(#${id}face)`}/>{[[98,77],[148,77],[123,104],[98,130],[148,130]].map(([x,y])=><circle key={x+"-"+y} cx={x} cy={y} r="7" fill="white"/>)}</g>
      <circle cx="200" cy="102" r="32" fill="#D99400"/><circle cx="200" cy="96" r="32" fill="#FFB81F"/><circle cx="200" cy="96" r="23" stroke="#FFF0C7" strokeWidth="2"/><path d="m195 84 10 12-10 12" stroke="#FFF0C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </>}
    {key === "chemistry" && <>
      <path d="m116 78 74 17-45 49-29-66Z" stroke={edge} strokeWidth="10" strokeLinejoin="round"/>
      <path d="m116 74 74 17-45 49-29-66Z" stroke={soft} strokeWidth="5" strokeLinejoin="round"/>
      <circle cx="112" cy="69" r="29" fill={`url(#${id}face)`}/><circle cx="192" cy="92" r="24" fill="#1CA8F0"/><circle cx="145" cy="143" r="20" fill={edge}/>
      <path d="M98 58c3-6 8-9 15-9M181 84c2-4 5-6 9-6" stroke="white" strokeOpacity=".65" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="220" cy="44" r="4" fill={color}/>
    </>}
    {key === "astronomy" && <>
      <circle cx="151" cy="100" r="48" fill={edge}/><circle cx="147" cy="95" r="46" fill={`url(#${id}face)`}/>
      <path d="M107 73c23 8 48 8 71 0m-76 31c27 10 59 11 86 2m-73 21c20 5 39 6 56 3" stroke={soft} strokeOpacity=".5" strokeWidth="6"/>
      <path d="M112 74C54 96 62 132 127 132c71 0 144-54 75-64" stroke={color} strokeWidth="12" strokeLinecap="round"/>
      <path d="M112 71C54 93 62 129 127 129c71 0 144-54 75-64" stroke={soft} strokeWidth="5" strokeLinecap="round"/>
      <path d="m222 33 3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9Z" fill="#FFB81F"/>
    </>}
    <circle cx="60" cy="58" r="3" fill={color} opacity=".55"/><path d="M236 139v10m-5-5h10" stroke={color} strokeWidth="2" strokeLinecap="round" opacity=".55"/>
  </svg>;
}
