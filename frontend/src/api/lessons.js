import { client } from "./client";

export async function fetchLesson(slug) {
  const { data } = await client.get(`/lessons/${slug}`);
  return data;
}

export async function submitLessonResult(slug, result) {
  const { data } = await client.post(`/lessons/${slug}/complete`, result);
  return data;
}
