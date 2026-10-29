import { leagueView } from "./leagues.js";

export function userView(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatarStyle: user.avatarStyle,
    xp: user.xp,
    gems: user.gems,
    streak: user.streak.current,
    longestStreak: user.streak.longest,
    hearts: user.hearts.current,
    maxHearts: user.hearts.max,
    activeCourseId: user.activeCourseId,
    courseProfiles: Object.fromEntries(user.courseProfiles ?? []),
    lessonProgress: user.lessonProgress,
    completedLessons: user.completedLessons,
    totalStudySeconds: user.totalStudySeconds,
    league: leagueView(user),
    joined: user.createdAt,
    badges: user.badges,
  };
}
