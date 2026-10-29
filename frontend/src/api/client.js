import axios from "axios";

const TOKEN_KEY = "axiom_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// All requests go to /api; Vite proxies that to the Express server in dev.
export const client = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// The API always answers errors with { message, errors? }.
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ECONNABORTED" || !error?.response) return "Can’t reach the server. Check your connection and try again.";
  return fallback;
}

export function fieldErrors(error) {
  return error?.response?.data?.errors ?? {};
}
