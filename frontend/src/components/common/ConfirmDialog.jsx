import Modal from "./Modal";

const noop = () => {};

// A Modal that asks before doing something destructive.
export default function ConfirmDialog({ title, children, confirmLabel = "Delete", busyLabel = "Deleting…", busy = false, error = "", confirmDisabled = false, onConfirm, onCancel }) {
  return <Modal title={title} onClose={busy ? noop : onCancel}>
    <div className="text-[15px] font-semibold leading-relaxed">{children}</div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-coral-soft px-4 py-3 text-sm font-bold text-coral-dark dark:text-coral">{error}</p>}
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button type="button" className="secondary-button" onClick={onCancel} disabled={busy}>Cancel</button>
      <button type="button" className="danger-button" onClick={onConfirm} disabled={busy || confirmDisabled}>{busy ? busyLabel : confirmLabel}</button>
    </div>
  </Modal>;
}
