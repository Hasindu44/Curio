import { client } from "./client";

export async function fetchLeaderboard() {
  const { data } = await client.get("/leaderboard");
  return data;
}

export async function acknowledgeLeagueResult() {
  const { data } = await client.post("/leagues/result/seen");
  return data;
}
