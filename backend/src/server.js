import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { seedCatalog } from "./seed/seedCatalog.js";

try {
  await connectDatabase(env.mongoUri);
  await seedCatalog();
  createApp().listen(env.port, () => console.log(`Curio API running on http://localhost:${env.port}`));
} catch (error) {
  console.error("Failed to start the API:", error.message);
  process.exit(1);
}
