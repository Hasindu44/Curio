export default function SpeechBubble({ children, className = "", tail = "left" }) {
  return (
    <div className={`relative rounded-2xl border-2 hairline bg-[var(--surface)] px-4 py-3 text-[15px] font-bold leading-snug text-[var(--text)] ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 border-b-2 border-l-2 hairline bg-[var(--surface)] ${tail === "right" ? "-right-[9px] rotate-[225deg]" : "-left-[9px] rotate-45"}`}
      />
    </div>
  );
}
