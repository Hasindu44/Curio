import { test, expect } from "@playwright/test";
import { courses, lessons, currentUser } from "./fixtures/mockData.js";

// Lesson Studio CRUD against a small in-memory stand-in for the API.
const runtimeErrors = new WeakMap();
test.beforeEach(async ({ page }) => {
  runtimeErrors.set(page, []);
  page.on("pageerror", error => runtimeErrors.get(page).push(error.message));
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

const accents = { amber: "amber", teal: "teal", violet: "violet" };
function buildCatalog() {
  const studioCourses = courses.map((course, index) => ({ _id: `c${String(index).padStart(23, "0")}`, slug: course.id, title: course.title, accent: accents[course.accent], icon: course.icon, published: true, lessonCount: course.nodes.length }));
  let n = 0;
  const rows = courses.flatMap((course, ci) => course.nodes.map((node, i) => {
    const content = lessons[node.id];
    n += 1;
    return {
      _id: `l${String(n).padStart(23, "0")}`, slug: node.id, title: node.title, summary: "", course: studioCourses[ci], order: i + 1, xp: node.xp,
      difficulty: ["beginner", "beginner", "intermediate", "intermediate", "advanced", "advanced", "advanced"][i], estimatedMinutes: 5,
      published: Boolean(content), questions: content?.questions ?? [], createdAt: "2026-10-01T00:00:00Z", updatedAt: new Date(Date.UTC(2026, 9, 1 + n)).toISOString(),
    };
  }));
  return { studioCourses, rows };
}

async function studio(page, { dark = false } = {}) {
  const { studioCourses, rows } = buildCatalog();
  const user = { ...structuredClone(currentUser), id: "teacher", name: "Iris", role: "instructor", activeCourseId: "calculus", courseProfiles: { calculus: { goal: "understand", level: "familiar", pace: "10" } } };
  await page.addInitScript(({ dark }) => {
    if (!localStorage.getItem("arcwise_theme")) localStorage.setItem("arcwise_theme", dark ? "dark" : "light");
    localStorage.setItem("axiom_token", "ui-test");
  }, { dark });
  await page.route("**/api/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    // Vite serves source files like /src/api/studio.js; only mock the API.
    if (!path.startsWith("/api/")) return route.continue();
    const method = request.method();
    const json = (body, status = 200) => route.fulfill({ status, json: body });
    if (path === "/api/users/me") return json(user);
    if (path === "/api/courses") return json(courses);
    if (path === "/api/studio/courses") return json(studioCourses);
    if (path === "/api/studio/lessons" && method === "GET") {
      const q = Object.fromEntries(url.searchParams);
      let items = rows.filter(row =>
        (!q.search || `${row.title} ${row.slug}`.toLowerCase().includes(q.search.toLowerCase())) &&
        (!q.course || row.course._id === q.course) &&
        (!q.status || row.published === (q.status === "published")) &&
        (!q.difficulty || row.difficulty === q.difficulty));
      if (q.sort === "title") items.sort((a, b) => a.title.localeCompare(b.title));
      else if (q.sort === "-xp") items.sort((a, b) => b.xp - a.xp);
      else items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      const page = Number(q.page || 1), limit = Number(q.limit || 10);
      return json({ items: items.slice((page - 1) * limit, page * limit).map(row => ({ ...row, questionCount: row.questions.length })), page, limit, total: items.length, totalPages: Math.max(1, Math.ceil(items.length / limit)) });
    }
    if (path === "/api/studio/lessons" && method === "POST") {
      const body = request.postDataJSON();
      if (rows.some(row => row.slug === body.slug)) return json({ message: "That URL slug is already used by another lesson", errors: { slug: "That URL slug is already used by another lesson" } }, 409);
      const row = { ...body, _id: `n${String(rows.length).padStart(23, "0")}`, course: studioCourses.find(c => c._id === body.course), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      rows.push(row);
      return json(row, 201);
    }
    const match = path.match(/^\/api\/studio\/lessons\/(\w+)$/);
    if (match) {
      const index = rows.findIndex(row => row._id === match[1]);
      if (index < 0) return json({ message: "Lesson not found" }, 404);
      if (method === "GET") return json({ ...rows[index], createdBy: { name: "Iris" }, stats: { attempts: 12, learners: 9, avgAccuracy: 84, avgSeconds: 190 } });
      if (method === "PUT") { const body = request.postDataJSON(); rows[index] = { ...rows[index], ...body, course: studioCourses.find(c => c._id === body.course), updatedAt: new Date().toISOString() }; return json(rows[index]); }
      if (method === "DELETE") { rows.splice(index, 1); return json({ ok: true, deletedAttempts: 0 }); }
    }
    return json({ ok: true });
  });
}

test("studio: list, search, filter, sort and paginate lessons", async ({ page }, info) => {
  await studio(page);
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: "Lessons", exact: true })).toBeVisible();
  await expect(page.getByText("43 lessons")).toBeVisible();
  await page.screenshot({ path: info.outputPath("studio-list.png") });
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Page 2 of 5")).toBeVisible();

  await page.getByLabel("Course", { exact: true }).selectOption({ label: "Calculus" });
  await page.getByLabel("Status").selectOption("published");
  await expect(page.getByText("1 lesson matches your filters")).toBeVisible();
  await expect(page).toHaveURL(/status=published/);
  await page.getByRole("button", { name: "Clear filters" }).click();

  await page.getByLabel("Search", { exact: true }).fill("vect");
  await expect(page.getByText("2 lessons match your filters")).toBeVisible();
  await expect(page.getByRole("link", { name: "Vectors", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("studio-search.png") });
  await page.getByLabel("Search", { exact: true }).fill("zzz");
  await expect(page.getByRole("heading", { name: "No lessons match" })).toBeVisible();
});

