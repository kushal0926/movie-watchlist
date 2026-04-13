import { Router } from "express";

const healthRoute = Router();

healthRoute.get("/health", (_, res) => {
  res.json({ message: "ok" });
});

export default healthRoute;
