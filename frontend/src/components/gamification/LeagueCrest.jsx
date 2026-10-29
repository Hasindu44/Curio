import { useId } from "react";

// Flat league badges: a two-tone face, a darker lower edge for depth and a light
// emblem. The silhouette grows grander up the ladder: shields (Bronze–Gold), cut
// gems (Sapphire–Emerald), winged crests (Amethyst–Obsidian), crowned Diamond.
const tiers = {
  bronze: { face: "#E0915A", shade: "#CD7F4E", edge: "#A35F33", mark: "#FFE2CC", shape: "shield", emblem: "chevron" },
  silver: { face: "#D4DDE4", shade: "#B8C5CF", edge: "#8F9DA8", mark: "#FFFFFF", shape: "shield", emblem: "double" },
  gold: { face: "#FFD23F", shade: "#FFC21A", edge: "#D99400", mark: "#FFF7D1", shape: "shield", emblem: "star" },
  sapphire: { face: "#3BB0FF", shade: "#1E9BF0", edge: "#1273C2", mark: "#E1F4FF", shape: "hex", emblem: "rhombus" },
  ruby: { face: "#FF5A6B", shade: "#F0384B", edge: "#B8202F", mark: "#FFE1E5", shape: "hex", emblem: "round" },
  emerald: { face: "#3EDB82", shade: "#2BC56B", edge: "#19924C", mark: "#DDFBEA", shape: "hex", emblem: "octagon" },
  amethyst: { face: "#B983FF", shade: "#A560F0", edge: "#7339C4", mark: "#F1E4FF", shape: "winged", emblem: "crystals" },
  pearl: { face: "#FCDCEA", shade: "#F2B8D2", edge: "#C98AA8", mark: "#FFFFFF", shape: "winged", emblem: "pearl" },
  obsidian: { face: "#555C78", shade: "#3A3F55", edge: "#22253A", mark: "#C9BAFF", shape: "winged", emblem: "shard" },
  diamond: { face: "#86EEFF", shade: "#4FD8F0", edge: "#1FA7C4", mark: "#FFFFFF", shape: "crown", emblem: "brilliant" },
};
const lockedColors = { face: "#E1E6EA", shade: "#CDD4DA", edge: "#AAB4BC", mark: "#FFFFFF" };

const SHIELD = "M50 10 82 20v30c0 23-15 38-32 47C33 88 18 73 18 50V20l32-10Z";
const HEX = "M50 8 85 28v40L50 88 15 68V28L50 8Z";

function Emblem({ type, color }) {
  const solid = { fill: color };
  const line = { stroke: color, strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };
  switch (type) {
    case "chevron": return <path d="M37 56 50 44l13 12" {...line}/>;
    case "double": return <><path d="M37 50 50 39l13 11" {...line}/><path d="M37 64 50 53l13 11" {...line}/></>;
    case "star": return <path d="m50 33 5.6 11.4 12.6 1.8-9.1 8.9 2.1 12.5L50 61.7l-11.2 5.9 2.1-12.5-9.1-8.9 12.6-1.8L50 33Z" {...solid} strokeLinejoin="round"/>;
    case "rhombus": return <><path d="M50 32 66 48 50 66 34 48 50 32Z" {...solid}/><path d="M34 48h32M50 32l-6 16 6 18 6-18-6-16Z" stroke="#000" strokeOpacity=".12" strokeWidth="1.6" fill="none"/></>;
    case "round": return <><path d="M42 35h16l9 9v10l-9 9H42l-9-9V44l9-9Z" {...solid}/><path d="M42 35l4 9h8l4-9M33 44h34" stroke="#000" strokeOpacity=".12" strokeWidth="1.6" fill="none"/></>;
    case "octagon": return <><path d="M43 33h14l8 8v16l-8 8H43l-8-8V41l8-8Z" {...solid}/><path d="M45 39h10l4 4v12l-4 4H45l-4-4V43l4-4Z" stroke="#000" strokeOpacity=".12" strokeWidth="1.6" fill="none"/></>;
    case "crystals": return <><path d="M50 30 57 42v22H43V42l7-12Z" {...solid}/><path d="M38 44 43 52v12h-9V52l4-8ZM62 44l4 8v12h-9V52l5-8Z" {...solid} fillOpacity=".8"/></>;
    case "pearl": return <><circle cx="50" cy="50" r="15" {...solid}/><circle cx="45" cy="45" r="4.5" fill="#F2B8D2" fillOpacity=".6"/></>;
    case "shard": return <path d="M50 31 63 47 55 68H45L37 47 50 31Zm0 0v37M37 47h26" {...solid} stroke="#3A3F55" strokeOpacity=".35" strokeWidth="1.6" strokeLinejoin="round"/>;
    case "brilliant": return <><path d="M38 38h24l7 9-19 21-19-21 7-9Z" {...solid}/><path d="M31 47h38M44 38l-3 9 9 21 9-21-3-9" stroke="#1FA7C4" strokeOpacity=".45" strokeWidth="1.6" fill="none" strokeLinejoin="round"/></>;
    case "lock": return <><rect x="38" y="47" width="24" height="19" rx="5" {...solid}/><path d="M42.5 47v-5a7.5 7.5 0 0 1 15 0v5" {...line} strokeWidth="5"/><circle cx="50" cy="56" r="2.6" fill="#AAB4BC"/></>;
    default: return null;
  }
}

