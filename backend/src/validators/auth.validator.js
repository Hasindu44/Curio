import { z } from "zod";

const email = z.string({ error: "Email is required" }).trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const signupSchema = z.object({
  name: z.string({ error: "Name is required" }).trim().min(2, "Name must be at least 2 characters").max(60, "Name must be 60 characters or fewer"),
  email,
  password: z.string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer")
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email,
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});
