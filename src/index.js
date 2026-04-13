import express from "express";
import { config } from "dotenv";
import healthRoute from "./routes/health.routes.js";
import { connectDB, disconnectDB } from "./config/database.config.js";

config({
  quiet: true,
});
connectDB()

const app = express();
app.use(express.json());
const port = process.env.PORT;

// routes
app.use("/api/v1/", healthRoute);
app.use("/", (_, res) => {
  res.json({ message: "in the browser" });
});

// running the server
const server = app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});

export default app;

// handle unhandled promise rejection (e.g database connection error)
process.on("unhandledRejection", (err) => {
  console.error("unhandled rejection", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// handles uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("uncaught exception", err);
  await disconnectDB();
  process.exit(1);
});

// gracefull shutdown
process.on("SIGTERM", async () => {
  console.error("STGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});