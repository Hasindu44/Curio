import { XPIcon } from "./StatusIcons";

export default function XPBadge({ xp }) {
  return (
    <div className="stat-pill text-[#E59400] dark:text-[#FFC800]" aria-label={`${xp.toLocaleString()} total XP`}>
      <XPIcon size={26} />
      <span key={xp} className="anim-pop inline-block tabular-nums">{xp.toLocaleString()}</span>
    </div>
  );
}
