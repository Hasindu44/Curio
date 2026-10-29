import { client } from "./client";

export async function fetchCourses() {
  const { data } = await client.get("/courses");
  return data;
}
