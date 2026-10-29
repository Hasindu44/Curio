import { leagueView } from "../services/league.service.js";

// The public shape of a user. Never includes the password hash.
export function userView(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
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
    completedLessons: user.completedLessons,
    totalStudySeconds: user.totalStudySeconds,
    league: leagueView(user),
    joined: user.createdAt,
    badges: user.badges,
  };
}
