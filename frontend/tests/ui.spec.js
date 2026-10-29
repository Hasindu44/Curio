import { test, expect } from "@playwright/test";
import { courses, lessons, leagueStandings, currentUser } from "./fixtures/mockData.js";

const runtimeErrors = new WeakMap();
test.beforeEach(async ({ page }) => {
  runtimeErrors.set(page, []);
  page.on("pageerror", error => runtimeErrors.get(page).push(error.message));
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

async function fixtures(page, { authenticated = true, firstRun = false, dark = false, leagueResult = null } = {}) {
  const user = { ...structuredClone(currentUser), id: "ui-test", name: "Ada", activeCourseId: firstRun ? null : "calculus", courseProfiles: firstRun ? {} : { calculus: { goal: "understand", level: "familiar", pace: "10" } } };
  await page.addInitScript(({ authenticated, dark }) => {
    if (!localStorage.getItem("arcwise_theme")) localStorage.setItem("arcwise_theme", dark ? "dark" : "light");
    if (authenticated) localStorage.setItem("axiom_token", "ui-test");
  }, { authenticated, dark });
  await page.route("**/api/**", async route => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    if (!path.startsWith("/api/")) return route.continue();
    let body;
    if (path === "/api/users/me") {
      if (!authenticated) return route.fulfill({ status: 401, json: { message: "Test session signed out" } });
      if (route.request().method() === "PATCH") Object.assign(user, route.request().postDataJSON());
      body = user;
    } else if (path === "/api/courses") body = courses;
    else if (path.endsWith("/complete")) {
      const result = route.request().postDataJSON();
      user.xp += result.correctCount * 10;
      body = { ok: true, xpAwarded: result.correctCount * 10, user };
    }
    else if (path.startsWith("/api/lessons/")) body = lessons[path.split("/")[3]];
    else if (path === "/api/leaderboard") body = { ...leagueStandings, lastResult: leagueResult };
    else if (path === "/api/leagues/result/seen") { leagueResult = null; body = { ok: true }; }
    else if (path.includes("course-profiles")) { body = route.request().postDataJSON(); user.courseProfiles[path.split("/").pop()] = body; }
    else if (path.endsWith("active-course")) { body = route.request().postDataJSON(); Object.assign(user, body); }
    else body = { ok: true };
    return route.fulfill({ status: body ? 200 : 404, json: body || { message: "Lesson not found" } });
  });
}
async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  const clippedControls = await page.locator("header a, header button").evaluateAll(elements => elements.filter(el => {
    if (!el.getClientRects().length) return false;
    const rect = el.getBoundingClientRect();
    return rect.left < -1 || rect.right > window.innerWidth + 1;
  }).map(el => el.textContent));
  expect(clippedControls).toEqual([]);
  const clippedHeadings = await page.locator("h1, h2, h3").evaluateAll(elements => elements.filter(el => el.getClientRects().length && el.scrollWidth > el.clientWidth + 1).map(el => el.textContent));
  expect(clippedHeadings).toEqual([]);
}
test("landing: interactive preview and persistent theme", async ({ page }, info) => {
  await fixtures(page, { authenticated: false });
  await page.goto("/");
  await expect(page.getByRole("heading", {name: /Big ideas/})).toBeVisible();
  const slider = page.getByRole("slider", { name: "Position on the curve" });
  await slider.fill("0");
  await expect(page.getByText("That’s the turning point!")).toBeVisible();
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath("landing-light.png") });
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(await page.evaluate(()=>localStorage.getItem("arcwise_theme"))).toBe("dark");
  await page.screenshot({ path: info.outputPath("landing-dark.png") });
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("heading", { name: "What will click for you?" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("course-library.png") });
});

test("lesson: explore, answer, and finish with feedback", async ({ page }, info) => {
  await fixtures(page, { dark: true });
  await page.goto("/lesson/chain-rule");
  const probe = page.getByRole("slider", { name: /Probe position/ });
  await expect(probe).toBeVisible();
  await probe.fill("-2");
  await probe.fill("2");
  await expect(page.getByRole("button", { name: "Complete experiment" })).toBeEnabled();
  await page.screenshot({ path: info.outputPath("lesson-lab.png") });
  await page.getByRole("button", { name: "Complete experiment" }).click();
  await page.getByRole("button", { name: /Inner function/ }).click();
  await page.screenshot({ path: info.outputPath("lesson-exploration.png") });
  await page.getByRole("button", { name: /Outer function/ }).click();
  await expect(page.getByRole("button", { name: "Check", exact: true })).toBeVisible();
  await page.locator("main .panel button").nth(1).click();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByText("Nice! That's correct")).toBeVisible();
  await page.screenshot({ path: info.outputPath("lesson-feedback.png") });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("spinbutton", { name: "Your answer" }).fill("2");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("button", { name: "Move up" }).first()).toBeVisible();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "A function composed inside another function" }).click();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Lesson complete!" })).toBeVisible();
  await expect(page.getByText("100%", { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("lesson-complete.png") });
});

