// Integration tests for the REST API against an in-memory MongoDB.
// Run with: npm test (from backend/ or the project root)
import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.INSTRUCTOR_EMAIL = "teacher@test.dev";
process.env.INSTRUCTOR_PASSWORD = "Teacher123";

const { createApp } = await import("../src/app.js");
const { seedCatalog } = await import("../src/seed/seedCatalog.js");

let mongo;
let api;
let instructor;
let learner;
let courseId;

const auth = (token) => ({ Authorization: `Bearer ${token}` });
const validLesson = (overrides = {}) => ({
  title: "Torque",
  slug: "torque",
  summary: "Why a longer wrench helps",
  course: courseId,
  order: 7,
  xp: 30,
  difficulty: "intermediate",
  estimatedMinutes: 6,
  published: true,
  questions: [
    { id: "q1", type: "mcq", prompt: "Torque equals…", options: ["r × F", "m × a"], correctIndex: 0, explanation: "Lever arm times force." },
    { id: "q2", type: "numeric", prompt: "2 m × 5 N = ? N·m", answer: 10 },
  ],
  ...overrides,
});

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await seedCatalog();
  api = request(createApp());
  instructor = (await api.post("/api/auth/login").send({ email: "teacher@test.dev", password: "Teacher123" })).body.token;
  learner = (await api.post("/api/auth/signup").send({ name: "Ada", email: "ada@test.dev", password: "Learner123" })).body.token;
  courseId = (await api.get("/api/studio/courses").set(auth(instructor))).body.find((c) => c.slug === "mechanics")._id;
});

after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

describe("auth", () => {
  test("rejects an invalid signup with field errors", async () => {
    const res = await api.post("/api/auth/signup").send({ name: "A", email: "nope", password: "short" });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.name);
    assert.ok(res.body.errors.email);
    assert.ok(res.body.errors.password);
  });

  test("rejects a duplicate email with 409", async () => {
    const res = await api.post("/api/auth/signup").send({ name: "Ada Again", email: "ADA@test.dev", password: "Learner123" });
    assert.equal(res.status, 409);
    assert.ok(res.body.errors.email);
  });

  test("rejects a wrong password", async () => {
    const res = await api.post("/api/auth/login").send({ email: "ada@test.dev", password: "Wrong1234" });
    assert.equal(res.status, 401);
  });
});

describe("lesson studio CRUD", () => {
  let lessonId;

  test("learners cannot open the studio", async () => {
    const res = await api.get("/api/studio/lessons").set(auth(learner));
    assert.equal(res.status, 403);
  });

  test("create: stores a lesson linked to its course", async () => {
    const res = await api.post("/api/studio/lessons").set(auth(instructor)).send(validLesson());
    assert.equal(res.status, 201);
    assert.equal(res.body.course, courseId);
    assert.equal(res.body.questions.length, 2);
    lessonId = res.body._id;
  });

  test("create: validates fields and nested questions", async () => {
    const res = await api.post("/api/studio/lessons").set(auth(instructor)).send(validLesson({
      title: "",
      slug: "Bad Slug",
      xp: 500,
      questions: [{ id: "q1", type: "mcq", prompt: "", options: ["only one"], correctIndex: 3 }],
    }));
    assert.equal(res.status, 400);
    for (const field of ["title", "slug", "xp", "questions.0.prompt", "questions.0.options"]) assert.ok(res.body.errors[field], field);
  });

  test("create: a published lesson needs questions", async () => {
    const res = await api.post("/api/studio/lessons").set(auth(instructor)).send(validLesson({ slug: "empty", questions: [] }));
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.questions);
  });

  test("create: rejects a duplicate slug", async () => {
    const res = await api.post("/api/studio/lessons").set(auth(instructor)).send(validLesson());
    assert.equal(res.status, 409);
    assert.ok(res.body.errors.slug);
  });

  test("read: searches, filters, sorts and paginates", async () => {
    const search = await api.get("/api/studio/lessons?search=torq").set(auth(instructor));
    assert.deepEqual(search.body.items.map((l) => l.slug), ["torque"]);

    const drafts = await api.get(`/api/studio/lessons?course=${courseId}&status=draft&sort=title`).set(auth(instructor));
    assert.ok(drafts.body.items.length > 0);
    assert.ok(drafts.body.items.every((l) => !l.published && l.course._id === courseId));
    const titles = drafts.body.items.map((l) => l.title);
    assert.deepEqual(titles, [...titles].sort((a, b) => a.localeCompare(b)));

    const page = await api.get("/api/studio/lessons?limit=5&page=2").set(auth(instructor));
    assert.equal(page.body.items.length, 5);
    assert.equal(page.body.page, 2);
  });

  test("read: rejects an unknown sort", async () => {
    const res = await api.get("/api/studio/lessons?sort=hack").set(auth(instructor));
    assert.equal(res.status, 400);
  });

  test("read: returns one lesson with stats, 404 for unknown ids", async () => {
    const res = await api.get(`/api/studio/lessons/${lessonId}`).set(auth(instructor));
    assert.equal(res.status, 200);
    assert.equal(res.body.course.slug, "mechanics");
    assert.equal(res.body.stats.attempts, 0);
    assert.equal((await api.get("/api/studio/lessons/not-an-id").set(auth(instructor))).status, 404);
  });

  test("published lessons appear in the learner path", async () => {
    const res = await api.get("/api/courses").set(auth(learner));
    const mechanics = res.body.find((c) => c.id === "mechanics");
    assert.ok(mechanics.nodes.some((n) => n.id === "torque"));
  });

  test("update: edits a lesson", async () => {
    const res = await api.put(`/api/studio/lessons/${lessonId}`).set(auth(instructor)).send(validLesson({ title: "Torque & Levers", xp: 40 }));
    assert.equal(res.status, 200);
    assert.equal(res.body.title, "Torque & Levers");
    assert.equal(res.body.xp, 40);
  });

  test("delete: removes the lesson, its attempts and learner progress", async () => {
    const done = await api.post("/api/lessons/torque/complete").set(auth(learner)).send({ correctCount: 2, timeSeconds: 30 });
    assert.equal(done.status, 200);
    assert.equal(done.body.xpAwarded, 30);
    assert.equal((await api.get(`/api/studio/lessons/${lessonId}`).set(auth(instructor))).body.stats.attempts, 1);

    const res = await api.delete(`/api/studio/lessons/${lessonId}`).set(auth(instructor));
    assert.equal(res.status, 200);
    assert.equal(res.body.deletedAttempts, 1);
    assert.equal((await api.get(`/api/studio/lessons/${lessonId}`).set(auth(instructor))).status, 404);
    assert.equal((await api.get("/api/lessons/torque")).status, 404);
  });
});

describe("account", () => {
  test("updates the profile with validation", async () => {
    assert.equal((await api.patch("/api/users/me").set(auth(learner)).send({ name: "A" })).status, 400);
    const res = await api.patch("/api/users/me").set(auth(learner)).send({ name: "Ada Lovelace", bio: "Hi" });
    assert.equal(res.body.name, "Ada Lovelace");
  });

  test("deleting an account requires the correct password", async () => {
    assert.equal((await api.delete("/api/users/me").set(auth(learner)).send({ password: "nope" })).status, 400);
    assert.equal((await api.delete("/api/users/me").set(auth(learner)).send({ password: "Learner123" })).status, 204);
    assert.equal((await api.get("/api/users/me").set(auth(learner))).status, 401);
  });
});

test("unknown API routes return 404 JSON", async () => {
  const res = await api.get("/api/nothing-here");
  assert.equal(res.status, 404);
  assert.match(res.body.message, /No API route/);
});
