import bcrypt from "bcryptjs";
import Attempt from "../models/Attempt.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import { settleLeague } from "../services/league.service.js";
import { ApiError } from "../utils/ApiError.js";
import { userView } from "../utils/userView.js";

export async function getMe(req, res) {
  if (await settleLeague(req.user)) await req.user.save();
  res.json(userView(req.user));
}

export async function updateMe(req, res) {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json(userView(req.user));
}

// Deleting an account requires the password and removes the learner's
// attempt history with it. Lessons they authored stay, without an author.
export async function deleteMe(req, res) {
  const user = await User.findById(req.user._id).select("+passwordHash");
  if (!(await bcrypt.compare(req.body.password, user.passwordHash))) {
    throw ApiError.badRequest("That password is not correct", { password: "That password is not correct" });
  }
  await Attempt.deleteMany({ user: user._id });
  await Lesson.updateMany({ createdBy: user._id }, { $set: { createdBy: null } });
  await user.deleteOne();
  res.status(204).end();
}

export async function saveCourseProfile(req, res) {
  if (!(await Course.exists({ slug: req.params.courseId }))) throw ApiError.notFound("Course not found");
  const profile = { ...req.body, updatedAt: new Date() };
  req.user.courseProfiles.set(req.params.courseId, profile);
  await req.user.save();
  res.json(profile);
}

export async function setActiveCourse(req, res) {
  if (!(await Course.exists({ slug: req.body.courseId }))) throw ApiError.notFound("Course not found");
  req.user.activeCourseId = req.body.courseId;
  await req.user.save();
  res.json({ activeCourseId: req.user.activeCourseId });
}
