import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, signup } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/auth.validator.js";

const router = Router();

// Slows down password guessing.
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { message: "Too many attempts. Please wait a few minutes and try again." } }));

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

export default router;
