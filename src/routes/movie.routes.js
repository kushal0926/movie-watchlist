import { Router } from "express";

const movieRoute = Router();

movieRoute.get("/", (req, res) => {
  res.json({ httpMethod: "get" });
});

movieRoute.post("/", (req, res) => {
  res.json({ httpMethod: "post" });
});

movieRoute.put("/", (req, res) => {
  res.json({ httpMethod: "put" });
});

movieRoute.delete("/", (req, res) => {
  res.json({ httpMethod: "delete" });
});
export default movieRoute;
