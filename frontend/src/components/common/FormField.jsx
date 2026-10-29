import { cloneElement, useId } from "react";

// Wraps one input with its label, hint and error message, and wires up the
// matching aria attributes so screen readers announce the error.
export default function FormField({ label, error, hint, children, className = "" }) {
  const generatedId = useId();
  const id = children.props.id ?? generatedId;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const control = cloneElement(children, {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `${children.props.className ?? "field"} mt-2 ${error ? "is-invalid" : ""}`,
  });
  return <div className={className}>
    <label htmlFor={id} className="text-sm font-extrabold">{label}</label>
    {control}
    {hint && !error && <p id={`${id}-hint`} className="muted mt-1.5 text-xs font-bold">{hint}</p>}
    {error && <p id={`${id}-error`} className="field-error">{error}</p>}
  </div>;
}
