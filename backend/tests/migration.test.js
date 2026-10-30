// Checks that data saved by the earlier version (lessons linked by course
// title, progress/attempts linked by slug) is converted to references.
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";

const { seedCatalog } = await import("../src/seed/seedCatalog.js");
const { default: Lesson } = await import("../src/models/Lesson.js");
const { default: User } = await import("../src/models/User.js");
const { default: Attempt } = await import("../src/models/Attempt.js");

let mongo;
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

test("legacy catalog, progress and attempts are re-linked by slug", async () => {
  const db = mongoose.connection.db;
  await db.collection("courses").insertOne({ slug: "calculus", title: "Calculus", accent: "amber", nodes: [{ id: "chain-rule", status: "completed" }] });
  await db.collection("lessons").insertOne({ slug: "chain-rule", title: "Chain Rule", course: "Calculus", questions: [] });
  const { insertedId: userId } = await db.collection("users").insertOne({
    name: "Old User", email: "old@test.dev", passwordHash: "x", leaguePoints: 40,
    streak: { current: 1, longest: 1 }, hearts: { current: 5, max: 5 },
    lessonProgress: [
      { lessonId: "chain-rule", courseId: "calculus", status: "completed", attempts: 2, bestAccuracy: 100 },
      { lessonId: "gone", courseId: "calculus", status: "completed", attempts: 1 },
    ],
  });
  await db.collection("attempts").insertMany([
    { userId, lessonId: "chain-rule", courseId: "calculus", correctCount: 4, total: 4, accuracy: 100, xpAwarded: 50 },
    { userId, lessonId: "gone", courseId: "calculus", correctCount: 1, total: 1, accuracy: 100, xpAwarded: 10 },
  ]);

  await seedCatalog();

  const chainRule = await Lesson.findOne({ slug: "chain-rule" }).populate("course");
  assert.equal(chainRule.course.slug, "calculus");
  assert.ok(chainRule.published);
  assert.equal(await db.collection("lessons").countDocuments({ course: { $type: "string" } }), 0);

  const user = await User.findById(userId);
  assert.equal(user.lessonProgress.length, 1);
  assert.ok(user.lessonProgress[0].lesson.equals(chainRule._id));
  assert.equal(user.lessonProgress[0].attempts, 2);

  const attempts = await Attempt.find({ user: userId });
  assert.equal(attempts.length, 1);
  assert.ok(attempts[0].lesson.equals(chainRule._id));

  // Running again must not change anything.
  await seedCatalog();
  assert.equal(await Lesson.countDocuments({ slug: "chain-rule" }), 1);
});

test("empty drafts from an older seed get their questions", async () => {
  const limits = await Lesson.findOne({ slug: "limits" });
  await Lesson.updateOne({ _id: limits._id }, { $set: { published: false, questions: [], summary: "" } });
  await Lesson.updateOne({ slug: "derivatives" }, { $set: { published: false, questions: [{ id: "mine", type: "numeric", prompt: "Instructor draft", answer: 1 }] } });

  await seedCatalog();

  const filled = await Lesson.findById(limits._id);
  assert.ok(filled.published);
  assert.ok(filled.questions.length > 0);
  assert.ok(filled.summary);
  const edited = await Lesson.findOne({ slug: "derivatives" });
  assert.equal(edited.published, false);
  assert.deepEqual(edited.questions.map((q) => q.id), ["mine"]);
});
