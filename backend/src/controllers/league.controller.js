import { TIERS, leagueView, settleLeague, standingsFor } from "../services/league.service.js";

export async function getLeague(req, res) {
  if (await settleLeague(req.user)) await req.user.save();
  res.json({ tiers: TIERS, current: leagueView(req.user) });
}

export async function getLeaderboard(req, res) {
  if (await settleLeague(req.user)) await req.user.save();
  res.json(await standingsFor(req.user));
}

// The end-of-week result is shown once; this marks it as seen.
export async function markResultSeen(req, res) {
  if (req.user.league?.lastResult) {
    req.user.league.lastResult = { ...req.user.league.lastResult, seen: true };
    req.user.markModified("league");
    await req.user.save();
  }
  res.json({ ok: true });
}
