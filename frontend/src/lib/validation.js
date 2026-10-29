// Client-side checks that mirror the server's rules, so most mistakes are
// caught before a request is sent. The server still validates everything.

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function slugify(text) {
  return String(text || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

const inRange = (value, min, max) => value !== "" && Number.isInteger(Number(value)) && Number(value) >= min && Number(value) <= max;

export function validateSignup({ name, email, password }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address";
  if (password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) errors.password = "Password must contain a letter and a number";
  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
}

function validateQuestion(question, index, errors) {
  const at = (field) => `questions.${index}.${field}`;
  if (!question.prompt.trim()) errors[at("prompt")] = "Prompt is required";
  if (question.type === "mcq") {
    const filled = question.options.filter((option) => option.trim());
    if (filled.length < 2 || filled.length !== question.options.length) errors[at("options")] = "Fill in at least 2 options and remove empty ones";
    if (question.correctIndex == null || question.correctIndex >= question.options.length) errors[at("correctIndex")] = "Choose the correct option";
  }
  if (question.type === "numeric" && (question.answer === "" || !Number.isFinite(Number(question.answer)))) errors[at("answer")] = "Answer must be a number";
  if (question.type === "order") {
    const filled = question.items.filter((item) => item.trim());
    if (filled.length < 2 || filled.length !== question.items.length) errors[at("items")] = "Fill in at least 2 steps and remove empty ones";
  }
}

export function validateLesson(lesson) {
  const errors = {};
  const title = lesson.title.trim();
  if (title.length < 3) errors.title = "Title must be at least 3 characters";
  else if (title.length > 80) errors.title = "Title must be 80 characters or fewer";
  if (!SLUG_PATTERN.test(lesson.slug)) errors.slug = "Use lowercase letters, numbers and single dashes (e.g. chain-rule)";
  if (lesson.summary.length > 240) errors.summary = "Summary must be 240 characters or fewer";
  if (!lesson.course) errors.course = "Choose a course";
  if (!inRange(lesson.order, 1, 999)) errors.order = "Position must be a whole number from 1 to 999";
  if (!inRange(lesson.xp, 5, 100)) errors.xp = "XP must be a whole number from 5 to 100";
  if (!inRange(lesson.estimatedMinutes, 1, 60)) errors.estimatedMinutes = "Minutes must be a whole number from 1 to 60";
  if (lesson.published && lesson.questions.length === 0) errors.questions = "Add at least one question before publishing";
  lesson.questions.forEach((question, index) => validateQuestion(question, index, errors));
  return errors;
}
