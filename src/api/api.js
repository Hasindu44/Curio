import axios from "axios";
import { courses, lessons, leagueStandings, currentUser } from "../data/mockData";

// Flip this to false once your Express + MongoDB routes are live.
// Every function below already has the real axios call written —
// it just short-circuits to mock data for now so the frontend runs
// standalone during development.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

export const client = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT if you add real auth later
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("axiom_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function fetchCourses() {
  if (USE_MOCKS) {
    await delay(200);
    return courses;
  }
  const { data } = await client.get("/courses");
  return data;
}

export async function fetchLesson(lessonId) {
  if (USE_MOCKS) {
    await delay(200);
    return lessons[lessonId];
  }
  const { data } = await client.get(`/lessons/${lessonId}`);
  return data;
}

export async function submitLessonResult(lessonId, result) {
  if (USE_MOCKS) {
    await delay(300);
    return { ok: true, xpAwarded: result.correctCount * 10 };
  }
  const { data } = await client.post(`/lessons/${lessonId}/complete`, result);
  return data;
}

let mockResultSeen = false;
export async function fetchLeaderboard() {
  if (USE_MOCKS) {
    await delay(200);
    return { ...leagueStandings, lastResult: mockResultSeen ? null : leagueStandings.lastResult };
  }
  const { data } = await client.get("/leaderboard");
  return data;
}

export async function acknowledgeLeagueResult() {
  if (USE_MOCKS) { mockResultSeen = true; return { ok: true }; }
  const { data } = await client.post("/leagues/result/seen");
  return data;
}

export async function fetchCurrentUser() {
  if (USE_MOCKS) {
    await delay(200);
    return currentUser;
  }
  const { data } = await client.get("/users/me");
  return data;
}

export async function updateProfile(profile) {
  if (USE_MOCKS) return { ...currentUser, ...profile };
  const { data } = await client.patch("/users/me", profile);
  return data;
}

export async function saveCourseProfile(courseId, profile) {
  if (USE_MOCKS) {
    const profiles = JSON.parse(localStorage.getItem("axiom_course_profiles") || "{}");
    const next = { ...profiles, [courseId]: profile };
    localStorage.setItem("axiom_course_profiles", JSON.stringify(next));
    await delay(120);
    return next[courseId];
  }
  const { data } = await client.put(`/users/me/course-profiles/${courseId}`, profile);
  return data;
}

export async function setActiveCoursePreference(courseId) {
  if (USE_MOCKS) {
    localStorage.setItem("axiom_active_course", courseId);
    await delay(80);
    return { activeCourseId: courseId };
  }
  const { data } = await client.put("/users/me/active-course", { courseId });
  return data;
}

export async function login(email, password) {
  if (USE_MOCKS) {
    await delay(400);
    localStorage.setItem("axiom_token", "mock-token");
    return { ok: true, user: currentUser };
  }
  const { data } = await client.post("/auth/login", { email, password });
  localStorage.setItem("axiom_token", data.token);
  return data;
}

export async function signup(name, email, password) {
  if (USE_MOCKS) {
    await delay(400);
    localStorage.setItem("axiom_token", "mock-token");
    return { ok: true, user: { ...currentUser, name } };
  }
  const { data } = await client.post("/auth/signup", { name, email, password });
  localStorage.setItem("axiom_token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("axiom_token");
}
