import { courses, lessons } from "../../src/data/mockData.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export async function seedCatalog() {
  await Promise.all([
    Course.bulkWrite(courses.map((course, order) => ({
      updateOne: {
        filter: { slug: course.id },
        update: { $setOnInsert: { slug: course.id, title: course.title, tagline: course.tagline, accent: course.accent, icon: course.icon, nodes: course.nodes, order, published: true } },
        upsert: true,
      },
    }))),
    Lesson.bulkWrite(Object.entries(lessons).map(([slug, lesson]) => ({
      updateOne: {
        filter: { slug },
        update: { $setOnInsert: { slug, title: lesson.title, course: lesson.course, questions: lesson.questions, published: true } },
        upsert: true,
      },
    }))),
  ]);
}
