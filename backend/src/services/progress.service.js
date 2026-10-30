import Attempt from "../models/Attempt.js";
import { joinLeague, settleLeague } from "./league.service.js";

const HEART_REFILL_MS = 5 * 60 * 1000;
const DAY_MS = 86400000;

// Builds a course's learning path from its lessons. A published lesson is
// "active" once every published lesson before it is complete; drafts always
// show as locked and are flagged so the path can mark them "coming soon".
export function buildPath(lessons, completedIds) {
  let unlocked = true;
  return lessons.map((lesson) => {
    const node = {
      id: lesson.slug, title: lesson.title, xp: lesson.xp, summary: lesson.summary ?? "",
      difficulty: lesson.difficulty, minutes: lesson.estimatedMinutes, questionCount: lesson.questionCount ?? 0,
    };
    if (!lesson.published) return { ...node, status: "locked", draft: true };
    if (completedIds.has(lesson._id.toString())) return { ...node, status: "completed" };
    const status = unlocked ? "active" : "locked";
    unlocked = false;
    return { ...node, status };
  });
}

function updateStreak(user, now) {
  const today = now.toISOString().slice(0, 10);
  const previous = user.streak.lastActivityAt?.toISOString().slice(0, 10);
  if (previous === today) return;
  const gapDays = user.streak.lastActivityAt ? Math.floor((now - user.streak.lastActivityAt) / DAY_MS) : 1;
  user.streak.current = gapDays <= 1 ? user.streak.current + 1 : 1;
  user.streak.longest = Math.max(user.streak.longest, user.streak.current);
  user.streak.lastActivityAt = now;
}

function awardBadges(user, { firstCompletion, perfect }) {
  const has = (id) => user.badges.some((badge) => badge.id === id);
  if (firstCompletion && user.completedLessons === 1 && !has("first-lesson")) user.badges.push({ id: "first-lesson", label: "First Lesson", icon: "★" });
  if (perfect && !has("perfect")) user.badges.push({ id: "perfect", label: "Perfect Lesson", icon: "✓" });
}

// Applies a finished lesson run to the learner: XP, hearts, streak, league
// points, badges and per-lesson progress. Also records an Attempt.
export async function recordCompletion(user, lesson, { correctCount, timeSeconds }) {
  const now = new Date();
  const total = lesson.questions.length;
  const correct = Math.min(total, correctCount);
  const perfect = correct === total;
  const accuracy = Math.round((correct / total) * 100);
  const xpAwarded = correct * 10 + (perfect ? 10 : 0);

  const progress = user.lessonProgress.find((item) => item.lesson.equals(lesson._id));
  const firstCompletion = progress?.status !== "completed";
  if (progress) {
    progress.status = "completed";
    progress.attempts += 1;
    progress.bestAccuracy = Math.max(progress.bestAccuracy, accuracy);
    progress.bestTimeSeconds = progress.bestTimeSeconds ? Math.min(progress.bestTimeSeconds, timeSeconds || progress.bestTimeSeconds) : timeSeconds;
    progress.completedAt = now;
  } else {
    user.lessonProgress.push({ lesson: lesson._id, course: lesson.course, status: "completed", attempts: 1, bestAccuracy: accuracy, bestTimeSeconds: timeSeconds, completedAt: now });
  }

  user.xp += xpAwarded;
  await settleLeague(user);
  if (xpAwarded > 0) {
    await joinLeague(user);
    user.league.weeklyXp += xpAwarded;
  }
  if (perfect) user.gems += 5;

  const wrong = total - correct;
  user.hearts.current = Math.max(0, user.hearts.current - wrong);
  if (wrong > 0 && !user.hearts.nextRefillAt) user.hearts.nextRefillAt = new Date(now.getTime() + HEART_REFILL_MS);

  user.totalStudySeconds += timeSeconds;
  if (firstCompletion) user.completedLessons += 1;
  updateStreak(user, now);
  awardBadges(user, { firstCompletion, perfect });

  await Promise.all([
    user.save(),
    Attempt.create({ user: user._id, lesson: lesson._id, course: lesson.course, correctCount: correct, total, accuracy, timeSeconds, xpAwarded }),
  ]);
  return { xpAwarded };
}
