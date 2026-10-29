import { Router } from "express";
import { completeLesson, getLesson } from "../controllers/lesson.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { completeLessonSchema } from "../validators/lesson.validator.js";

const router = Router();
router.get("/:slug", getLesson);
router.post("/:slug/complete", requireAuth, validate(completeLessonSchema), completeLesson);

export default router;
