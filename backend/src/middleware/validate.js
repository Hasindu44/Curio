import { ApiError } from "../utils/ApiError.js";

// Turns zod issues into { "questions.0.prompt": "Prompt is required" }.
export function fieldErrors(issues) {
  const errors = {};
  for (const issue of issues) {
    const key = issue.path.join(".") || "_form";
    errors[key] ??= issue.message;
  }
  return errors;
}

// Validates and replaces req.body (or req.query) with the parsed, trimmed data.
export function validate(schema, source = "body") {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) throw ApiError.badRequest("Please fix the highlighted fields", fieldErrors(result.error.issues));
    if (source === "query") req.validatedQuery = result.data;
    else req[source] = result.data;
    next();
  };
}
