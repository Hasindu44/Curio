import "dotenv/config";

// Read once at startup so a missing setting fails fast with a clear message.
const required = ["MONGODB_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length && process.env.NODE_ENV !== "test") {
  console.error(`Missing ${missing.join(", ")}. Copy backend/.env.example to backend/.env and fill them in.`);
  process.exit(1);
}

export const env = {
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  dnsServers: (process.env.DNS_SERVERS || "").split(",").map((value) => value.trim()).filter(Boolean),
  instructor: {
    name: process.env.INSTRUCTOR_NAME || "Studio Instructor",
    email: process.env.INSTRUCTOR_EMAIL,
    password: process.env.INSTRUCTOR_PASSWORD,
  },
};
