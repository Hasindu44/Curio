import { client } from "./client";

// Lesson Studio (instructor only): create, read, update and delete lessons.

export async function fetchStudioCourses() {
  const { data } = await client.get("/studio/courses");
  return data;
}

export async function fetchLessons(params) {
  const { data } = await client.get("/studio/lessons", { params });
  return data;
}

export async function fetchLessonById(id) {
  const { data } = await client.get(`/studio/lessons/${id}`);
  return data;
}

export async function createLesson(lesson) {
  const { data } = await client.post("/studio/lessons", lesson);
  return data;
}

export async function updateLesson(id, lesson) {
  const { data } = await client.put(`/studio/lessons/${id}`, lesson);
  return data;
}

export async function deleteLesson(id) {
  const { data } = await client.delete(`/studio/lessons/${id}`);
  return data;
}
