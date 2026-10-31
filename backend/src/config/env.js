import "dotenv/config";

// Read once at startup. server.js reports any missing setting.
const required = ["MONGODB_URI", "JWT_SECRET"];
export const missingEnv = required.filter((key) => !process.env[key]);

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
