import mongoose from "mongoose";
import { SLUG_PATTERN } from "../utils/slugify.js";

export const ACCENTS = ["amber", "teal", "violet"];

// A course groups an ordered sequence of lessons. Lessons point back to their
// course (Lesson.course), so the learning path is a query, not a copy.
const courseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: SLUG_PATTERN },
  title: { type: String, required: true, trim: true, maxlength: 60 },
  tagline: { type: String, trim: true, maxlength: 140, default: "" },
  accent: { type: String, enum: ACCENTS, required: true },
  icon: { type: String, maxlength: 4, default: "★" },
  order: { type: Number, default: 0, min: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

courseSchema.index({ published: 1, order: 1 });

export default mongoose.model("Course", courseSchema);
