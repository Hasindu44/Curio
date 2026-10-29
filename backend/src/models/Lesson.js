import mongoose from "mongoose";
import { SLUG_PATTERN } from "../utils/slugify.js";

export const QUESTION_TYPES = ["mcq", "numeric", "order", "interactive", "lab"];
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

// Questions only exist inside their lesson, so they are embedded subdocuments.
// `id` is a stable key the client uses to render the sequence.
const questionSchema = new mongoose.Schema({
  id: { type: String, required: true, trim: true, maxlength: 40 },
  type: { type: String, enum: QUESTION_TYPES, required: true },
  prompt: { type: String, required: true, trim: true, maxlength: 500 },
  explanation: { type: String, trim: true, maxlength: 600, default: "" },
  // mcq
  options: { type: [String], default: undefined },
  optionsAreMath: { type: Boolean, default: undefined },
  correctIndex: { type: Number, min: 0, default: undefined },
  // numeric
  answer: { type: Number, default: undefined },
  // order (stored in the correct order; the client shuffles them)
  items: { type: [String], default: undefined },
  // interactive / lab blocks authored with the built-in explorers
  expression: String,
  inner: mongoose.Schema.Types.Mixed,
  outer: mongoose.Schema.Types.Mixed,
  lab: String,
}, { _id: false, id: false });

const lessonSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: SLUG_PATTERN },
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
  summary: { type: String, trim: true, maxlength: 240, default: "" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  order: { type: Number, required: true, min: 1, max: 999 },
  xp: { type: Number, required: true, min: 5, max: 100, default: 20 },
  difficulty: { type: String, enum: DIFFICULTIES, default: "beginner" },
  estimatedMinutes: { type: Number, min: 1, max: 60, default: 5 },
  published: { type: Boolean, default: false },
  questions: {
    type: [questionSchema],
    default: [],
    validate: {
      validator(questions) { return !this.published || questions.length > 0; },
      message: "A published lesson needs at least one question",
    },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ published: 1, updatedAt: -1 });

export default mongoose.model("Lesson", lessonSchema);
