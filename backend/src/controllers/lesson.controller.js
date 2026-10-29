import Lesson from "../models/Lesson.js";
import { recordCompletion } from "../services/progress.service.js";
import { ApiError } from "../utils/ApiError.js";
import { userView } from "../utils/userView.js";

// Learner-facing lesson endpoints. Lessons are addressed by slug here.
async function findPublished(slug) {
  const lesson = await Lesson.findOne({ slug, published: true }).populate("course", "title slug");
  if (!lesson) throw ApiError.notFound("Lesson not found");
  return lesson;
}

export async function getLesson(req, res) {
  const lesson = await findPublished(req.params.slug);
  res.json({ title: lesson.title, course: lesson.course.title, questions: lesson.questions });
}

export async function completeLesson(req, res) {
  const lesson = await findPublished(req.params.slug);
  lesson.depopulate("course");
  const { xpAwarded } = await recordCompletion(req.user, lesson, req.body);
  res.json({ ok: true, xpAwarded, user: userView(req.user) });
}
