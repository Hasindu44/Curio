import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(ApiError.notFound(`No API route for ${req.method} ${req.originalUrl}`));
}

// Every error ends up here, so clients always receive { message, errors? }.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, _req, res, _next) {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message, ...(error.errors && { errors: error.errors }) });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "The request body is not valid JSON" });
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.fromEntries(Object.entries(error.errors).map(([path, detail]) => [path, detail.message]));
    return res.status(400).json({ message: "Please fix the highlighted fields", errors });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Invalid value for ${error.path}` });
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue ?? {})[0] ?? "value";
    return res.status(409).json({ message: `That ${field} is already in use`, errors: { [field]: `That ${field} is already in use` } });
  }
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server" });
}
