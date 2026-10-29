import { Router } from "express";
import { getLeaderboard, getLeague, markResultSeen } from "../controllers/league.controller.js";
import { requireAuth } from "../middleware/auth.js";

// Mounted at /api, so auth is applied per route rather than to the router.
const router = Router();

router.get("/leagues", requireAuth, getLeague);
router.post("/leagues/result/seen", requireAuth, markResultSeen);
router.get("/leaderboard", requireAuth, getLeaderboard);

export default router;
