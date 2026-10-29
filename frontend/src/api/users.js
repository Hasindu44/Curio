import { client, tokenStore } from "./client";

export async function fetchCurrentUser() {
  if (!tokenStore.get()) return null;
  const { data } = await client.get("/users/me");
  return data;
}

export async function updateProfile(profile) {
  const { data } = await client.patch("/users/me", profile);
  return data;
}

export async function deleteAccount(password) {
  await client.delete("/users/me", { data: { password } });
  tokenStore.clear();
}

export async function saveCourseProfile(courseId, profile) {
  const { data } = await client.put(`/users/me/course-profiles/${courseId}`, profile);
  return data;
}

export async function setActiveCoursePreference(courseId) {
  const { data } = await client.put("/users/me/active-course", { courseId });
  return data;
}
