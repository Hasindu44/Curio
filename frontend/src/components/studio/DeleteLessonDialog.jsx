import { useState } from "react";
import { deleteLesson } from "../../api/studio";
import { errorMessage } from "../../api/client";
import ConfirmDialog from "../common/ConfirmDialog";

// Confirms before deleting. Learners' attempts and progress for the lesson
// are removed with it, so the dialog says so.
export default function DeleteLessonDialog({ lesson, onDeleted, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      const result = await deleteLesson(lesson._id);
      onDeleted(result);
    } catch (err) {
      setError(errorMessage(err, "We couldn’t delete this lesson. Please try again."));
      setBusy(false);
    }
  }

  return <ConfirmDialog title="Delete lesson?" confirmLabel="Delete lesson" busy={busy} error={error} onConfirm={confirm} onCancel={onCancel}>
    <p>You’re about to permanently delete <strong>“{lesson.title}”</strong>.</p>
    <p className="muted mt-2 text-sm">Learners’ attempts and progress for this lesson will also be removed. This can’t be undone.</p>
  </ConfirmDialog>;
}
