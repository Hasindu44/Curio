import mongoose from "mongoose";
import { configureDns } from "./dns.js";

export async function connectDatabase(uri) {
  configureDns();
  await mongoose.connect(uri);
  console.log(`MongoDB connected (${mongoose.connection.name})`);
}

// Why the last start-up failed, shown by GET /api/health.
let startupError = null;

export function setStartupError(message) {
  startupError = message;
}

export function getStartupError() {
  return startupError;
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
