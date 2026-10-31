import cors from "cors";
import express from "express";
import helmet from "helmet";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

// Built React app (npm run build). Served by the API in production so one
// Node process hosts the whole site.
const clientDist = fileURLToPath(new URL("../../frontend/dist", import.meta.url));

// Builds the Express app without starting it, so tests can use it directly.
export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(express.json({ limit: "100kb" }));

  app.use("/api", routes);
  app.use("/api", notFound);

  if (existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // Any other GET is a client-side route: let React Router handle it.
    app.get("/{*path}", (_req, res) => res.sendFile("index.html", { root: clientDist }));
  }

  app.use(errorHandler);
  return app;
}
