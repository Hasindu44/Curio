// Shared constants and form <-> API conversions for the Lesson Studio.

export const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Recently updated" },
  { value: "oldest", label: "Least recently updated" },
  { value: "title", label: "Title A–Z" },
  { value: "-title", label: "Title Z–A" },
  { value: "-xp", label: "Most XP" },
  { value: "xp", label: "Least XP" },
  { value: "order", label: "Course order" },
];

export const QUESTION_TYPES = {
  mcq: "Multiple choice",
  numeric: "Number answer",
  order: "Put in order",
  interactive: "Interactive explorer",
  lab: "Experiment lab",
};

export const difficultyLabel = (value) => DIFFICULTIES.find((item) => item.value === value)?.label ?? value;

const newKey = () => `q-${Math.random().toString(36).slice(2, 8)}`;

export function emptyQuestion(type) {
  const base = { id: newKey(), type, prompt: "", explanation: "" };
  if (type === "mcq") return { ...base, options: ["", ""], correctIndex: 0 };
  if (type === "numeric") return { ...base, answer: "" };
  return { ...base, items: ["", ""] };
}

export const emptyLesson = {
  title: "",
  slug: "",
  summary: "",
  course: "",
  order: 1,
  xp: 20,
  difficulty: "beginner",
  estimatedMinutes: 5,
  published: false,
  questions: [],
};

// API lesson -> editable form state (numbers as strings for inputs).
export function lessonToForm(lesson) {
  return {
    title: lesson.title,
    slug: lesson.slug,
    summary: lesson.summary ?? "",
    course: lesson.course?._id ?? lesson.course ?? "",
    order: String(lesson.order),
    xp: String(lesson.xp),
    difficulty: lesson.difficulty,
    estimatedMinutes: String(lesson.estimatedMinutes),
    published: lesson.published,
    questions: lesson.questions.map((question) => ({
      ...question,
      explanation: question.explanation ?? "",
      ...(question.type === "numeric" && { answer: String(question.answer) }),
    })),
  };
}

// Form state -> request body.
export function formToPayload(form) {
  return {
    ...form,
    title: form.title.trim(),
    summary: form.summary.trim(),
    order: Number(form.order),
    xp: Number(form.xp),
    estimatedMinutes: Number(form.estimatedMinutes),
    questions: form.questions.map((question) => ({
      ...question,
      prompt: question.prompt.trim(),
      explanation: question.explanation.trim(),
      ...(question.type === "numeric" && { answer: Number(question.answer) }),
      ...(question.type === "mcq" && { options: question.options.map((option) => option.trim()) }),
      ...(question.type === "order" && { items: question.items.map((item) => item.trim()) }),
    })),
  };
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";
}
