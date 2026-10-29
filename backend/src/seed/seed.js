// Usage:
//   npm run seed         fill an empty database and create the instructor
//   npm run seed:reset   delete all courses, lessons and attempts, then reseed
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import Attempt from "../models/Attempt.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import { seedCatalog } from "./seedCatalog.js";

const reset = process.argv.includes("--reset");

try {
  await connectDatabase(env.mongoUri);
  if (reset) {
    await Promise.all([Course.deleteMany({}), Lesson.deleteMany({}), Attempt.deleteMany({})]);
    await User.updateMany({}, { $set: { lessonProgress: [], completedLessons: 0 } });
    console.log("Catalog, attempts and learner progress cleared");
  }
  await seedCatalog();
  console.log("Seed complete");
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
