import { Router } from "express";
import { deleteMe, getMe, saveCourseProfile, setActiveCourse, updateMe } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { activeCourseSchema, courseProfileSchema, deleteAccountSchema, updateProfileSchema } from "../validators/user.validator.js";

const router = Router();
router.use(requireAuth);

router.route("/me")
  .get(getMe)
  .patch(validate(updateProfileSchema), updateMe)
  .delete(validate(deleteAccountSchema), deleteMe);
router.put("/me/course-profiles/:courseId", validate(courseProfileSchema), saveCourseProfile);
router.put("/me/active-course", validate(activeCourseSchema), setActiveCourse);

export default router;
