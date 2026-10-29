import "dotenv/config";
import "./lib/configureDns.js";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { requireAuth } from "./middleware/auth.js";
import Attempt from "./models/Attempt.js";
import Course from "./models/Course.js";
import Lesson from "./models/Lesson.js";
import User from "./models/User.js";
import { userView } from "./lib/userView.js";
import { TIERS, joinLeague, leagueView, settleLeague, standingsFor } from "./lib/leagues.js";
import { seedCatalog } from "./lib/seedCatalog.js";

const app = express();
const port = Number(process.env.PORT || 4000);

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env and fill both values.");
  process.exit(1);
}

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }));

const tokenFor = (user) => jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });

app.get("/api/health", (_req, res) => res.json({ ok: true, database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));

app.post("/api/auth/signup", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return res.status(400).json({ message: "Use a valid name, email, and password of at least 8 characters" });
    if (await User.exists({ email })) return res.status(409).json({ message: "An account already uses that email" });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: tokenFor(user), user: userView(user) });
  } catch (error) { next(error); }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(String(req.body.password || ""), user.passwordHash))) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: tokenFor(user), user: userView(user) });
  } catch (error) { next(error); }
});

app.get("/api/users/me", requireAuth, async (req, res, next) => {
  try {
    if (await settleLeague(req.user)) await req.user.save();
    res.json(userView(req.user));
  } catch (error) { next(error); }
});

app.patch("/api/users/me", requireAuth, async (req, res, next) => {
  try {
    if (typeof req.body.name === "string") req.user.name = req.body.name.trim().slice(0, 60);
    if (typeof req.body.bio === "string") req.user.bio = req.body.bio.trim().slice(0, 180);
    if (typeof req.body.avatarStyle === "string") req.user.avatarStyle = req.body.avatarStyle.slice(0, 30);
    await req.user.save();
    res.json(userView(req.user));
  } catch (error) { next(error); }
});

app.get("/api/courses", async (req, res, next) => {
  try {
    let progress = [];
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (token) {
      try { const payload = jwt.verify(token, process.env.JWT_SECRET); progress = (await User.findById(payload.sub))?.lessonProgress ?? []; } catch { /* public catalog */ }
    }
    const catalog = await Course.find({ published: true }).sort({ order: 1 }).lean();
    const completed = new Set(progress.filter((item) => item.status === "completed").map((item) => item.lessonId));
    res.json(catalog.map((course) => ({ id: course.slug, title: course.title, tagline: course.tagline, accent: course.accent, icon: course.icon, nodes: course.nodes.map((node, index) => {
      if (completed.has(node.id)) return { ...node, status: "completed" };
      if (index > 0 && completed.has(course.nodes[index - 1].id)) return { ...node, status: "active" };
      return node;
    }) })));
  } catch (error) { next(error); }
});

app.get("/api/lessons/:lessonId", async (req, res, next) => {
  try {
    const lesson = await Lesson.findOne({ slug: req.params.lessonId, published: true }).lean();
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json({ title: lesson.title, course: lesson.course, questions: lesson.questions });
  } catch (error) { next(error); }
});

app.put("/api/users/me/course-profiles/:courseId", requireAuth, async (req, res, next) => {
  try {
    const profile = { goal: req.body.goal, level: req.body.level, pace: String(req.body.pace || "10"), updatedAt: new Date() };
    req.user.courseProfiles.set(req.params.courseId, profile);
    await req.user.save();
    res.json(profile);
  } catch (error) { next(error); }
});

app.put("/api/users/me/active-course", requireAuth, async (req, res, next) => {
  try { req.user.activeCourseId = req.body.courseId; await req.user.save(); res.json({ activeCourseId: req.user.activeCourseId }); }
  catch (error) { next(error); }
});

