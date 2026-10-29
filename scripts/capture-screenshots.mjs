// Runs the full stack against a throwaway in-memory MongoDB, walks through
// the main flows in a browser and saves screenshots to docs/screenshots.
// Usage: node scripts/capture-screenshots.mjs
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { MongoMemoryServer } from "mongodb-memory-server";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "docs", "screenshots");
fs.mkdirSync(out, { recursive: true });
const WEB = "http://127.0.0.1:5190";

const mongo = await MongoMemoryServer.create();
const children = [];
const run = (cmd, args, cwd, env = {}) => {
  const child = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, shell: true, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.on("data", (d) => process.stdout.write(`[${path.basename(cwd)}] ${d}`));
  child.stderr.on("data", (d) => process.stderr.write(`[${path.basename(cwd)}] ${d}`));
  children.push(child);
};
async function waitFor(url) {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(url)).ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

run("node", ["src/server.js"], path.join(root, "backend"), {
  MONGODB_URI: mongo.getUri("curio"), PORT: "4000", DNS_SERVERS: "",
  INSTRUCTOR_EMAIL: "instructor@curio.dev", INSTRUCTOR_PASSWORD: "Instructor123",
});
run("npx", ["vite", "--host", "127.0.0.1", "--port", "5190", "--strictPort"], path.join(root, "frontend"));

const browser = await chromium.launch({ channel: process.platform === "win32" ? "msedge" : undefined });
try {
  await waitFor("http://127.0.0.1:4000/api/health");
  await waitFor(WEB);
  const context = await browser.newContext({ viewport: { width: 1366, height: 860 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (e) => { throw e; });
  const shot = (name, opts = {}) => page.screenshot({ path: path.join(out, `${name}.png`), ...opts });
  // Fixed sidebars look misplaced in full-page captures, so grow the window.
  async function tallShot(name) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: 1366, height });
    await shot(name);
    await page.setViewportSize({ width: 1366, height: 860 });
  }

  // Learner: sign up with validation, build a path, open a lesson.
  await page.goto(`${WEB}/signup`);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByText("Name must be at least 2 characters").waitFor();
  await shot("01-signup-validation");
  await page.getByLabel("Name", { exact: true }).fill("Nimal Perera");
  await page.getByLabel("Email", { exact: true }).fill("nimal@example.com");
  await page.getByLabel("Password", { exact: true }).fill("Learner123");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("heading", { name: "What will you understand next?" }).waitFor();
  await page.getByRole("button", { name: /Calculus Rates/ }).click();
  for (const label of ["Build real intuition", "Brand new", "10 minutes"]) {
    await page.getByRole("button", { name: new RegExp(label) }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await page.getByRole("button", { name: "Start this course" }).click();
  await page.getByRole("heading", { name: "Calculus", exact: true }).waitFor();
  await page.waitForTimeout(400);
  await shot("02-dashboard");
  await page.goto(`${WEB}/lesson/chain-rule`);
  await page.getByRole("slider", { name: /Probe position/ }).waitFor();
  await shot("03-lesson");
  await page.goto(`${WEB}/profile`);
  await page.getByRole("heading", { name: "Account" }).scrollIntoViewIfNeeded();
  await shot("04-profile");
  await page.getByRole("button", { name: "Log out" }).last().click();

  // Instructor: Lesson Studio CRUD.
  await page.getByLabel("Email", { exact: true }).fill("instructor@curio.dev");
  await page.getByLabel("Password", { exact: true }).fill("Instructor123");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByText("44 lessons").waitFor();
  await shot("05-studio-list");
  await page.getByLabel("Course", { exact: true }).selectOption({ label: "Calculus" });
  await page.getByLabel("Sort by").selectOption("-xp");
  await page.getByText("7 lessons match your filters").waitFor();
  await shot("06-studio-filter-sort");

  await page.getByRole("link", { name: "New lesson" }).click();
  await page.getByLabel("Published").check();
  await page.getByRole("button", { name: "Create lesson" }).click();
  await page.getByText("Title must be at least 3 characters").waitFor();
  await shot("07-studio-create-validation");
  await page.getByLabel("Title").fill("Torque and Levers");
  await page.getByLabel("Summary (optional)").fill("Why a longer wrench makes a stubborn bolt easier to turn.");
  await page.getByLabel("Course", { exact: true }).selectOption({ label: "Classical Mechanics" });
  await page.getByLabel("Difficulty").selectOption("intermediate");
  await page.getByLabel("XP reward").fill("30");
  await page.getByRole("button", { name: "+ Multiple choice" }).click();
  await page.getByLabel("Prompt").fill("Torque is the force multiplied by…");
  await page.getByLabel("Option 1", { exact: true }).fill("The lever arm distance");
  await page.getByLabel("Option 2", { exact: true }).fill("The object's mass");
  await page.getByRole("button", { name: "+ Number answer" }).click();
  await page.getByLabel("Prompt").nth(1).fill("A 5 N force acts 2 m from the pivot. What is the torque in N·m?");
  await page.getByLabel("Correct answer").fill("10");
  await tallShot("08-studio-create-form");
  await page.getByRole("button", { name: "Create lesson" }).click();
  await page.getByText("Lesson created.").waitFor();
  await tallShot("09-studio-detail");

  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await page.getByLabel("Title").fill("Torque & Levers");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByText("Changes saved.").waitFor();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await shot("10-studio-delete-confirm");
  await page.getByRole("dialog").getByRole("button", { name: "Delete lesson" }).click();
  await page.getByText("Deleted “Torque & Levers”.").waitFor();

  // Mobile layouts.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${WEB}/studio`);
  await page.getByText("44 lessons").waitFor();
  await shot("11-mobile-studio");
  await page.goto(`${WEB}/profile`);
  await page.getByRole("button", { name: "Log out" }).last().click();
  await page.getByLabel("Email", { exact: true }).fill("nimal@example.com");
  await page.getByLabel("Password", { exact: true }).fill("Learner123");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByRole("heading", { name: /ready to learn/ }).waitFor();
  await shot("12-mobile-dashboard");
  console.log(`Screenshots saved to ${out}`);
} catch (error) {
  const [page] = browser.contexts()[0]?.pages() ?? [];
  if (page) { await page.screenshot({ path: path.join(out, "failure.png") }); console.error("Failed on", page.url()); }
  throw error;
} finally {
  await browser.close();
  for (const child of children) {
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
    else child.kill();
  }
  await mongo.stop();
}
