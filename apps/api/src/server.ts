import { app } from "./app.js";
import { env } from "./config.js";

const server = app.listen(env.PORT, () => {
  console.log(
    `MakerBench API listening on port ${env.PORT}`
  );
});

function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
