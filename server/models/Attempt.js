import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  lessonId: { type: String, required: true, index: true },
  courseId: { type: String, required: true },
  correctCount: { type: Number, required: true },
  total: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timeSeconds: { type: Number, default: 0 },
  xpAwarded: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Attempt", attemptSchema);
