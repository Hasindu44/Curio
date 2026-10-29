import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name must be 60 characters or fewer").optional(),
  bio: z.string().trim().max(180, "Bio must be 180 characters or fewer").optional(),
  avatarStyle: z.string().trim().max(30).optional(),
}).refine((data) => Object.keys(data).length > 0, { error: "Send at least one field to update" });

export const deleteAccountSchema = z.object({
  password: z.string({ error: "Enter your password to confirm" }).min(1, "Enter your password to confirm"),
});

export const courseProfileSchema = z.object({
  goal: z.enum(["understand", "exam", "apply"], { error: "Choose a goal" }),
  level: z.enum(["new", "familiar", "confident"], { error: "Choose a level" }),
  pace: z.enum(["5", "10", "15"], { error: "Choose a daily pace" }).default("10"),
});

export const activeCourseSchema = z.object({
  courseId: z.string({ error: "courseId is required" }).trim().min(1, "courseId is required"),
});
