import express from "express";
import { config } from "dotenv";
import healthRoute from "./routes/health.routes.js";
import { connectDB, disconnectDB } from "./config/database.config.js";
import authRoute from "./routes/auth.routes.js";
import { PORT } from "./config/env.config.js";
import movieRoute from "./routes/movie.routes.js";
import watchlistRoute from "./routes/watchlist.routes.js";

config({
  quiet: true,
});
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/v1", healthRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/movie", movieRoute);
app.use("/v1/watchlist", watchlistRoute);

// app.use("/", (_, res) => {
//   res.json({ message: "in the browser" });
// });

// running the server
const server = app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
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
