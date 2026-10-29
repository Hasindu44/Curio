import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { errorMessage, fieldErrors } from "../../api/client";
import { createLesson, fetchLessonById, fetchStudioCourses, updateLesson } from "../../api/studio";
import Alert from "../../components/common/Alert";
import FormField from "../../components/common/FormField";
import Mascot from "../../components/common/Mascot";
import Navbar from "../../components/layout/Navbar";
import QuestionEditor from "../../components/studio/QuestionEditor";
import { DIFFICULTIES, emptyLesson, emptyQuestion, formToPayload, lessonToForm } from "../../lib/studio";
import { slugify, validateLesson } from "../../lib/validation";

// Create (/studio/lessons/new) and update (/studio/lessons/:id/edit) share
// this form.
export default function LessonEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const topRef = useRef(null);
  const [form, setForm] = useState(emptyLesson);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [fieldBanner, setFieldBanner] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // In create mode the slug follows the title until it is edited by hand.
  const [slugTouched, setSlugTouched] = useState(isEdit);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchStudioCourses(), isEdit ? fetchLessonById(id) : null])
      .then(([courseList, lesson]) => {
        if (!alive) return;
        setCourses(courseList);
        if (lesson) setForm(lessonToForm(lesson));
      })
      .catch((err) => { if (alive) setLoadError(err?.response?.status === 404 ? "This lesson doesn’t exist. It may have been deleted." : errorMessage(err)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, isEdit]);

  function set(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !slugTouched) next.slug = slugify(value);
      // Suggest the next free position when a course is picked for a new lesson.
      if (field === "course" && !isEdit) next.order = String((courses.find((c) => c._id === value)?.lessonCount ?? 0) + 1);
      return next;
    });
    setErrors((current) => {
      const cleared = field === "title" && !slugTouched ? ["title", "slug"] : [field];
      return cleared.some((key) => current[key]) ? { ...current, ...Object.fromEntries(cleared.map((key) => [key, undefined])) } : current;
    });
  }

  // A "fix N fields" banner goes away once every field error is resolved;
  // a general server error (no field errors) stays until the next submit.
  const remaining = Object.values(errors).filter(Boolean).length;
  const showFormError = formError && (remaining > 0 || !fieldBanner);

  const setQuestions = (update) => setForm((current) => ({ ...current, questions: update(current.questions) }));
  const addQuestion = (type) => { setQuestions((qs) => [...qs, emptyQuestion(type)]); setErrors((e) => ({ ...e, questions: undefined })); };
  const changeQuestion = (index, question) => {
    setQuestions((qs) => qs.map((q, i) => (i === index ? question : q)));
    const prefix = `questions.${index}.`;
    setErrors((current) => (Object.keys(current).some((key) => key.startsWith(prefix) && current[key])
      ? Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(prefix)))
      : current));
  };
  const removeQuestion = (index) => { setQuestions((qs) => qs.filter((_, i) => i !== index)); setErrors({}); };
  const moveQuestion = (index, delta) => { setQuestions((qs) => { const next = [...qs]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; return next; }); setErrors({}); };

  function showErrors(found, message) {
    setErrors(found);
    setFieldBanner(Object.keys(found).length > 0);
    setFormError(message);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validateLesson(form);
    if (Object.keys(found).length) return showErrors(found, `Please fix ${Object.keys(found).length} highlighted field${Object.keys(found).length === 1 ? "" : "s"}.`);
    setSaving(true);
    setFormError("");
    try {
      const payload = formToPayload(form);
      const saved = isEdit ? await updateLesson(id, payload) : await createLesson(payload);
      navigate(`/studio/lessons/${saved._id}`, { state: { flash: isEdit ? "Changes saved." : "Lesson created." } });
    } catch (err) {
      showErrors(fieldErrors(err), errorMessage(err, "We couldn’t save this lesson. Please try again."));
      setSaving(false);
    }
  }

  const cancelTo = isEdit ? `/studio/lessons/${id}` : "/studio";
  const input = (field, props = {}) => <input value={form[field]} onChange={(e) => set(field, e.target.value)} {...props}/>;

  return <div className="app-shell">
    <Navbar/>
    <main id="main-content" className="app-content">
      <div ref={topRef} className="scroll-mt-24">
        <Link to={cancelTo} className="eyebrow inline-flex items-center gap-1 text-sky-dark dark:text-sky">← {isEdit ? "Back to lesson" : "All lessons"}</Link>
        <h1 className="mt-2 font-display text-[32px] font-extrabold leading-tight">{isEdit ? "Edit lesson" : "New lesson"}</h1>
      </div>

      {loadError ? <section className="panel mx-auto mt-6 max-w-lg p-8 text-center"><Mascot mood="sad" size={88} className="mx-auto"/><p role="alert" className="mt-3 font-bold">{loadError}</p><Link to="/studio" className="primary-button btn-sm mt-6">Back to lessons</Link></section>
      : loading ? <div role="status" aria-label="Loading form" className="mt-6 animate-pulse"><div className="soft-surface h-72 rounded-[18px]"/></div>
      : <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-6">
        {showFormError && <Alert>{formError}</Alert>}

        <section className="panel grid gap-5 p-5 sm:p-6" aria-labelledby="basics-heading">
          <h2 id="basics-heading" className="font-display text-xl font-extrabold">Basics</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Title" error={errors.title}>{input("title", { maxLength: 80, placeholder: "e.g. Torque and levers" })}</FormField>
            <FormField label="URL slug" error={errors.slug} hint={form.slug ? `Learners open it at /lesson/${form.slug}` : "Generated from the title"}>
              <input value={form.slug} maxLength={60} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase()); }} placeholder="torque-and-levers"/>
            </FormField>
          </div>
          <FormField label="Summary (optional)" error={errors.summary} hint={`${form.summary.length}/240 characters`}>
            <textarea rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} maxLength={240} className="field resize-y" placeholder="One sentence about what the learner will discover"/>
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FormField label="Course" error={errors.course} className="sm:col-span-2">
              <select value={form.course} onChange={(e) => set("course", e.target.value)} className="field">
                <option value="">Choose a course…</option>
                {courses.map((course) => <option key={course._id} value={course._id}>{course.title}{course.published ? "" : " (hidden)"}</option>)}
              </select>
            </FormField>
            <FormField label="Position in course" error={errors.order}>{input("order", { type: "number", min: 1, max: 999, inputMode: "numeric" })}</FormField>
            <FormField label="Difficulty" error={errors.difficulty}>
              <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)} className="field">{DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select>
            </FormField>
            <FormField label="XP reward" error={errors.xp} hint="5 – 100">{input("xp", { type: "number", min: 5, max: 100, inputMode: "numeric" })}</FormField>
            <FormField label="Estimated minutes" error={errors.estimatedMinutes} hint="1 – 60">{input("estimatedMinutes", { type: "number", min: 1, max: 60, inputMode: "numeric" })}</FormField>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 hairline p-4">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#4cc417]"/>
            <span><span className="block font-extrabold">Published</span><span className="muted block text-sm font-semibold">Published lessons appear on learners’ paths. Drafts stay hidden as “coming soon”.</span></span>
          </label>
        </section>

        <section aria-labelledby="questions-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 id="questions-heading" className="font-display text-xl font-extrabold">Questions</h2><p className="muted text-sm font-semibold">{form.questions.length} of 20 · learners answer them in this order</p></div>
          </div>
          {errors.questions && <p className="field-error">{errors.questions}</p>}
          {form.questions.length > 0 && <ol className="mt-3 grid gap-4">{form.questions.map((question, index) => <QuestionEditor key={question.id} question={question} index={index} count={form.questions.length} errors={errors} onChange={(q) => changeQuestion(index, q)} onMove={(delta) => moveQuestion(index, delta)} onRemove={() => removeQuestion(index)}/>)}</ol>}
          {form.questions.length < 20 && <div className="mt-3 flex flex-wrap gap-2 rounded-2xl border-2 border-dashed hairline p-4">
            <span className="muted mr-1 self-center text-sm font-extrabold">Add:</span>
            <button type="button" className="secondary-button btn-sm" onClick={() => addQuestion("mcq")}>+ Multiple choice</button>
            <button type="button" className="secondary-button btn-sm" onClick={() => addQuestion("numeric")}>+ Number answer</button>
            <button type="button" className="secondary-button btn-sm" onClick={() => addQuestion("order")}>+ Put in order</button>
          </div>}
        </section>

        <div className="flex flex-col-reverse gap-3 border-t-2 hairline pt-5 sm:flex-row sm:justify-end">
          <Link to={cancelTo} className="secondary-button">Cancel</Link>
          <button type="submit" disabled={saving} className="primary-button">{saving ? "Saving…" : isEdit ? "Save changes" : "Create lesson"}</button>
        </div>
      </form>}
    </main>
  </div>;
}
