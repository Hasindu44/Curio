import { Router } from "express";
import { getStartupError, isDatabaseConnected } from "../config/db.js";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
import leagueRoutes from "./league.routes.js";
import lessonRoutes from "./lesson.routes.js";
import studioRoutes from "./studio.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.get("/health", (_req, res) =>
  res.json({ ok: true, database: isDatabaseConnected() ? "connected" : "disconnected", error: getStartupError() ?? undefined }),
);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);
router.use("/studio", studioRoutes);
router.use("/", leagueRoutes);

export default router;
