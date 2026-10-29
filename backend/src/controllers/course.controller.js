import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import { buildPath } from "../services/progress.service.js";

// Public catalog. When a learner is signed in, each path shows their progress.
export async function listCourses(req, res) {
  const [courses, lessons] = await Promise.all([
    Course.find({ published: true }).sort({ order: 1 }).lean(),
    Lesson.find().select("slug title xp course order published").sort({ order: 1 }).lean(),
  ]);
  const completed = new Set((req.user?.lessonProgress ?? [])
    .filter((item) => item.status === "completed")
    .map((item) => item.lesson.toString()));

  res.json(courses.map((course) => ({
    id: course.slug,
    title: course.title,
    tagline: course.tagline,
    accent: course.accent,
    icon: course.icon,
    nodes: buildPath(lessons.filter((lesson) => lesson.course.equals(course._id)), completed),
  })));
}
