import mongoose from "mongoose";

export const ROLES = ["learner", "instructor"];

const lessonProgressSchema = new mongoose.Schema({
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  bestAccuracy: { type: Number, default: 0, min: 0, max: 100 },
  bestTimeSeconds: { type: Number, default: 0, min: 0 },
  attempts: { type: Number, default: 0, min: 0 },
  completedAt: Date,
}, { _id: false });

// Answers from the "build your path" questions, keyed by course slug.
const courseProfileSchema = new mongoose.Schema({
  goal: { type: String, enum: ["understand", "exam", "apply"], required: true },
  level: { type: String, enum: ["new", "familiar", "confident"], required: true },
  pace: { type: String, enum: ["5", "10", "15"], default: "10" },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  icon: String,
  earnedAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ROLES, default: "learner" },
  bio: { type: String, default: "Learning one powerful idea at a time.", maxlength: 180 },
  avatarStyle: { type: String, default: "spark", maxlength: 30 },
  xp: { type: Number, default: 0, min: 0 },
  gems: { type: Number, default: 120, min: 0 },
  streak: {
    current: { type: Number, default: 0, min: 0 },
    longest: { type: Number, default: 0, min: 0 },
    lastActivityAt: Date,
  },
  hearts: {
    current: { type: Number, default: 5, min: 0 },
    max: { type: Number, default: 5, min: 1 },
    nextRefillAt: Date,
  },
  activeCourseId: { type: String, default: null },
  courseProfiles: { type: Map, of: courseProfileSchema, default: {} },
  lessonProgress: { type: [lessonProgressSchema], default: [] },
  completedLessons: { type: Number, default: 0, min: 0 },
  totalStudySeconds: { type: Number, default: 0, min: 0 },
  // Weekly league: tier index (0 = Bronze), the week and cohort currently joined,
  // XP earned this week, and a snapshot/result of the last finished week.
  league: {
    tier: { type: Number, default: 0, min: 0 },
    weekId: { type: String, default: null },
    cohort: { type: Number, default: null },
    weeklyXp: { type: Number, default: 0, min: 0 },
    lastWeek: { type: mongoose.Schema.Types.Mixed, default: null },
    lastResult: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  badges: { type: [badgeSchema], default: [] },
}, { timestamps: true });

userSchema.index({ "league.weekId": 1, "league.tier": 1, "league.cohort": 1, "league.weeklyXp": -1 });

export default mongoose.model("User", userSchema);
