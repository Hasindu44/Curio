export default function CourseIcon({ course, size = 30 }) {
  const id = typeof course === "string" ? course : course?.id;
  const props = { width: size, height: size, viewBox: "0 0 36 36", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

  if (id === "calculus") return <svg {...props}><path d="M11 8h5c-3 0-4 2.7-4.7 6.2L8.8 26c-.5 2.5-1.7 4-4.8 4h-1"/><path d="M7 20h9M21 11c2.2-2.2 4.7-2.2 7 0s2.3 5 0 7l-7 7"/><path d="m22 24 6 1-1-6"/></svg>;
  if (id === "mechanics") return <svg {...props}><circle cx="18" cy="18" r="5"/><path d="M18 3v5m0 20v5M3 18h5m20 0h5M7.4 7.4l3.5 3.5m14.2 14.2 3.5 3.5M28.6 7.4l-3.5 3.5M10.9 25.1l-3.5 3.5"/></svg>;
  if (id === "algorithms") return <svg {...props}><circle cx="8" cy="9" r="3"/><circle cx="28" cy="9" r="3"/><circle cx="18" cy="28" r="3"/><path d="M10.8 10.4 16.5 25M25.2 10.4 19.5 25M11 9h14"/></svg>;
  if (id === "linear-algebra") return <svg {...props}><path d="M6 30V6m0 24h24"/><path d="m6 6-3 5m3-5 3 5m21 19-5-3m5 3-5 3"/><path d="m11 25 13-13m0 0-1 7m1-7-7 1"/></svg>;
  if (id === "probability") return <svg {...props}><rect x="6" y="6" width="24" height="24" rx="7"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="24" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="18" cy="18" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="24" r="1.5" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none"/></svg>;
  if (id === "chemistry") return <svg {...props}><circle cx="18" cy="18" r="2.4" fill="currentColor" stroke="none"/><ellipse cx="18" cy="18" rx="14" ry="6"/><ellipse cx="18" cy="18" rx="14" ry="6" transform="rotate(60 18 18)"/><ellipse cx="18" cy="18" rx="14" ry="6" transform="rotate(120 18 18)"/></svg>;
  return <svg {...props}><circle cx="18" cy="18" r="4"/><ellipse cx="18" cy="18" rx="14" ry="7" transform="rotate(-22 18 18)"/><path d="M27 5v6m-3-3h6"/></svg>;
}