export default function LeagueCrest({ league, size = 92, animated = false, locked = false }) {
  const id = useId().replace(/:/g, "");
  const tier = tiers[league?.id] || tiers.bronze;
  const c = locked ? lockedColors : tier;
  const outline = tier.shape === "hex" || tier.shape === "crown" ? HEX : SHIELD;
  const winged = tier.shape === "winged" || tier.shape === "crown";
  return <svg width={size} height={size * 1.12} viewBox="0 0 100 112" fill="none" aria-hidden="true" className={animated ? "anim-float" : ""}>
    <defs><clipPath id={`${id}-clip`}><path d={outline}/></clipPath></defs>
    {winged && <g>
      <path d="M22 34C8 30 1 40 3 50c5-3 10-3 14-1-6 3-8 8-7 14 5-4 10-5 14-4-3 3-4 7-3 11 5-5 9-7 13-8L22 34Z" fill={c.edge}/>
      <path d="M22 32C8 28 1 38 3 48c5-3 10-3 14-1-6 3-8 8-7 14 5-4 10-5 14-4-3 3-4 7-3 11 5-5 9-7 13-8L22 32Z" fill={c.shade}/>
      <path d="M78 34c14-4 21 6 19 16-5-3-10-3-14-1 6 3 8 8 7 14-5-4-10-5-14-4 3 3 4 7 3 11-5-5-9-7-13-8l12-28Z" fill={c.edge}/>
      <path d="M78 32c14-4 21 6 19 16-5-3-10-3-14-1 6 3 8 8 7 14-5-4-10-5-14-4 3 3 4 7 3 11-5-5-9-7-13-8l12-28Z" fill={c.shade}/>
    </g>}
    {/* depth edge, face, and the darker right half */}
    <path d={outline} fill={c.edge} transform="translate(0 6)"/>
    <path d={outline} fill={c.face}/>
    <g clipPath={`url(#${id}-clip)`}>
      <rect x="50" y="0" width="50" height="112" fill={c.shade}/>
      <path d={outline} transform="translate(50 52) scale(.78) translate(-50 -48)" fill="#fff" fillOpacity=".14"/>
      {animated && !locked && <rect className="anim-shine" x="40" y="0" width="12" height="112" fill="#fff" fillOpacity=".45"/>}
    </g>
    <path d="M27 26c5-2 9-3.5 13-4.6" stroke="#fff" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round"/>
    <g transform="translate(0 2)"><Emblem type={locked ? "lock" : tier.emblem} color={c.mark}/></g>
    {tier.shape === "crown" && !locked && <g>
      <path d="m34 10 8 7 8-13 8 13 8-7-3 13H37l-3-13Z" fill="#D99400" transform="translate(0 3)"/>
      <path d="m34 10 8 7 8-13 8 13 8-7-3 13H37l-3-13Z" fill="#FFC800"/>
      <circle cx="50" cy="4" r="2.5" fill="#FFF3B0"/>
    </g>}
    {animated && !locked && <path className="anim-twinkle svg-part delay-1" d="M86 6 87.6 10.4 92 12 87.6 13.6 86 18 84.4 13.6 80 12 84.4 10.4Z" fill="#fff" stroke={c.shade} strokeWidth="1"/>}
  </svg>;
}
