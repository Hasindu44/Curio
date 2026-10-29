import { z } from "zod";
import { DIFFICULTIES } from "../models/Lesson.js";
import { SLUG_PATTERN } from "../utils/slugify.js";

const objectId = (label) => z.string({ error: `${label} is required` }).regex(/^[a-f\d]{24}$/i, `Choose a valid ${label.toLowerCase()}`);
const text = (label, max) => z.string({ error: `${label} is required` }).trim().min(1, `${label} is required`).max(max, `${label} must be ${max} characters or fewer`);
const optionalText = (label, max) => z.string().trim().max(max, `${label} must be ${max} characters or fewer`).optional().default("");
const int = (label, min, max) => z.coerce.number({ error: `${label} must be a number` }).int(`${label} must be a whole number`).min(min, `${label} must be at least ${min}`).max(max, `${label} must be at most ${max}`);

const base = {
  id: z.string().trim().regex(/^[a-z0-9-]{1,40}$/i, "Question key may only use letters, numbers and dashes"),
  prompt: text("Prompt", 500),
  explanation: optionalText("Explanation", 600),
};

const mcq = z.object({
  ...base,
  type: z.literal("mcq"),
  options: z.array(text("Option", 160), { error: "Add answer options" }).min(2, "Add at least 2 options").max(6, "Use at most 6 options"),
  optionsAreMath: z.boolean().optional(),
  correctIndex: z.coerce.number({ error: "Choose the correct option" }).int().min(0, "Choose the correct option"),
}).refine((q) => q.correctIndex < q.options.length, { error: "Choose one of the listed options as correct", path: ["correctIndex"] });

const numeric = z.object({
  ...base,
  type: z.literal("numeric"),
  answer: z.coerce.number({ error: "Answer must be a number" }).refine(Number.isFinite, "Answer must be a number"),
});

const order = z.object({
  ...base,
  type: z.literal("order"),
  items: z.array(text("Step", 200), { error: "Add the steps" }).min(2, "Add at least 2 steps").max(8, "Use at most 8 steps"),
});

// Interactive explorers and labs are authored in code; the studio keeps them
// as-is when a lesson is edited, so only their shape is checked here.
const interactive = z.object({
  ...base,
  type: z.literal("interactive"),
  expression: z.string().max(200).optional(),
  inner: z.record(z.string(), z.string()).optional(),
  outer: z.record(z.string(), z.string()).optional(),
});

const lab = z.object({
  ...base,
  type: z.literal("lab"),
  lab: z.enum(["slope"], { error: "Unknown lab" }),
});

export const questionSchema = z.discriminatedUnion("type", [mcq, numeric, order, interactive, lab], { error: "Choose a question type" });

export const lessonSchema = z.object({
  title: text("Title", 80).min(3, "Title must be at least 3 characters"),
  slug: z.string({ error: "URL slug is required" }).trim().toLowerCase().regex(SLUG_PATTERN, "Use lowercase letters, numbers and single dashes (e.g. chain-rule)").max(60, "URL slug must be 60 characters or fewer"),
  summary: optionalText("Summary", 240),
  course: objectId("Course"),
  order: int("Position", 1, 999),
  xp: int("XP", 5, 100),
  difficulty: z.enum(DIFFICULTIES, { error: "Choose a difficulty" }),
  estimatedMinutes: int("Estimated minutes", 1, 60),
  published: z.boolean().default(false),
  questions: z.array(questionSchema).max(20, "A lesson can have at most 20 questions").default([]),
}).superRefine((lesson, ctx) => {
  if (lesson.published && lesson.questions.length === 0) {
    ctx.addIssue({ code: "custom", path: ["questions"], message: "Add at least one question before publishing" });
  }
  const seen = new Set();
  lesson.questions.forEach((question, index) => {
    if (seen.has(question.id)) ctx.addIssue({ code: "custom", path: ["questions", index, "id"], message: "Each question needs a unique key" });
    seen.add(question.id);
  });
});

export const SORTS = {
  newest: { updatedAt: -1 },
  oldest: { updatedAt: 1 },
  title: { title: 1 },
  "-title": { title: -1 },
  xp: { xp: 1 },
  "-xp": { xp: -1 },
  order: { course: 1, order: 1 },
};

export const listLessonsQuery = z.object({
  search: z.string().trim().max(80).optional().default(""),
  course: z.union([z.literal(""), objectId("Course")]).optional().default(""),
  status: z.enum(["", "published", "draft"]).optional().default(""),
  difficulty: z.enum(["", ...DIFFICULTIES]).optional().default(""),
  sort: z.enum(Object.keys(SORTS)).optional().default("newest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const completeLessonSchema = z.object({
  correctCount: z.coerce.number().int().min(0),
  timeSeconds: z.coerce.number().min(0).max(7200).optional().default(0),
  total: z.coerce.number().optional(),
});
