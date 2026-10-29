import bcrypt from "bcryptjs";
import { signToken } from "../middleware/auth.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { userView } from "../utils/userView.js";

export async function signup(req, res) {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) {
    throw ApiError.conflict("An account already uses that email", { email: "An account already uses that email" });
  }
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  res.status(201).json({ token: signToken(user), user: userView(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw ApiError.unauthorized("Invalid email or password");
  }
  res.json({ token: signToken(user), user: userView(user) });
}
