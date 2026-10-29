import mongoose from "mongoose";
import Attempt from "../models/Attempt.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { escapeRegex } from "../utils/slugify.js";
import { SORTS } from "../validators/lesson.validator.js";

// Instructor-only CRUD for lessons. Lessons are addressed by _id here so a
// slug can be edited without breaking the URL being edited.

async function findLessonOr404(id) {
  if (!mongoose.isValidObjectId(id)) throw ApiError.notFound("Lesson not found");
  const lesson = await Lesson.findById(id);
  if (!lesson) throw ApiError.notFound("Lesson not found");
  return lesson;
}

async function assertCourseExists(courseId) {
  if (!(await Course.exists({ _id: courseId }))) {
    throw ApiError.badRequest("Please fix the highlighted fields", { course: "That course does not exist" });
  }
}

async function assertSlugFree(slug, exceptId) {
  const taken = await Lesson.exists({ slug, ...(exceptId && { _id: { $ne: exceptId } }) });
  if (taken) throw ApiError.conflict("That URL slug is already used by another lesson", { slug: "That URL slug is already used by another lesson" });
}

async function lessonStats(lessonId) {
  const [stats] = await Attempt.aggregate([
    { $match: { lesson: lessonId } },
    { $group: { _id: null, attempts: { $sum: 1 }, learners: { $addToSet: "$user" }, avgAccuracy: { $avg: "$accuracy" }, avgSeconds: { $avg: "$timeSeconds" } } },
  ]);
  return {
    attempts: stats?.attempts ?? 0,
    learners: stats?.learners.length ?? 0,
    avgAccuracy: stats ? Math.round(stats.avgAccuracy) : null,
    avgSeconds: stats ? Math.round(stats.avgSeconds) : null,
  };
}

export async function listCourses(_req, res) {
  const [courses, counts] = await Promise.all([
    Course.find().sort({ order: 1 }).lean(),
    Lesson.aggregate([{ $group: { _id: "$course", lessons: { $sum: 1 } } }]),
  ]);
  const byCourse = new Map(counts.map((row) => [row._id.toString(), row.lessons]));
  res.json(courses.map((course) => ({ ...course, lessonCount: byCourse.get(course._id.toString()) ?? 0 })));
}

// GET /api/studio/lessons?search=&course=&status=&difficulty=&sort=&page=&limit=
export async function listLessons(req, res) {
  const { search, course, status, difficulty, sort, page, limit } = req.validatedQuery;
  const filter = {};
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { slug: pattern }, { summary: pattern }];
  }
  if (course) filter.course = course;
  if (status) filter.published = status === "published";
  if (difficulty) filter.difficulty = difficulty;

  const [items, total] = await Promise.all([
    Lesson.find(filter)
      .select("-questions.options -questions.items -questions.inner -questions.outer")
      .populate("course", "title slug accent icon")
      .sort({ ...SORTS[sort], _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Lesson.countDocuments(filter),
  ]);

  res.json({
    items: items.map(({ questions, ...lesson }) => ({ ...lesson, questionCount: questions.length })),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function getLesson(req, res) {
  const lesson = await findLessonOr404(req.params.id);
  await lesson.populate([{ path: "course", select: "title slug accent icon" }, { path: "createdBy", select: "name email" }]);
  res.json({ ...lesson.toObject(), stats: await lessonStats(lesson._id) });
}

export async function createLesson(req, res) {
  await assertCourseExists(req.body.course);
  await assertSlugFree(req.body.slug);
  const lesson = await Lesson.create({ ...req.body, createdBy: req.user._id });
  res.status(201).location(`/api/studio/lessons/${lesson._id}`).json(lesson);
}

export async function updateLesson(req, res) {
  const lesson = await findLessonOr404(req.params.id);
  await assertCourseExists(req.body.course);
  await assertSlugFree(req.body.slug, lesson._id);
  lesson.set(req.body);
  await lesson.save();
  res.json(lesson);
}

// Deleting a lesson also removes its attempts and everyone's progress entry
// for it, so no record is left pointing at a lesson that no longer exists.
export async function deleteLesson(req, res) {
  const lesson = await findLessonOr404(req.params.id);
  const [attempts] = await Promise.all([
    Attempt.deleteMany({ lesson: lesson._id }),
    User.updateMany({ "lessonProgress.lesson": lesson._id }, { $pull: { lessonProgress: { lesson: lesson._id } } }),
  ]);
  await lesson.deleteOne();
  res.json({ ok: true, deletedAttempts: attempts.deletedCount });
}
