import { useEffect, useState } from "react";
import { HeartIcon } from "./StatusIcons";

export default function HeartsDisplay({ hearts, maxHearts }) {
  const [secondsLeft, setSecondsLeft] = useState(222);

  useEffect(() => {
    if (hearts >= maxHearts) return undefined;
    setSecondsLeft(222);
    const timer = setInterval(() => setSecondsLeft((seconds) => (seconds > 0 ? seconds - 1 : 222)), 1000);
    return () => clearInterval(timer);
  }, [hearts, maxHearts]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="stat-pill group relative text-[#E33B3B] dark:text-[#FF6B6B]" aria-label={`${hearts} of ${maxHearts} hearts remaining`}>
      <HeartIcon size={26} empty={hearts === 0} />
      <span key={hearts} className="anim-pop inline-block tabular-nums">{hearts}</span>
      {hearts < maxHearts && <span className="pointer-events-none absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded-xl border-2 hairline bg-[var(--surface)] px-2.5 py-1.5 font-body text-[11px] font-extrabold opacity-0 transition-opacity group-hover:opacity-100">Next heart in {minutes}:{seconds}</span>}
    </div>
  );
}
