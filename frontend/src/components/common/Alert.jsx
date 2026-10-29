const tones = {
  error: "border-coral/40 bg-coral-soft text-coral-dark dark:text-coral",
  success: "border-leaf/40 bg-leaf-soft text-leaf-dark dark:text-leaf",
};

export default function Alert({ tone = "error", children, onDismiss }) {
  return <div role={tone === "error" ? "alert" : "status"} className={`flex items-start justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-bold ${tones[tone]}`}>
    <span>{children}</span>
    {onDismiss && <button type="button" onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss message">✕</button>}
  </div>;
}
