// Mirrors server/lib/leagues.js so mock mode and the UI agree with the API.
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

export function weekBounds(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  const endsAt = new Date(start);
  endsAt.setUTCDate(endsAt.getUTCDate() + 7);
  return { id: start.toISOString().slice(0, 10), endsAt: endsAt.toISOString() };
}

// "3 days", "14 hours", "25 minutes": the coarsest unit that is at least 1.
export function timeLeft(endsAt, now = Date.now()) {
  const ms = Math.max(0, new Date(endsAt).getTime() - now);
  const days = Math.floor(ms / 86400000);
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"}`;
  const hours = Math.floor(ms / 3600000);
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const minutes = Math.max(1, Math.floor(ms / 60000));
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