test("profile edits and unavailable lesson recovery", async ({ page }, info) => {
  await fixtures(page);
  await page.goto("/profile");
  await page.getByRole("button", { name: "Edit profile" }).click();
  await page.getByLabel("Display name").fill("Ada Lovelace");
  await page.getByLabel("A little about you").fill("Curious about calculus.");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("heading", { name: "Ada Lovelace", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("profile-light.png") });
  await page.goto("/leaderboard");
  await expect(page.getByRole("heading", { name: "Sapphire League" })).toBeVisible();
  await expect(page.getByText("Promotion zone", { exact: true })).toBeVisible();
  await expect(page.getByText("Demotion zone", { exact: true })).toBeVisible();
  await expect(page.getByText(/You’re in the promotion zone!/)).toBeVisible();
  await expect(page.getByText(/left$/).first()).toBeVisible();
  await page.screenshot({ path: info.outputPath("leagues-light.png") });
  await page.goto("/lesson/unavailable");
  await expect(page.getByRole("alert")).toContainText("We couldn’t open this lesson");
  await expect(page.getByRole("link", { name: "Back to learning" })).toBeVisible();
});

test("loader draws before revealing the page with motion enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await fixtures(page, { authenticated: false });
  const start = Date.now();
  await page.goto("/");
  await expect(page.getByRole("status", { name: "Preparing your learning space" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Big ideas/ })).toBeVisible();
  expect(Date.now() - start).toBeGreaterThanOrEqual(1900);
});
test("dashboard: path, guidebook, and course switching", async ({ page }, info) => {
  await fixtures(page);
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", {name: "Calculus", exact: true})).toBeVisible();
  await page.screenshot({ path: info.outputPath("dashboard-light.png") });
  await page.getByRole("button", { name: "Open unit guidebook" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open unit guidebook" })).toBeFocused();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.screenshot({ path: info.outputPath("dashboard-dark.png") });
  await page.getByRole("button", { name: "Switch course" }).click();
  await page.screenshot({ path: info.outputPath("course-picker.png") });
  await page.getByRole("button", { name: /Algorithms Patterns/ }).click();
  for (const label of ["Build real intuition", "A little familiar", "10 minutes"]) {
    await page.getByRole("button", { name: new RegExp(label) }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await page.getByRole("button", { name: "Start this course" }).click();
  await expect(page.getByRole("heading", { name: "Algorithms", exact: true })).toBeVisible();
  await noOverflow(page);
});
test("first run: choose a course and create a path", async ({ page }, info) => {
  await fixtures(page, {firstRun: true});
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", {name:"What will you understand next?"})).toBeVisible();
  await page.screenshot({path:info.outputPath("first-run.png")});
  await page.getByRole("button",{name:/Calculus Rates/}).click();
  for (const label of ["Build real intuition", "Brand new", "5 minutes"]) {
    await page.getByRole("button",{name:new RegExp(label)}).click();
    await page.getByRole("button",{name:"Continue",exact:true}).click();
  }
  await page.getByRole("button",{name:"Start this course"}).click();
  await expect(page.getByRole("heading",{name:"Calculus",exact:true})).toBeVisible();
});
test("mobile: no horizontal overflow across the main screens", async ({ page }, info) => {
  await page.setViewportSize({width:390,height:844});
  await fixtures(page, {dark:true});
  for (const path of ["/", "/dashboard", "/leaderboard", "/profile", "/lesson/chain-rule"]) {
    await page.goto(path);
    await expect(page.locator('[role="status"][aria-label="Preparing your learning space"]')).toHaveCount(0);
    await expect(page.locator("h1, h2, [aria-label='Exit lesson']").first()).toBeVisible();
    await noOverflow(page);
    await page.screenshot({path:info.outputPath(`mobile-${path.replaceAll("/", "-") || "home"}.png`)});
    if (["/dashboard","/profile","/leaderboard"].includes(path)) await expect(page.getByRole("navigation",{name:"Mobile navigation"})).toBeVisible();
  }
});
test("narrow phone and tablet layouts keep controls readable", async ({ page }) => {
  await fixtures(page);
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/dashboard", "/leaderboard", "/profile"]) {
      await page.goto(path);
      await expect(page.locator("h1").first()).toBeVisible();
      await noOverflow(page);
    }
  }
});

test("authentication forms match the theme and have accessible fields", async ({ page }, info) => {
  await fixtures(page,{authenticated:false,dark:true});
  await page.goto("/signup");
  await expect(page.getByLabel("Name",{exact:true})).toBeVisible();
  await expect(page.getByLabel("Email",{exact:true})).toBeVisible();
  await expect(page.getByLabel("Password",{exact:true})).toBeVisible();
  await page.screenshot({path:info.outputPath("signup-dark.png")});
  await page.goto("/login");
  await expect(page.getByRole("heading",{name:"Welcome back"})).toBeVisible();
  await page.screenshot({path:info.outputPath("login-dark.png")});
});

test("leagues: weekly result is shown once, then standings", async ({ page }) => {
  await fixtures(page, { leagueResult: { outcome: "promoted", fromTier: 2, toTier: 3, rank: 2 } });
  await page.goto("/leaderboard");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "You’ve been promoted!" })).toBeVisible();
  await expect(dialog.getByText("You finished #2 and advanced to the Sapphire League.")).toBeVisible();
  await dialog.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Sapphire League" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
