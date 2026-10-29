import { Router } from "express";
import { listCourses } from "../controllers/course.controller.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", optionalAuth, listCourses);

export default router;
