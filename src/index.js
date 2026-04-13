import express from "express";
import { PORT } from "./config/env.config.js";
import healthRoute from "./routes/health.routes.js";

const app = express();
app.use(express.json());

// routes
app.use("/api/v1/", healthRoute);
app.use("/", (_, res) => {
  res.json({ message: "in the browser" });
});

// running the server
const server = app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

export default app;

// handle unhandled promise rejection (e.g database connection error)
process.on("unhandledRejection", (err) => {
  console.error("unhandled rejection", err);
  server.close(async () => {
    process.exit(1);
  });
});

// handles uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("uncaught exception", err);
  process.exit(1);
});

// gracefull shutdown
process.on("SIGTERM", async () => {
  console.error("STGTERM received, shutting down gracefully");
  server.close(async () => {
    process.exit(1);
  });
});