app.post("/api/lessons/:lessonId/complete", requireAuth, async (req, res, next) => {
  try {
    const lesson = await Lesson.findOne({ slug: req.params.lessonId, published: true }).lean();
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    const total = lesson.questions.length;
    const correctCount = Math.max(0, Math.min(total, Number(req.body.correctCount || 0)));
    const timeSeconds = Math.max(0, Math.min(7200, Number(req.body.timeSeconds || 0)));
    const accuracy = Math.round(correctCount / total * 100);
    const xpAwarded = correctCount * 10 + (correctCount === total ? 10 : 0);
    const course = await Course.findOne({ title: lesson.course }).lean();
    const existing = req.user.lessonProgress.find((item) => item.lessonId === req.params.lessonId);
    const wasComplete = existing?.status === "completed";
    if (existing) { existing.status = "completed"; existing.attempts += 1; existing.bestAccuracy = Math.max(existing.bestAccuracy, accuracy); existing.bestTimeSeconds = existing.bestTimeSeconds ? Math.min(existing.bestTimeSeconds, timeSeconds || existing.bestTimeSeconds) : timeSeconds; existing.completedAt = new Date(); }
    else req.user.lessonProgress.push({ lessonId: req.params.lessonId, courseId: course?.slug || "unknown", status: "completed", attempts: 1, bestAccuracy: accuracy, bestTimeSeconds: timeSeconds, completedAt: new Date() });
    req.user.xp += xpAwarded;
    req.user.leaguePoints += xpAwarded;
    await settleLeague(req.user);
    if (xpAwarded > 0) {
      await joinLeague(req.user);
      req.user.league.weeklyXp += xpAwarded;
    }
    if (correctCount === total) req.user.gems += 5;
    const wrongCount = total - correctCount;
    req.user.hearts.current = Math.max(0, req.user.hearts.current - wrongCount);
    if (wrongCount > 0 && !req.user.hearts.nextRefillAt) req.user.hearts.nextRefillAt = new Date(Date.now() + 5 * 60 * 1000);
    req.user.totalStudySeconds += timeSeconds;
    if (!wasComplete) req.user.completedLessons += 1;
    const today = new Date().toISOString().slice(0, 10);
    const previous = req.user.streak.lastActivityAt?.toISOString().slice(0, 10);
    if (previous !== today) {
      const gapDays = req.user.streak.lastActivityAt ? Math.floor((Date.now() - req.user.streak.lastActivityAt.getTime()) / 86400000) : 1;
      req.user.streak.current = gapDays <= 1 ? req.user.streak.current + 1 : 1;
      req.user.streak.longest = Math.max(req.user.streak.longest, req.user.streak.current);
      req.user.streak.lastActivityAt = new Date();
    }
    if (!wasComplete && req.user.completedLessons === 1) req.user.badges.push({ id: "first-lesson", label: "First Lesson", earnedAt: new Date() });
    if (correctCount === total && !req.user.badges.some((badge) => badge.id === "perfect")) req.user.badges.push({ id: "perfect", label: "Perfect Lesson", earnedAt: new Date() });
    await Promise.all([req.user.save(), Attempt.create({ userId: req.user._id, lessonId: req.params.lessonId, courseId: course?.slug || "unknown", correctCount, total, accuracy, timeSeconds, xpAwarded })]);
    res.json({ ok: true, xpAwarded, user: userView(req.user) });
  } catch (error) { next(error); }
});

app.get("/api/leagues", requireAuth, async (req, res, next) => {
  try {
    if (await settleLeague(req.user)) await req.user.save();
    res.json({ tiers: TIERS, current: leagueView(req.user) });
  } catch (error) { next(error); }
});

app.get("/api/leaderboard", requireAuth, async (req, res, next) => {
  try {
    if (await settleLeague(req.user)) await req.user.save();
    res.json(await standingsFor(req.user));
  } catch (error) { next(error); }
});

// The end-of-week result is shown once; this marks it as seen.
app.post("/api/leagues/result/seen", requireAuth, async (req, res, next) => {
  try {
    if (req.user.league?.lastResult) {
      req.user.league.lastResult = { ...req.user.league.lastResult, seen: true };
      req.user.markModified("league");
      await req.user.save();
    }
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ message: "Something went wrong on the server" }); });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await seedCatalog();
  app.listen(port, () => console.log(`Curio API running on http://localhost:${port}`));
}).catch((error) => { console.error("MongoDB connection failed:", error.message); process.exit(1); });
