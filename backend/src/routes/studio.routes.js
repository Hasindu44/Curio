import { Router } from "express";
import { createLesson, deleteLesson, getLesson, listCourses, listLessons, updateLesson } from "../controllers/studio.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { lessonSchema, listLessonsQuery } from "../validators/lesson.validator.js";

// Lesson Studio: full CRUD on lessons, for instructors only.
const router = Router();
router.use(requireAuth, requireRole("instructor"));

router.get("/courses", listCourses);
router.route("/lessons")
  .get(validate(listLessonsQuery, "query"), listLessons)
  .post(validate(lessonSchema), createLesson);
router.route("/lessons/:id")
  .get(getLesson)
  .put(validate(lessonSchema), updateLesson)
  .delete(deleteLesson);

export default router;
