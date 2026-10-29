import "dotenv/config";
import dns from "node:dns";

// Set before MongoDB performs SRV/TXT discovery. Leave unset to use system DNS.
const servers = (process.env.DNS_SERVERS || "").split(",").map((value) => value.trim()).filter(Boolean);
if (servers.length) {
  try {
    dns.setServers(servers);
    dns.promises.setServers(servers);
  } catch {
    throw new Error("DNS_SERVERS must contain comma-separated DNS server IP addresses.");
  }
}
