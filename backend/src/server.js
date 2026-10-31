import { createApp } from "./app.js";
import { connectDatabase, setStartupError } from "./config/db.js";
import { env, missingEnv } from "./config/env.js";
import { seedCatalog } from "./seed/seedCatalog.js";

// Listen first so the host sees a running app; a failed start-up is then
// visible at GET /api/health instead of a bare 503.
createApp().listen(env.port, () => console.log(`Curio API running on http://localhost:${env.port}`));

// No top-level await: hosts that load this file with require() reject it.
async function start() {
  if (missingEnv.length) throw new Error(`Missing environment variables: ${missingEnv.join(", ")}`);
  await connectDatabase(env.mongoUri);
  await seedCatalog();
}

start().catch((error) => {
  setStartupError(error.message);
  console.error("Failed to start the API:", error.message);
});
