import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  tagline: String,
  accent: { type: String, enum: ["amber", "teal", "violet"], required: true },
  icon: String,
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  nodes: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
