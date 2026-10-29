import User from "../models/User.js";

// Ten-tier weekly ladder. Each week learners compete in a cohort of up to 30
// people in their tier; the top finishers move up and the bottom ones move down.
export const TIERS = [
  { id: "bronze", name: "Bronze", color: "#CD7F4E" },
  { id: "silver", name: "Silver", color: "#AEBBC6" },
  { id: "gold", name: "Gold", color: "#FFC21A" },
  { id: "sapphire", name: "Sapphire", color: "#1E9BF0" },
  { id: "ruby", name: "Ruby", color: "#F0384B" },
  { id: "emerald", name: "Emerald", color: "#2BC56B" },
  { id: "amethyst", name: "Amethyst", color: "#A560F0" },
  { id: "pearl", name: "Pearl", color: "#F2B8D2" },
  { id: "obsidian", name: "Obsidian", color: "#3A3F55" },
  { id: "diamond", name: "Diamond", color: "#4FD8F0" },
].map((tier, index) => ({ ...tier, index }));

export const COHORT_SIZE = 30;
const PROMOTE = 7;
const DEMOTE = 5;

// Weeks run Monday 00:00 UTC to the following Monday.
export function weekBounds(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  const endsAt = new Date(start);
  endsAt.setUTCDate(endsAt.getUTCDate() + 7);
  return { id: start.toISOString().slice(0, 10), endsAt };
}

// No promotion out of the top tier and no demotion out of the bottom one.
// Small cohorts skip demotion so a handful of learners are not punished.
export function zonesFor(tier, size) {
  return {
    promote: tier >= TIERS.length - 1 ? 0 : PROMOTE,
    demote: tier === 0 || size <= PROMOTE + DEMOTE ? 0 : DEMOTE,
  };
}

export function leagueView(user) {
  const league = user.league ?? {};
  const tier = Math.min(TIERS.length - 1, Math.max(0, league.tier ?? 0));
  const week = weekBounds();
  const joined = league.weekId === week.id;
  return { ...TIERS[tier], tier, points: joined ? league.weeklyXp : 0, joined, weekEndsAt: week.endsAt };
}

// Settle a finished week lazily, the first time the learner is seen afterwards.
// Learners who already settled keep a `lastWeek` snapshot so later settlers
// still rank against the full cohort.
export async function settleLeague(user) {
  const league = user.league;
  const current = weekBounds().id;
  if (!league?.weekId || league.weekId === current) return false;
  const { weekId, tier, cohort, weeklyXp } = league;
  const peers = await User.find({ $or: [
    { "league.weekId": weekId, "league.tier": tier, "league.cohort": cohort },
    { "league.lastWeek.weekId": weekId, "league.lastWeek.tier": tier, "league.lastWeek.cohort": cohort },
  ] }).select("league");
  const standings = peers
    .map((peer) => ({ id: peer._id.toString(), xp: peer.league.weekId === weekId ? peer.league.weeklyXp : peer.league.lastWeek.xp }))
    .sort((a, b) => b.xp - a.xp || a.id.localeCompare(b.id));
  const rank = standings.findIndex((row) => row.id === user._id.toString()) + 1 || standings.length;
  const { promote, demote } = zonesFor(tier, standings.length);
  let outcome = "stayed";
  if (rank <= promote && weeklyXp > 0) outcome = "promoted";
  else if (demote && rank > standings.length - demote) outcome = "demoted";
  const toTier = tier + (outcome === "promoted" ? 1 : outcome === "demoted" ? -1 : 0);
  league.lastWeek = { weekId, tier, cohort, xp: weeklyXp };
  league.lastResult = { weekId, outcome, fromTier: tier, toTier, rank, seen: false };
  league.tier = toTier;
  league.weekId = null;
  league.cohort = null;
  league.weeklyXp = 0;
  user.markModified("league");
  return true;
}

// A learner enters this week's competition with their first XP of the week.
export async function joinLeague(user) {
  const current = weekBounds().id;
  if (user.league.weekId === current) return;
  const already = await User.countDocuments({ "league.weekId": current, "league.tier": user.league.tier });
  user.league.weekId = current;
  user.league.cohort = Math.floor(already / COHORT_SIZE);
  user.league.weeklyXp = 0;
  user.markModified("league");
}

export async function standingsFor(user) {
  const league = user.league;
  const week = weekBounds();
  const joined = league.weekId === week.id;
  const rows = joined
    ? (await User.find({ "league.weekId": week.id, "league.tier": league.tier, "league.cohort": league.cohort }).sort({ "league.weeklyXp": -1, _id: 1 }).limit(COHORT_SIZE))
      .map((person, index) => ({ rank: index + 1, name: person.name, xp: person.league.weeklyXp, streak: person.streak.current, isYou: person._id.equals(user._id), avatarStyle: person.avatarStyle }))
    : [];
  const result = league.lastResult?.seen === false ? league.lastResult : null;
  return {
    week: { id: week.id, endsAt: week.endsAt },
    tiers: TIERS,
    league: leagueView(user),
    joined,
    cohortSize: COHORT_SIZE,
    zones: zonesFor(league.tier, rows.length),
    rows,
    lastResult: result && { outcome: result.outcome, fromTier: result.fromTier, toTier: result.toTier, rank: result.rank },
  };
}
