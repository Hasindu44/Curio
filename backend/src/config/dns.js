import dns from "node:dns";
import { env } from "./env.js";

// Must run before MongoDB performs SRV/TXT discovery. Leave DNS_SERVERS empty
// to use the system resolver.
export function configureDns() {
  if (!env.dnsServers.length) return;
  try {
    dns.setServers(env.dnsServers);
    dns.promises.setServers(env.dnsServers);
  } catch {
    throw new Error("DNS_SERVERS must contain comma-separated DNS server IP addresses.");
  }
}
