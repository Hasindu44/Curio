import mongoose from "mongoose";
import { configureDns } from "./dns.js";

export async function connectDatabase(uri) {
  configureDns();
  await mongoose.connect(uri);
  console.log(`MongoDB connected (${mongoose.connection.name})`);
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
