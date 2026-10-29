import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const signToken = (user) => jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: "7d" });

const bearer = (req) => req.headers.authorization?.replace(/^Bearer\s+/i, "");

async function userFromToken(token) {
  const payload = jwt.verify(token, env.jwtSecret);
  return User.findById(payload.sub);
}

export async function requireAuth(req, _res, next) {
  const token = bearer(req);
  if (!token) throw ApiError.unauthorized();
  let user;
  try { user = await userFromToken(token); }
  catch { throw ApiError.unauthorized("Your session is invalid or expired"); }
  if (!user) throw ApiError.unauthorized("Account not found");
  req.user = user;
  next();
}

// Attaches req.user when a valid token is sent, but never rejects the request.
export async function optionalAuth(req, _res, next) {
  const token = bearer(req);
  if (token) {
    try { req.user = await userFromToken(token); } catch { /* treat as signed out */ }
  }
  next();
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) throw ApiError.forbidden("Only instructors can manage lessons");
    next();
  };
}
