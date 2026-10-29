import { client, tokenStore } from "./client";

export async function login(email, password) {
  const { data } = await client.post("/auth/login", { email, password });
  tokenStore.set(data.token);
  return data;
}

export async function signup(name, email, password) {
  const { data } = await client.post("/auth/signup", { name, email, password });
  tokenStore.set(data.token);
  return data;
}

export function logout() {
  tokenStore.clear();
}
