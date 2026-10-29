import { GemIcon } from "./StatusIcons";

export default function GemBadge({ gems = 0 }) {
  return (
    <div className="stat-pill text-[#E33B3B] dark:text-[#FF6B6B]" aria-label={`${gems.toLocaleString()} gems`}>
      <GemIcon size={26} />
      <span key={gems} className="anim-pop inline-block tabular-nums">{gems.toLocaleString()}</span>
    </div>
  );
}
