import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import { courses, lessons } from "./catalog.data.js";

async function insertCatalog() {
  const created = await Course.insertMany(courses.map((course, order) => ({ published: true, ...course, order })));
  const courseIds = new Map(created.map((course) => [course.slug, course._id]));
  await Lesson.insertMany(lessons.map((lesson) => ({ ...lesson, course: courseIds.get(lesson.course) })));
  return courseIds;
}

// Earlier versions stored lessons with a course *title* and progress/attempts
// with lesson *slugs*. Rebuild the catalog and re-link those records by slug.
async function migrateLegacyCatalog() {
  const db = mongoose.connection.db;
  const legacy = await db.collection("lessons").findOne({ course: { $type: "string" } });
  if (!legacy) return false;

  console.log("Migrating catalog to referenced lessons…");
  await db.collection("lessons").deleteMany({});
  await db.collection("courses").deleteMany({});
  const courseIds = await insertCatalog();
  const lessonRows = await Lesson.find().select("slug course").lean();
  const lessonBySlug = new Map(lessonRows.map((lesson) => [lesson.slug, lesson]));

  const users = db.collection("users");
  for await (const user of users.find({ "lessonProgress.lessonId": { $exists: true } })) {
    const lessonProgress = user.lessonProgress.flatMap(({ lessonId, courseId, ...rest }) => {
      const lesson = lessonBySlug.get(lessonId);
      return lesson ? [{ ...rest, lesson: lesson._id, course: lesson.course }] : [];
    });
    await users.updateOne({ _id: user._id }, { $set: { lessonProgress }, $unset: { leaguePoints: "" } });
  }

  const attempts = db.collection("attempts");
  for await (const attempt of attempts.find({ lessonId: { $exists: true } })) {
    const lesson = lessonBySlug.get(attempt.lessonId);
    if (!lesson) { await attempts.deleteOne({ _id: attempt._id }); continue; }
    await attempts.updateOne({ _id: attempt._id }, {
      $set: { user: attempt.userId, lesson: lesson._id, course: lesson.course ?? courseIds.get(attempt.courseId) },
      $unset: { userId: "", lessonId: "", courseId: "" },
    });
  }
  return true;
}

// Databases seeded before every lesson had questions still hold empty drafts.
// Fill those (and only those, so instructor edits are kept) from the catalog.
async function fillEmptyDrafts() {
  const drafts = await Lesson.find({ published: false, questions: { $size: 0 } }).select("slug summary");
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));
  let filled = 0;
  for (const draft of drafts) {
    const source = bySlug.get(draft.slug);
    if (!source?.questions.length) continue;
    draft.set({ questions: source.questions, summary: draft.summary || source.summary, estimatedMinutes: source.estimatedMinutes, published: true });
    await draft.save();
    filled += 1;
  }
  if (filled) console.log(`Added questions to ${filled} draft lessons`);
}

// Creates the instructor account from .env so the Lesson Studio can be opened.
export async function ensureInstructor() {
  const { name, email, password } = env.instructor;
  if (!email || !password) return;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (existing.role !== "instructor") await User.updateOne({ _id: existing._id }, { role: "instructor" });
    return;
  }
  await User.create({ name, email, role: "instructor", passwordHash: await bcrypt.hash(password, 12) });
  console.log(`Instructor account created: ${email}`);
}

// Runs on every start. Only fills an empty catalog, so lessons an instructor
// deletes stay deleted.
export async function seedCatalog() {
  if (!(await migrateLegacyCatalog()) && (await Course.estimatedDocumentCount()) === 0) {
    await insertCatalog();
    console.log(`Seeded ${courses.length} courses and ${lessons.length} lessons`);
  } else {
    await fillEmptyDrafts();
  }
  await ensureInstructor();
}
