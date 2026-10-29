import { FlameIcon } from "./StatusIcons";

export default function StreakBadge({ streak }) {
  return (
    <div className={`stat-pill ${streak > 0 ? "text-[#F07800] dark:text-[#FF9600]" : "muted"}`} aria-label={`${streak} day streak`}>
      <FlameIcon size={26} active={streak > 0} />
      <span key={streak} className="anim-pop inline-block tabular-nums">{streak}</span>
    </div>
  );
}
