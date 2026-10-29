import mongoose from "mongoose";

// One row per finished lesson run. Kept separately from User so history can
// grow without bloating the user document, and so lesson stats can be queried.
const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  correctCount: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 1 },
  accuracy: { type: Number, required: true, min: 0, max: 100 },
  timeSeconds: { type: Number, default: 0, min: 0 },
  xpAwarded: { type: Number, required: true, min: 0 },
}, { timestamps: true });

attemptSchema.index({ user: 1, createdAt: -1 });
attemptSchema.index({ lesson: 1 });

export default mongoose.model("Attempt", attemptSchema);
