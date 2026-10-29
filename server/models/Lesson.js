import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  course: { type: String, required: true, index: true },
  questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
  published: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);
