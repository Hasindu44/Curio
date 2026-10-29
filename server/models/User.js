import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  courseId: { type: String, required: true },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  bestAccuracy: { type: Number, default: 0 },
  bestTimeSeconds: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  completedAt: Date,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  bio: { type: String, default: "Learning one powerful idea at a time.", maxlength: 180 },
  avatarStyle: { type: String, default: "spark" },
  xp: { type: Number, default: 0, min: 0 },
  gems: { type: Number, default: 120, min: 0 },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivityAt: Date,
  },
  hearts: {
    current: { type: Number, default: 5 },
    max: { type: Number, default: 5 },
    nextRefillAt: Date,
  },
  activeCourseId: { type: String, default: null },
  courseProfiles: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  lessonProgress: { type: [lessonProgressSchema], default: [] },
  completedLessons: { type: Number, default: 0 },
  totalStudySeconds: { type: Number, default: 0 },
  leaguePoints: { type: Number, default: 0 },
  // Weekly league: tier index (0 = Bronze), the week and cohort currently joined,
  // XP earned this week, and a snapshot/result of the last finished week.
  league: {
    tier: { type: Number, default: 0, min: 0 },
    weekId: { type: String, default: null },
    cohort: { type: Number, default: null },
    weeklyXp: { type: Number, default: 0 },
    lastWeek: { type: mongoose.Schema.Types.Mixed, default: null },
    lastResult: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  badges: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
