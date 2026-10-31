// Production entry point. Some hosts (e.g. Hostinger) load the entry file with
// require(), which cannot load the backend's ES modules, so import it here.
import("./backend/src/server.js").catch((error) => {
  console.error("Failed to load the server:", error);
  process.exit(1);
});
