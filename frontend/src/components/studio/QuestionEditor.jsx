import FormField from "../common/FormField";
import { QUESTION_TYPES } from "../../lib/studio";

const MAX_OPTIONS = 6;
const MAX_STEPS = 8;

function ListEditor({ label, values, max, onChange, error, correctIndex, onCorrect, name }) {
  const update = (index, value) => onChange(values.map((item, i) => (i === index ? value : item)));
  const remove = (index) => onChange(values.filter((_, i) => i !== index), index);
  return <fieldset>
    <legend className="text-sm font-extrabold">{label}</legend>
    {onCorrect && <p className="muted mt-1 text-xs font-bold">Select the radio button next to the correct answer.</p>}
    <ol className="mt-2 grid gap-2">{values.map((value, index) => <li key={index} className="flex items-center gap-2">
      {onCorrect
        ? <input type="radio" name={name} checked={correctIndex === index} onChange={() => onCorrect(index)} className="h-5 w-5 shrink-0 accent-[#4cc417]" aria-label={`Mark option ${index + 1} as correct`}/>
        : <span className="muted w-5 shrink-0 text-center text-sm font-extrabold">{index + 1}</span>}
      <input value={value} onChange={(e) => update(index, e.target.value)} className={`field !py-2.5 !text-sm ${error && !value.trim() ? "is-invalid" : ""}`} aria-label={`${onCorrect ? "Option" : "Step"} ${index + 1}`} maxLength={200}/>
      <button type="button" onClick={() => remove(index)} disabled={values.length <= 2} className="icon-button shrink-0" aria-label={`Remove ${onCorrect ? "option" : "step"} ${index + 1}`}>✕</button>
    </li>)}</ol>
    {error && <p className="field-error">{error}</p>}
    {values.length < max && <button type="button" onClick={() => onChange([...values, ""])} className="mt-2 text-sm font-extrabold uppercase tracking-wider text-sky-dark dark:text-sky">+ Add {onCorrect ? "option" : "step"}</button>}
  </fieldset>;
}

// Keeps the correct answer pointing at the same option after one is removed.
function shiftCorrect(correctIndex, removed) {
  if (removed === undefined || correctIndex < removed) return correctIndex;
  return correctIndex === removed ? 0 : correctIndex - 1;
}

// Edits one question in place. Interactive/lab questions are built with
// code-based explorers, so only their prompt and explanation are editable.
export default function QuestionEditor({ question, index, count, errors, onChange, onMove, onRemove }) {
  const err = (field) => errors[`questions.${index}.${field}`];
  const set = (patch) => onChange({ ...question, ...patch });
  const builtIn = question.type === "interactive" || question.type === "lab";

  return <li className="panel p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-soft font-display text-sm font-extrabold text-sky-dark">{index + 1}</span><span className="eyebrow muted">{QUESTION_TYPES[question.type]}</span></p>
      <div className="flex items-center gap-1">
        <button type="button" className="icon-button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Move question ${index + 1} up`}>↑</button>
        <button type="button" className="icon-button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label={`Move question ${index + 1} down`}>↓</button>
        <button type="button" className="icon-button hover:!text-coral-dark" onClick={onRemove} aria-label={`Remove question ${index + 1}`}>✕</button>
      </div>
    </div>
    <div className="mt-3 grid gap-4">
      <FormField label="Prompt" error={err("prompt")} hint="Wrap maths in dollar signs, e.g. $x^2$">
        <textarea rows={2} value={question.prompt} onChange={(e) => set({ prompt: e.target.value })} maxLength={500} className="field resize-y"/>
      </FormField>
      {question.type === "mcq" && <ListEditor label="Answer options" name={`correct-${question.id}`} values={question.options} max={MAX_OPTIONS} error={err("options") || err("correctIndex")} correctIndex={question.correctIndex} onCorrect={(correctIndex) => set({ correctIndex })} onChange={(options, removed) => set({ options, correctIndex: shiftCorrect(question.correctIndex, removed) })}/>}
      {question.type === "numeric" && <FormField label="Correct answer" error={err("answer")} className="max-w-[220px]">
        <input type="number" step="any" inputMode="decimal" value={question.answer} onChange={(e) => set({ answer: e.target.value })}/>
      </FormField>}
      {question.type === "order" && <ListEditor label="Steps, in the correct order" values={question.items} max={MAX_STEPS} error={err("items")} onChange={(items) => set({ items })}/>}
      {builtIn && <p className="muted rounded-xl bg-[var(--surface-soft)] px-3 py-2 text-sm font-semibold">This step uses a built-in interactive explorer. Its content is kept as is.</p>}
      <FormField label="Explanation (optional)" error={err("explanation")} hint="Shown after the learner answers">
        <textarea rows={2} value={question.explanation} onChange={(e) => set({ explanation: e.target.value })} maxLength={600} className="field resize-y"/>
      </FormField>
    </div>
  </li>;
}