test("studio: create a lesson with validation", async ({ page }, info) => {
  await studio(page);
  await page.goto("/studio/lessons/new");
  await page.getByLabel("Published").check();
  await page.getByRole("button", { name: "Create lesson" }).click();
  await expect(page.getByRole("alert").first()).toContainText("Please fix");
  await expect(page.getByText("Title must be at least 3 characters")).toBeVisible();
  await expect(page.getByText("Choose a course", { exact: true })).toBeVisible();
  await expect(page.getByText("Add at least one question before publishing")).toBeVisible();
  await page.screenshot({ path: info.outputPath("studio-validation.png"), fullPage: true });

  await page.getByLabel("Title").fill("Torque and Levers");
  await expect(page.getByLabel("URL slug")).toHaveValue("torque-and-levers");
  await page.getByLabel("Course", { exact: true }).selectOption({ label: "Classical Mechanics" });
  await expect(page.getByLabel("Position in course")).toHaveValue("7");
  await page.getByLabel("Difficulty").selectOption("intermediate");
  await page.getByRole("button", { name: "+ Multiple choice" }).click();
  await page.getByLabel("Prompt").fill("Torque is force multiplied by…");
  await page.getByLabel("Option 1", { exact: true }).fill("The lever arm");
  await page.getByLabel("Option 2", { exact: true }).fill("The mass");
  await page.getByRole("button", { name: "+ Number answer" }).click();
  await page.getByLabel("Prompt").nth(1).fill("A 5 N force acts 2 m from the pivot. Torque in N·m?");
  await page.getByLabel("Correct answer").fill("10");
  await page.screenshot({ path: info.outputPath("studio-create.png"), fullPage: true });
  await page.getByRole("button", { name: "Create lesson" }).click();

  await expect(page.getByText("Lesson created.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Torque and Levers" })).toBeVisible();
  await expect(page.getByText("The lever arm")).toBeVisible();
  await page.screenshot({ path: info.outputPath("studio-detail.png"), fullPage: true });
});

test("studio: duplicate slug error from the server is shown on the field", async ({ page }) => {
  await studio(page);
  await page.goto("/studio/lessons/new");
  await page.getByLabel("Title").fill("Chain Rule");
  await page.getByLabel("Course", { exact: true }).selectOption({ label: "Calculus" });
  await page.getByRole("button", { name: "Create lesson" }).click();
  await expect(page.getByText("That URL slug is already used by another lesson").first()).toBeVisible();
  await expect(page.getByLabel("URL slug")).toHaveAttribute("aria-invalid", "true");
});

test("studio: edit then delete a lesson", async ({ page }, info) => {
  await studio(page, { dark: true });
  await page.goto("/studio?search=vectors");
  await page.getByRole("link", { name: "Edit Vectors" }).click();
  await expect(page.getByRole("heading", { name: "Edit lesson" })).toBeVisible();
  await expect(page.getByLabel("Title")).toHaveValue("Vectors");
  await page.getByLabel("Title").fill("Vectors and Arrows");
  await page.getByLabel("XP reward").fill("500");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("XP must be a whole number from 5 to 100")).toBeVisible();
  await page.getByLabel("XP reward").fill("30");
  await page.screenshot({ path: info.outputPath("studio-edit-dark.png"), fullPage: true });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Changes saved.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vectors and Arrows" })).toBeVisible();

  await page.getByRole("button", { name: "Delete", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Vectors and Arrows");
  await page.screenshot({ path: info.outputPath("studio-delete-dark.png") });
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete lesson" }).click();
  await expect(page.getByText("Deleted “Vectors and Arrows”.")).toBeVisible();
  await expect(page.getByText("42 lessons")).toBeVisible();
});

test("studio: learners are redirected away and do not see the link", async ({ page }) => {
  await studio(page);
  await page.route("**/api/users/me", route => route.fulfill({ json: { ...currentUser, role: "learner", activeCourseId: "calculus", courseProfiles: { calculus: { goal: "understand", level: "new", pace: "5" } } } }));
  await page.goto("/studio");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("link", { name: "Studio" })).toHaveCount(0);
});

test("studio: mobile layout uses cards without overflow", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await studio(page);
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: "Lessons", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Studio" })).toBeVisible();
  await page.screenshot({ path: info.outputPath("studio-mobile.png") });
});
